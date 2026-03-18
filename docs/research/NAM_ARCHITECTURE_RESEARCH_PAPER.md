# Neural Amp Modeler (Trainer): Architecture, Governance, and Proposed Directions

**Scope:** `neural-amp-modeler` — Python package for training gear models and exporting `.nam` files. Real-time playback lives in **NeuralAmpModelerPlugin** + **NeuralAmpModelerCore** (out of scope for code paths here, but relevant for any architecture change that must export/load in C++).

**Repository reviewed:** local clone of `sdatkinson/neural-amp-modeler` (~319 commits at time of review).

---

## 1. Executive summary

NAM trains a neural network to map DI guitar/bass input \(x(t)\) to reamped output \(y(t)\). The **dominant architecture** is a **causal dilated WaveNet-style stack** with optional **gated activations** (tanh × sigmoid), **residual** connections, **global conditioning** on the input waveform, and recent extensions: **FiLM**, **grouped convolutions**, **bottlenecks**, **optional auxiliary WaveNet (`condition_dsp`)**, and **slimmable channel slicing** for one model / multiple CPU budgets.

The project is **MIT licensed**, **BDFL-style maintenance** (primary author ~90%+ commits), with **no standalone CONTRIBUTING.md** — contribution norms are implicit via GitHub issues/PRs and issue templates.

This document ends with **three concrete architectural change proposals**: (A) hybrid WaveNet + state-space block for long memory vs depth, (B) depthwise-separable or grouped dilated backbone for inference cost, (C) training-time **feature matching / distillation** head for slimmable student quality.

---

## 2. License

| Item | Detail |
|------|--------|
| **License** | MIT |
| **Copyright** | 2019–2025 Steven Atkinson |
| **Implications** | Commercial use, modification, and redistribution allowed with license notice. No patent grant text (standard MIT). Bundled **auraloss** was moved into-repo (`#592`); verify third-party notices if redistributing. |

**Takeaway:** Forking and experimental architectures are legally straightforward; plugin/Core compatibility and `.nam` spec versioning remain the practical constraints.

---

## 3. Contributing guidelines and community process

| Artifact | Present? | Notes |
|----------|----------|--------|
| `CONTRIBUTING.md` | **No** | Expectations not centralized in-repo. |
| Issue templates | **Yes** | `.github/ISSUE_TEMPLATE/` — bug reports (OS, local vs Colab, version) and feature requests. |
| CI | **Yes** | `python-package.yml`, `integration-tests.yml`. |
| Code review | **GitHub PRs** | Inferred from merge commit messages (`#646`, etc.). |

**Cultural signal:** Small contributor base; most merges trace to the maintainer. External contributors appear in commit counts (Mike Oliphant, vossen, Dom Mcsweeney, etc.) but volume is low relative to core author.

---

## 4. Commit history (high level)

**Scale:** ~319 commits (full history after unshallow).

**Author concentration (approximate):**

| Author (as in git) | Commits |
|--------------------|--------|
| Steven Atkinson | 274 |
| Mike Oliphant | 8 |
| vossen | 6 |
| sdatkinson | 6 |
| Others | ≤3 each |

**Thematic phases (from log messages):**

1. **Foundations** — Lightning training module, losses (MSE, ESR, MRSTFT, pre-emphasis), LSTM path, WaveNet export.
2. **Data / UX** — Latency compensation, calibration metadata (`input_level_dbu` / `output_level_dbu`), dataset handshakes, GUI trainer, Colab.
3. **Model expressivity** — Sequential compositional models, custom losses, activations, WaveNet bottlenecks, head/layer 1×1, grouped convs, FiLM, `condition_dsp`.
4. **Slimmable inference** — Channel-slicing WaveNet, allowed channel sets, boosting mode, init strategies, export version bumps (e.g. 0.7.0).
5. **Hardening** — MPS workarounds, long-sequence tests, integration tests, slimmable validation.

**Breaking changes observed in history:** ONNX removal, module renames, non-integer latency removal, Python floor raises — any new architecture should plan for **export version** and **Core/plugin** handshake.

---

## 5. Repository layout (training-relevant)

| Area | Role |
|------|------|
| `nam/models/wavenet/` | WaveNet: `_wavenet.py`, `_layer_array.py`, `_conv.py`, `_film.py`, `_slimmable*.py` |
| `nam/models/recurrent.py` | LSTM variant with custom init, burn-in, truncate BPTT, learnable initial state |
| `nam/models/linear.py`, `conv_net.py`, `sequential.py` | Baseline / compositional architectures |
| `nam/models/factory.py` | Registry: `WaveNet`, `LSTM`, `Linear`, `ConvNet`, `Sequential` + dynamic import |
| `nam/train/` | `lightning_module.py`, `core.py`, `full.py`, `colab.py`, GUI |
| `nam/models/losses.py` | MSE, ESR, MRSTFT, FFT MSE, pre-emphasis |
| `docs/source/model-file.rst` | `.nam` JSON spec |

---

## 6. The `.nam` artifact

Exported models are **JSON** with:

- `version` — semantic versioning of file format  
- `architecture` — class name (e.g. `"WaveNet"`, `"LSTM"`)  
- `config` — architecture-specific hyperparameters  
- `weights` — flat `float` list; layout defined per-architecture (`export_weights` / plugin loader)  
- Optional: `sample_rate`, `metadata` (gear, training, levels, etc.)

**Implication:** New layers or tensor layouts require **coordinated updates** to NeuralAmpModelerCore’s C++ factory and weight packing — not only Python.

---

## 7. Architecture deep dive: WaveNet (primary path)

### 7.1 Problem formulation

**Causal sequence-to-sequence:** At time \(t\), output may depend only on inputs \(x_{\le t}\). The network implements \( \hat{y}(t) = f(x_{t-R+1:t}) \) with receptive field \(R\) (plus any stateful path in LSTM).

### 7.2 Top-level `WaveNet` (`nam/models/wavenet/_wavenet.py`)

- **Inputs:** `x` shape `(B, C_x, L)` (DI).  
- **Optional `condition_dsp`:** Another WaveNet applied to `x` producing conditioning tensor `c` with temporal alignment; main stack consumes `(x, c)`.  
- **Stack:** One or more **`LayerArray`** modules in series.  
- **Head:** Optional MLP head (`_Head`) on accumulated skip features; `head_scale` scalar appended to exported weights.  
- **Receptive field (global):**  
  \[
  R_{\text{total}} = 1 + \sum_i (R_i - 1) + (R_{\text{cond}} - 1)
  \]
  when `condition_dsp` present.

### 7.3 `LayerArray` — dilated residual stack

- **RechannelIn:** Projects input to internal `channels`.  
- **Layers:** List of **`_Layer`**, each with its own **dilation** \(d_i\).  
- **Receptive field per array:**  
  \[
  R = 1 + (k - 1) \sum_i d_i
  \]
  for kernel size \(k\) (typically 3).  
- **Forward:** For each dilated layer, **head branch** contributes to a running sum; output is **HeadRechannel** on accumulated head features, plus residual stream through the stack.

### 7.4 Single dilated layer `_Layer` — data flow

Per layer (conceptually):

1. **Dilated conv** on residual stream `x` → `z_conv` (optional **FiLM** from `c` pre/post).  
2. **Input mixer:** 1×1 conv on conditioning `c` → `mix_out`, aligned in time.  
3. **Combine:** `z1 = z_conv + mix_out` (local residual in feature space).  
4. **Activation:** Standard activation or **pairing** (e.g. **gated:** `tanh · σ`) → `post_activation`.  
5. **Optional 1×1** `layer1x1` (bottleneck ↔ channels); optional **head1x1** for head path.  
6. **Residual to next depth:** `x_out = x_aligned + layer_output`.

This matches the **WaveNet** paradigm: dilated causal conv + **global conditioning** (here: full DI or processed DI) + **gated nonlinearity** + **residual**.

### 7.5 Optional mechanisms

| Mechanism | Purpose |
|-----------|---------|
| **Bottleneck** | Widen then narrow activations; fewer params in wide convs. |
| **FiLM** | Modulate features from conditioning; enables richer input-dependent behavior. |
| **Grouped conv** | Parameter / FLOP tradeoffs; must match export/Core. |
| **`condition_dsp`** | Learned conditioning network (e.g. extra modeling capacity without duplicating full stack). |
| **Slimmable** | Train once; export subset of channels for lighter runtime (constraints: single layer array, no FiLM/groups/head1x1 in some modes — see `_validate_slimmable_config`). |

### 7.6 LSTM path (summary)

- **Purpose:** Lower latency / smaller RF per step; stateful inference.  
- **Training:** `train_burn_in`, `train_truncate` for BPTT; **learnable** initial hidden/cell; LSTM biases tweaked toward easier long-term memory (forget gate bias +1 style).  
- **Code comment TODO:** “recognition head to start the hidden state in a good place?” — acknowledges **cold-start** quality issue.

### 7.7 Training objective (Lightning)

- **Primary:** Weighted **MSE**, optional **MRSTFT**, **DC**, **pre-emphasis** variants, **custom losses** (registry-init).  
- **Validation metric:** MSE or **ESR** (error-to-signal ratio; batch semantics documented in code).  
- **Checkpointing:** Driven by chosen val loss.

---

## 8. Dependencies (training stack)

From `pyproject.toml`: PyTorch, PyTorch Lightning, librosa, numpy, scipy, pydantic, matplotlib, tensorboard, sounddevice, wavio, tqdm, transformers (version floor). **GPU** training is the typical path; MPS has known historical quirks (long-sequence workarounds).

---

## 9. Three proposed architectural changes

Each proposal targets a different axis: **accuracy/long-term behavior**, **runtime performance**, **training / slimming quality**. All assume **downstream Core/plugin** can be updated or gated behind new export versions.

---

### Proposal 1 — Hybrid stack: shallow dilated front + long-context block (accuracy & memory)

**Problem:** Very deep WaveNets increase **latency and CPU cost** linearly with depth; **LSTM** captures state but is harder to train for full amp nonlinearities. Amps exhibit **short-time distortion** (needs local context) and **slower dynamics** (sag, power supply, thermal-ish effects) over tens–hundreds of ms.

**Proposal:** Architect a **two-stage causal backbone**:

1. **Front:** Keep existing **dilated WaveNet-style stack** with moderate RF (e.g. 1–3 ms) dedicated to **fast nonlinearities**.  
2. **Back:** Insert a **lightweight temporal block** with **sublinear depth in sequence length** — e.g. **single-layer S4/S5/Mamba-style state-space layer**, or **strided dilated encoder** + **upsample skip** — operating on **bottleneck features** (not raw audio) to inject **long-context bias** before the head.

**Expected benefits:** Better modeling of **slow envelopes** and **level-dependent sag** without stacking 20+ dilated layers. Potentially **lower inference FLOPs** than reaching the same temporal span with pure dilation.

**Risks:** State-space blocks complicate **real-time C++ inference** (state update stability, fixed-point); **export format** and Core would need a new op family. Research phase should prototype in PyTorch with **streaming equivalence** tests.

**Axes:** Accuracy (long-term behavior), inference (possible win), training (more hyperparameters, staged pretraining).

---

### Proposal 2 — Depthwise-separable dilated convolutions in `_Layer` (performance)

**Problem:** Each dilated layer uses **dense** `Conv1d(channels → mid_channels)` with dilation. For large `channels`, this dominates **MACs** in the plugin.

**Proposal:** Replace (or optionally substitute) the main **LayerConv** with **depthwise-separable** structure: **depthwise dilated** conv over channels, then **pointwise** 1×1 to `mid_channels` (and symmetric for mixer path if needed). Gating (tanh/sigmoid split) stays on the **bottleneck** activations.

**Expected benefits:** **Large reduction in multiply-accumulates** for wide models; enables **wider nets** at same CPU budget — often improves **perceptual quality** per FLOP for audio.

**Risks:** May need **more channels** to match full-conv expressivity; **weight layout** changes require **new export branch** and Core kernels. Should be benchmarked against **slimmable** models on the same budget.

**Axes:** Performance (inference), possible accuracy (wider at fixed cost).

---

### Proposal 3 — Training-only distillation / feature matching for slimmable students (training UX & end-user quality)

**Problem:** **Slimmable** training slices channels for deployment; smaller slices can **underfit** compared to the full-width teacher. Users want **one training run** and **multiple export tiers** without retraining from scratch.

**Proposal:** Extend training so the **full-width** network is the **teacher** and each **allowed channel width** (or a subset) is a **student** sharing the same graph:

- Add **hidden-state L2 or cosine losses** between teacher and student activations at one or more depths (after activation, before residual add).  
- Optionally **soft-target** on head output with temperature.  
- **Loss schedule:** ramp distillation after MSE/MRSTFT stabilizes.

**Expected benefits:** **Better small-slice exports** (cleaner highs, less “smear”) without separate teacher/student training jobs. Improves **user experience** of slimmable workflow.

**Risks:** Training time and memory increase; must not break **export weight ordering**; only valid where slimmable constraints already allow training (today: no FiLM + slimmable, etc.).

**Axes:** Training experience, end-user quality (slim models), slight training cost.

---

## 10. Conclusion

The Neural Amp Modeler trainer is a **mature, MIT-licensed** pipeline centered on a **highly configurable causal WaveNet** with a clear **export contract** (`.nam`). Evolution is **incremental and export-aware** (slimmable, FiLM, condition_dsp). The three proposals above — **hybrid long-context block**, **separable dilated convs**, and **slimmable distillation** — are **orthogonal** and could be pursued independently, with **Proposal 2** and **Proposal 1** demanding the most **Core/plugin** engineering.

---

## References (internal to reviewed repo)

- `LICENSE` — MIT terms  
- `docs/source/model-file.rst` — `.nam` specification  
- `nam/models/wavenet/_wavenet.py`, `_layer_array.py` — WaveNet topology  
- `nam/models/recurrent.py` — LSTM training tricks  
- `nam/train/lightning_module.py` — losses and validation  
- ESR definition comment in `lightning_module.py` → MDPI paper (Eq. 10)  

---

*Document version: 1.0 — research memo, not peer-reviewed.*
