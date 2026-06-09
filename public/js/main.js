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

    var CARD_STAGGER = 0.035; // 1 枚あたりの遅延（秒）

    function applyFilter(value) {
      var visible = 0;
      cards.forEach(function (card) {
        var tags = (card.getAttribute("data-person-tags") || "").split(/\s+/);
        var match = value === "all" || tags.indexOf(value) !== -1;
        if (match) {
          card.style.display = "";
          // マイクロインタラクション: 一致カードを表示順にスタッガーで再生。
          // クラスを一旦外し、リフローを挟んでから付け直して再アニメーションさせる。
          card.classList.remove("is-filtering");
          void card.offsetWidth;
          card.style.animationDelay = visible * CARD_STAGGER + "s";
          card.classList.add("is-filtering");
          visible++;
        } else {
          card.style.display = "none";
          card.classList.remove("is-filtering");
        }
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

  // --------------------------------------------
  // Page transition — 斜めシアーシャッター（左→右スイープ）
  // 覆う(離脱)→見せる(進入)で 1 回の連続スイープ。進入側のクラス
  // 付与は head のインラインスクリプト（フラッシュ防止）、スタイルは
  // scss/object/component/_c-page-transition.scss を参照。
  // --------------------------------------------
  function initPageTransition() {
    var root = document.documentElement;
    var reduce =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var shutter = document.querySelector(".pt-shutter");

    // CSS カスタムプロパティから時間値(ms)を読む（単一の真実源）
    function readTimeVar(name, fallback) {
      try {
        var v = getComputedStyle(root).getPropertyValue(name).trim();
        if (!v) return fallback;
        if (v.indexOf("ms") !== -1) return parseFloat(v);
        if (v.indexOf("s") !== -1) return parseFloat(v) * 1000;
        return parseFloat(v) || fallback;
      } catch (e) {
        return fallback;
      }
    }

    // --- 進入アニメの後始末: reveal 完了で .pt-enter を外す ---
    // （次の離脱で .pt-leave と競合しないよう必ず除去する）
    if (root.classList.contains("pt-enter")) {
      var enterDone = false;
      var finishEnter = function () {
        if (enterDone) return;
        enterDone = true;
        root.classList.remove("pt-enter");
      };
      if (shutter) {
        shutter.addEventListener("animationend", function (e) {
          // 最後に終わる前面パネルの pt-reveal 完了を待つ
          if (
            e.animationName === "pt-reveal" &&
            e.target.classList.contains("pt-shutter__panel--front")
          ) {
            finishEnter();
          }
        });
      }
      window.setTimeout(finishEnter, 1500); // フォールバック
    }

    // reduced-motion では離脱アニメを行わず通常遷移に任せる
    if (reduce || !shutter) return;

    var durMs = readTimeVar("--pt-duration", 420);
    var stagMs = readTimeVar("--pt-stagger", 60);
    var leaveTimeout = durMs + stagMs + 160; // animationend が来ない場合の保険
    var navigating = false;

    document.addEventListener("click", function (e) {
      if (navigating) {
        e.preventDefault();
        return;
      }
      if (e.defaultPrevented) return;
      // 修飾キー / 中・右クリックはブラウザ標準（新規タブ等）に委ねる
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)
        return;

      var a = e.target && e.target.closest ? e.target.closest("a[href]") : null;
      if (!a) return;
      if (a.target && a.target !== "" && a.target !== "_self") return; // 別タブ
      if (a.hasAttribute("download")) return;
      if (a.getAttribute("data-no-transition") !== null) return; // 明示オプトアウト

      var href = a.getAttribute("href");
      if (!href) return;
      if (/^(mailto:|tel:|javascript:|#)/i.test(href)) return;

      var url;
      try {
        url = new URL(a.href, window.location.href);
      } catch (err) {
        return;
      }
      if (url.origin !== window.location.origin) return; // 外部リンク
      // 同一ページ（ハッシュのみ等）はアニメせず標準動作に委ねる
      if (
        url.pathname === window.location.pathname &&
        url.search === window.location.search
      )
        return;

      e.preventDefault();
      navigating = true;

      // 次ページに「進入アニメを再生せよ」と伝える
      try {
        sessionStorage.setItem("pt:enter", "1");
      } catch (err2) {}

      // 進入クラスが残っていれば必ず外してから離脱クラスを付ける
      root.classList.remove("pt-enter");
      root.classList.add("pt-leave");

      var done = false;
      var go = function () {
        if (done) return;
        done = true;
        window.location.href = url.href;
      };
      // 背面パネルが覆い切った時点（pt-cover 完了）で遷移
      shutter.addEventListener("animationend", function (e2) {
        if (e2.animationName === "pt-cover") go();
      });
      window.setTimeout(go, leaveTimeout);
    });

    // BFCache 復帰時: 覆ったまま戻らないようクラスをリセット
    window.addEventListener("pageshow", function (e) {
      if (e.persisted) {
        navigating = false;
        root.classList.remove("pt-leave");
        root.classList.remove("pt-enter");
      }
    });
  }

  function init() {
    initDrawer();
    initPersonFilter();
    initInternship();
    initOfficeTour();
    initPageTransition();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
