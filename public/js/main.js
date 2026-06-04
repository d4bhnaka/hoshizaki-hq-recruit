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

    // close button + backdrop click — どちらも data-drawer-close で拾う
    var closeTargets = drawer.querySelectorAll("[data-drawer-close]");
    closeTargets.forEach(function (el) {
      el.addEventListener("click", function () {
        setOpen(false);
      });
    });

    // メニュー内リンクをクリックしたら自動で閉じる
    var links = drawer.querySelectorAll("a[href]");
    links.forEach(function (link) {
      link.addEventListener("click", function () {
        setOpen(false);
      });
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
    var empty = document.querySelector("[data-person-empty]");

    function applyFilter(value) {
      var visible = 0;
      cards.forEach(function (card) {
        var tags = (card.getAttribute("data-person-tags") || "").split(/\s+/);
        var match = value === "all" || tags.indexOf(value) !== -1;
        card.style.display = match ? "" : "none";
        if (match) visible++;
      });
      if (empty) empty.hidden = visible !== 0;
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

  // --------------------------------------------
  // Internship: course carousel (Swiper) + tab content switching
  // --------------------------------------------
  function initInternship() {
    var swiperEl = document.querySelector("[data-course-swiper]");
    if (!swiperEl) return;

    var cards = document.querySelectorAll("[data-course-tab]");
    var panels = document.querySelectorAll("[data-course-panel]");

    function selectCourse(id) {
      cards.forEach(function (card) {
        card.setAttribute(
          "aria-pressed",
          card.getAttribute("data-course-tab") === id ? "true" : "false"
        );
      });
      panels.forEach(function (panel) {
        if (panel.getAttribute("data-course-panel") === id) {
          panel.removeAttribute("hidden");
        } else {
          panel.setAttribute("hidden", "");
        }
      });
    }

    cards.forEach(function (card) {
      card.addEventListener("click", function () {
        selectCourse(card.getAttribute("data-course-tab"));
      });
    });

    if (typeof Swiper !== "undefined") {
      new Swiper(swiperEl, {
        slidesPerView: 1.15,
        spaceBetween: 16,
        watchOverflow: true,
        breakpoints: {
          600: { slidesPerView: 2.2, spaceBetween: 20 },
          900: { slidesPerView: 3, spaceBetween: 24 },
          1200: { slidesPerView: 3.4, spaceBetween: 28 },
        },
        navigation: {
          nextEl: "[data-course-next]",
          prevEl: "[data-course-prev]",
        },
      });
    }
  }

  // --------------------------------------------
  // Environment: Office Tour 写真カルーセル（拠点ごとに Swiper）
  // --------------------------------------------
  function initOfficeTour() {
    var blocks = document.querySelectorAll("[data-office]");
    if (!blocks.length || typeof Swiper === "undefined") return;

    blocks.forEach(function (block) {
      var swiperEl = block.querySelector("[data-office-swiper]");
      if (!swiperEl) return;

      new Swiper(swiperEl, {
        // 中央のスライドが選択中（.swiper-slide-active）＝一回り大きく表示。
        // CSS 側で active 以外を scale(0.81) に縮小して中央を強調する。
        centeredSlides: true,
        loop: true,
        slideToClickedSlide: true,
        grabCursor: true,
        // フルブリード（ウィンドウ全幅）表示のため、画面が広いほど枚数を増やして
        // 1枚あたりのサイズが過大にならないようにする。
        slidesPerView: 1.3,
        spaceBetween: 16,
        breakpoints: {
          600: { slidesPerView: 2.0, spaceBetween: 20 },
          900: { slidesPerView: 2.6, spaceBetween: 28 },
          1280: { slidesPerView: 3.0, spaceBetween: 32 },
          1600: { slidesPerView: 3.4, spaceBetween: 36 },
        },
        navigation: {
          prevEl: block.querySelector("[data-office-prev]"),
          nextEl: block.querySelector("[data-office-next]"),
        },
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      initDrawer();
      initPersonFilter();
      initInternship();
      initOfficeTour();
    });
  } else {
    initDrawer();
    initPersonFilter();
    initInternship();
    initOfficeTour();
  }
})();
