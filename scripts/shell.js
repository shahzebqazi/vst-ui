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
  var themeButtons = document.querySelectorAll("[data-theme]");
  var sizeButtons = document.querySelectorAll("[data-mockup-size]");
  var mockupLinks = document.querySelectorAll(".mockup-link");
  var disclosures = document.querySelectorAll(".nav-disclosure");
  var disclosureMockups = document.getElementById("disclosure-mockups");
  var overview = document.getElementById("shell-overview");
  var THEME_STORAGE_KEY = "vst-ui-wallpaper";
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

  function activeMockupLink() {
    return document.querySelector(".mockup-link.is-active");
  }

  function shouldShowMockupPanel() {
    return !!(mockupsSectionOpen() && activeMockupLink());
  }

  function hideAllMockupViewports() {
    rightPanel.classList.remove("right-panel--chromeless-active");
    phoneFrame.hidden = true;
    phoneFrame.setAttribute("aria-hidden", "true");
    if (chromelessPanel) {
      chromelessPanel.hidden = true;
      chromelessPanel.setAttribute("aria-hidden", "true");
    }
    disconnectChromelessResizeTracking();
    if (chromelessIframe) chromelessIframe.style.height = "";
  }

  /**
   * Idle: hide the entire mockup pane so no blank component or placeholder renders.
   * Active: load only the selected mockup URL.
   */
  function applyActiveMockupViewport() {
    if (!rightPanel || !shouldShowMockupPanel()) {
      hideAllMockupViewports();
      return;
    }

    var active = activeMockupLink();
    var url = active.getAttribute("href");
    var chromeless = active.getAttribute("data-mockup-chrome") === "chromeless";
    if (chromeless && chromelessIframe) {
      setViewportMode(true);
      chromelessIframe.src = url;
      iframe.src = "about:blank";
    } else {
      setViewportMode(false);
      iframe.src = url;
      if (chromelessIframe) chromelessIframe.src = "about:blank";
    }
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
    applyLayout();
    applyActiveMockupViewport();
  }

  window.clearVstChromelessMockup = function () {
    clearMockup();
  };

  function applyLayout() {
    var wide = mq.matches;
    var split = shouldShowMockupPanel();
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
      hideAllMockupViewports();
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
      applyActiveMockupViewport();
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

  restoreThemeFromStorage();
  syncOverviewVisibility();
  syncNavDensity();
  applyLayout();
  var sizeKey = defaultMockupSizeKey();
  applyMockupSize(sizeKey);
  applyActiveMockupViewport();

  if (mockupFrameClose) {
    mockupFrameClose.addEventListener("click", function () {
      clearMockup();
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
      themeButtons.forEach(function (b) {
        b.classList.toggle("is-active", b === btn);
        b.setAttribute("aria-pressed", b === btn ? "true" : "false");
      });
    });
  });

  sizeButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      applyMockupSize(btn.getAttribute("data-mockup-size"));
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
      applyLayout();
      applyActiveMockupViewport();
    });
  });
})();
