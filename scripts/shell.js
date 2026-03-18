/**
 * Shell behavior for index.html: theme, disclosures, mockup iframes, localStorage.
 * See PLAYBOOK.md §5 deliverables.
 */
(function () {
  var WIDE_MQ = "(min-width: 768px)";
  var mq = window.matchMedia(WIDE_MQ);
  var shell = document.getElementById("app-shell");
  var rightPanel = document.getElementById("right-panel");
  var phoneFrame = document.getElementById("phone-frame");
  var iframe = document.getElementById("mockup-iframe");
  var chromelessPanel = document.getElementById("chromeless-panel");
  var chromelessIframe = document.getElementById("chromeless-iframe");
  var placeholder = document.getElementById("mockup-placeholder");
  var themeButtons = document.querySelectorAll("[data-theme]");
  var sizeButtons = document.querySelectorAll("[data-mockup-size]");
  var mockupLinks = document.querySelectorAll(".mockup-link");
  var disclosures = document.querySelectorAll(".nav-disclosure");
  var disclosureMockups = document.getElementById("disclosure-mockups");
  var overview = document.getElementById("shell-overview");
  var THEME_STORAGE_KEY = "vst-ui-wallpaper";
  var SHELL_STATE_KEY = "vst-ui-shell-state";
  var THEME_CLASSES = ["bg-blueprint", "bg-paper", "bg-dark-dots"];
  var disclosureUi = document.getElementById("disclosure-ui");
  var disclosureDocs = document.getElementById("disclosure-docs");
  var mockupFrameClose = document.getElementById("mockup-frame-close");
  var chromelessResizeObserver = null;

  function disconnectChromelessResizeTracking() {
    if (chromelessResizeObserver) {
      chromelessResizeObserver.disconnect();
      chromelessResizeObserver = null;
    }
  }

  function syncChromelessIframeHeight() {
    if (!chromelessIframe || !chromelessPanel || chromelessPanel.hidden) return;
    try {
      var doc = chromelessIframe.contentDocument;
      if (!doc) return;
      var loc = doc.location;
      var href = loc && loc.href ? String(loc.href) : "";
      if (!href || href.indexOf("about:blank") === 0) {
        chromelessIframe.style.height = "";
        return;
      }
      var el = doc.documentElement;
      var b = doc.body;
      var h = el ? el.scrollHeight : 0;
      if (b) {
        h = Math.max(h, b.scrollHeight, b.offsetHeight);
      }
      chromelessIframe.style.height = Math.ceil(Math.max(h, 72)) + "px";
    } catch (err) {}
  }

  function attachChromelessResizeTracking() {
    disconnectChromelessResizeTracking();
    if (!chromelessIframe || chromelessPanel.hidden) return;
    try {
      var doc = chromelessIframe.contentDocument;
      if (!doc || !doc.body || typeof ResizeObserver === "undefined") return;
      chromelessResizeObserver = new ResizeObserver(function () {
        syncChromelessIframeHeight();
      });
      chromelessResizeObserver.observe(doc.documentElement);
      chromelessResizeObserver.observe(doc.body);
    } catch (e) {}
  }

  if (chromelessIframe) {
    chromelessIframe.addEventListener("load", function () {
      requestAnimationFrame(function () {
        syncChromelessIframeHeight();
        requestAnimationFrame(function () {
          syncChromelessIframeHeight();
          attachChromelessResizeTracking();
        });
      });
    });
  }

  window.addEventListener("resize", function () {
    syncChromelessIframeHeight();
  });

  var MOCKUP_SIZES = {
    phone: { w: 390, h: 844, className: "phone-frame--phone" },
    ableton: { w: 340, h: 200, className: "phone-frame--ableton" },
    desktop: { w: 960, h: 600, className: "phone-frame--desktop" },
  };

  function countOpenDisclosures() {
    var n = 0;
    disclosures.forEach(function (d) {
      if (d.open) n++;
    });
    return n;
  }

  function anyDisclosureOpen() {
    return countOpenDisclosures() > 0;
  }

  function syncNavDensity() {
    var compact = countOpenDisclosures() >= 3;
    shell.classList.toggle("app-shell--nav-compact", compact);
  }

  function readShellState() {
    try {
      var raw = localStorage.getItem(SHELL_STATE_KEY);
      if (!raw) return null;
      var o = JSON.parse(raw);
      if (!o || typeof o !== "object") return null;
      return o;
    } catch (e) {
      return null;
    }
  }

  /** One-time migration from older localStorage keys. */
  function normalizeShellState(s) {
    if (!s || typeof s !== "object") return s;
    if (s.disclosureBlueprints && !s.disclosureMockups) {
      s.disclosureMockups = true;
    }
    if (s.mockupId === "components-list") {
      s.mockupId = "components-chromeless";
    }
    /* Mockup selection should never auto-restore. */
    s.mockupId = null;
    s.mockupChromeless = false;
    return s;
  }

  function writeShellState(state) {
    try {
      localStorage.setItem(SHELL_STATE_KEY, JSON.stringify(state));
    } catch (e) {}
  }

  function persistShellState() {
    writeShellState({
      disclosureUi: !!(disclosureUi && disclosureUi.open),
      disclosureMockups: !!(disclosureMockups && disclosureMockups.open),
      disclosureDocs: !!(disclosureDocs && disclosureDocs.open),
      /* Never persist a selected mockup: opening Mockups must stay blank until click. */
      mockupId: null,
      mockupChromeless: false,
      mockupSize: phoneFrame.dataset.size || defaultMockupSizeKey(),
    });
  }

  function applyDisclosuresFromState(s) {
    if (!s) return;
    if (disclosureUi) disclosureUi.open = !!s.disclosureUi;
    if (disclosureMockups) disclosureMockups.open = !!s.disclosureMockups;
    if (disclosureDocs) disclosureDocs.open = !!s.disclosureDocs;
  }

  function setViewportMode(chromeless) {
    if (chromeless) {
      rightPanel.classList.add("right-panel--chromeless-active");
      phoneFrame.hidden = true;
      phoneFrame.setAttribute("aria-hidden", "true");
      if (chromelessPanel) {
        chromelessPanel.hidden = false;
        chromelessPanel.setAttribute("aria-hidden", "false");
      }
    } else {
      rightPanel.classList.remove("right-panel--chromeless-active");
      phoneFrame.hidden = false;
      phoneFrame.setAttribute("aria-hidden", "false");
      if (chromelessPanel) {
        chromelessPanel.hidden = true;
        chromelessPanel.setAttribute("aria-hidden", "true");
      }
      disconnectChromelessResizeTracking();
      if (chromelessIframe) chromelessIframe.style.height = "";
    }
  }

  function mockupsSectionOpen() {
    return disclosureMockups && disclosureMockups.open;
  }

  /**
   * Idle: hide both viewports so no blank / about:blank mockup appears.
   * Active: load only the selected mockup URL (never assign about:blank to visible UI).
   */
  function applyActiveMockupViewport() {
    if (!rightPanel || rightPanel.hidden) return;
    if (!mockupsSectionOpen()) return;

    var active = document.querySelector(".mockup-link.is-active");
    if (!active) {
      rightPanel.classList.remove("right-panel--chromeless-active");
      phoneFrame.hidden = true;
      phoneFrame.setAttribute("aria-hidden", "true");
      if (chromelessPanel) {
        chromelessPanel.hidden = true;
        chromelessPanel.setAttribute("aria-hidden", "true");
      }
      if (placeholder) placeholder.hidden = false;
      disconnectChromelessResizeTracking();
      if (chromelessIframe) chromelessIframe.style.height = "";
      return;
    }

    var url = active.getAttribute("href");
    var chromeless = active.getAttribute("data-mockup-chrome") === "chromeless";
    if (chromeless && chromelessIframe) {
      setViewportMode(true);
      chromelessIframe.src = url;
    } else {
      setViewportMode(false);
      iframe.src = url;
    }
    if (placeholder) placeholder.hidden = true;
  }

  function restoreMockupFromState(s) {
    if (!s || !s.mockupId || !disclosureMockups || !disclosureMockups.open) return;
    var link = document.querySelector('.mockup-link[data-mockup="' + s.mockupId + '"]');
    if (!link) return;
    mockupLinks.forEach(function (l) {
      l.classList.toggle("is-active", l === link);
    });
  }

  function syncOverviewVisibility() {
    var anyOpen = anyDisclosureOpen();
    if (overview) {
      overview.hidden = anyOpen;
      overview.setAttribute("aria-hidden", anyOpen ? "true" : "false");
    }
  }

  function clearMockup() {
    mockupLinks.forEach(function (l) {
      l.classList.remove("is-active");
    });
    applyActiveMockupViewport();
  }

  window.clearVstChromelessMockup = function () {
    clearMockup();
    persistShellState();
  };

  function applyLayout() {
    var wide = mq.matches;
    var split = mockupsSectionOpen();
    shell.dataset.layoutWide = wide ? "true" : "false";
    shell.dataset.layoutSplit = split ? "true" : "false";
    shell.classList.remove(
      "app-shell--intro",
      "app-shell--split-wide",
      "app-shell--split-narrow"
    );
    if (!split) {
      shell.classList.add("app-shell--intro");
      rightPanel.setAttribute("aria-hidden", "true");
      rightPanel.hidden = true;
    } else {
      rightPanel.hidden = false;
      rightPanel.setAttribute("aria-hidden", "false");
      if (wide) {
        shell.classList.add("app-shell--split-wide");
      } else {
        shell.classList.add("app-shell--split-narrow");
      }
    }
  }

  function applyMockupSize(key) {
    var spec = MOCKUP_SIZES[key] || MOCKUP_SIZES.phone;
    phoneFrame.style.width = "";
    phoneFrame.style.height = "";
    phoneFrame.classList.remove(
      "phone-frame--phone",
      "phone-frame--ableton",
      "phone-frame--desktop"
    );
    phoneFrame.classList.add(spec.className);
    phoneFrame.dataset.size = key;
    sizeButtons.forEach(function (b) {
      var on = b.getAttribute("data-mockup-size") === key;
      b.classList.toggle("is-active", on);
      b.setAttribute("aria-pressed", on ? "true" : "false");
    });
  }

  disclosures.forEach(function (d) {
    d.addEventListener("toggle", function () {
      syncOverviewVisibility();
      syncNavDensity();
      applyLayout();
      if (d === disclosureMockups && disclosureMockups) {
        if (disclosureMockups.open) {
          /* Opening Mockups should show only the placeholder until an explicit click. */
          clearMockup();
        } else {
          clearMockup();
        }
      }
      persistShellState();
    });
  });

  if (typeof mq.addEventListener === "function") {
    mq.addEventListener("change", applyLayout);
  } else {
    mq.addListener(applyLayout);
  }

  function defaultMockupSizeKey() {
    var narrow = window.matchMedia("(max-width: 767px)").matches;
    return narrow ? "phone" : "desktop";
  }

  function validMockupSizeKey(k) {
    return k === "phone" || k === "ableton" || k === "desktop";
  }

  function restoreThemeFromStorage() {
    var saved = localStorage.getItem(THEME_STORAGE_KEY);
    document.body.classList.remove("bg-blueprint", "bg-paper", "bg-dark-dots");
    if (saved && THEME_CLASSES.indexOf(saved) !== -1) {
      document.body.classList.add(saved);
    } else {
      document.body.classList.add("bg-blueprint");
    }
    themeButtons.forEach(function (b) {
      var t = b.getAttribute("data-theme");
      var on = document.body.classList.contains(t);
      b.classList.toggle("is-active", on);
      b.setAttribute("aria-pressed", on ? "true" : "false");
    });
  }

  var initialShell = normalizeShellState(readShellState());
  applyDisclosuresFromState(initialShell);
  restoreThemeFromStorage();
  syncOverviewVisibility();
  syncNavDensity();
  applyLayout();
  var sizeKey =
    initialShell && validMockupSizeKey(initialShell.mockupSize)
      ? initialShell.mockupSize
      : defaultMockupSizeKey();
  applyMockupSize(sizeKey);
  /* Never restore a previously selected mockup on page load. */
  applyActiveMockupViewport();
  if (initialShell) {
    persistShellState();
  }

  if (mockupFrameClose) {
    mockupFrameClose.addEventListener("click", function () {
      clearMockup();
      persistShellState();
    });
  }

  themeButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var theme = btn.getAttribute("data-theme");
      document.body.classList.remove("bg-blueprint", "bg-paper", "bg-dark-dots");
      document.body.classList.add(theme);
      try {
        localStorage.setItem(THEME_STORAGE_KEY, theme);
      } catch (e) {}
      persistShellState();
      themeButtons.forEach(function (b) {
        b.classList.toggle("is-active", b === btn);
        b.setAttribute("aria-pressed", b === btn ? "true" : "false");
      });
    });
  });

  sizeButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      applyMockupSize(btn.getAttribute("data-mockup-size"));
      persistShellState();
    });
  });

  mockupLinks.forEach(function (link) {
    link.addEventListener("click", function (e) {
      if (!mockupsSectionOpen()) return;
      e.preventDefault();
      mockupLinks.forEach(function (l) {
        l.classList.remove("is-active");
      });
      link.classList.add("is-active");
      applyActiveMockupViewport();
      persistShellState();
    });
  });
})();
