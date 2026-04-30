// ============================================
// Hoshizaki Recruit Site — interactive scripts
// (handed off as plain readable JS — no bundler)
// ============================================

(function () {
  "use strict";

  // --------------------------------------------
  // Drawer (hamburger menu)
  // --------------------------------------------
  function initDrawer() {
    var toggle = document.querySelector("[data-drawer-toggle]");
    var drawer = document.getElementById("l-drawer");
    if (!toggle || !drawer) return;

    function setOpen(open) {
      if (open) {
        drawer.removeAttribute("hidden");
        // allow CSS transition by deferring the data attribute one frame
        requestAnimationFrame(function () {
          drawer.setAttribute("data-open", "true");
        });
        toggle.setAttribute("aria-expanded", "true");
        toggle.setAttribute("aria-label", "メニューを閉じる");
        document.body.style.overflow = "hidden";
      } else {
        drawer.setAttribute("data-open", "false");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "メニューを開く");
        document.body.style.overflow = "";
        // hide after transition (300ms)
        setTimeout(function () {
          if (drawer.getAttribute("data-open") === "false") {
            drawer.setAttribute("hidden", "");
          }
        }, 320);
      }
    }

    toggle.addEventListener("click", function () {
      var isOpen = toggle.getAttribute("aria-expanded") === "true";
      setOpen(!isOpen);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        setOpen(false);
      }
    });
  }

  // --------------------------------------------
  // Person filter (client-side, no JS frameworks)
  // --------------------------------------------
  function initPersonFilter() {
    var tabs = document.querySelectorAll("[data-person-filter]");
    var cards = document.querySelectorAll("[data-person-card]");
    if (!tabs.length || !cards.length) return;

    function applyFilter(value) {
      cards.forEach(function (card) {
        var tags = (card.getAttribute("data-person-tags") || "").split(/\s+/);
        var match = value === "all" || tags.indexOf(value) !== -1;
        card.style.display = match ? "" : "none";
      });
    }

    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        var value = tab.getAttribute("data-person-filter");
        tabs.forEach(function (t) {
          t.setAttribute("aria-pressed", t === tab ? "true" : "false");
        });
        applyFilter(value);
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      initDrawer();
      initPersonFilter();
    });
  } else {
    initDrawer();
    initPersonFilter();
  }
})();
