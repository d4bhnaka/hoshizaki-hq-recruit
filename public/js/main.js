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
  // Concept movie modal (top page)
  //   ボタン押下でモーダルを開き、video を先頭から再生。
  //   閉じたら必ず停止＆先頭に戻す（裏で音声が鳴り続けないように）。
  // --------------------------------------------
  function initMovieModal() {
    var modal = document.querySelector("[data-movie-modal]");
    var openBtn = document.querySelector("[data-movie-open]");
    if (!modal || !openBtn) return;

    var video = modal.querySelector("[data-movie-video]");
    var closeTargets = modal.querySelectorAll("[data-movie-close]");
    var lastFocused = null;
    var preloadStarted = false;

    // --- バックグラウンド先読み -----------------------------------------
    // HTML 側は preload="none" にしてトップページの初期描画を一切ブロックしない。
    // 描画完了後のアイドル時間に preload="auto" + load() へ切り替え、
    // クリック前に動画を裏で並行ダウンロードしておく（クリック時の待ちを減らす）。
    function startBackgroundPreload() {
      if (preloadStarted || !video) return;
      preloadStarted = true;

      // 低速回線・データセーバー時は重い先読みを避ける（任意の安全策）
      var conn =
        navigator.connection ||
        navigator.mozConnection ||
        navigator.webkitConnection;
      if (conn) {
        if (conn.saveData) return;
        if (/(^|-)2g$/.test(conn.effectiveType || "")) return;
      }

      video.preload = "auto";
      video.load();
    }

    function schedulePreload() {
      // requestIdleCallback があればアイドル時、無ければ少し遅延して開始
      if ("requestIdleCallback" in window) {
        requestIdleCallback(startBackgroundPreload, { timeout: 3000 });
      } else {
        setTimeout(startBackgroundPreload, 1200);
      }
    }

    // ページの主要リソースが描画し終えた load 後に先読みを仕込む
    if (document.readyState === "complete") {
      schedulePreload();
    } else {
      window.addEventListener("load", schedulePreload, { once: true });
    }

    // --- フォーカストラップ ----------------------------------------------
    function getFocusable() {
      var nodes = modal.querySelectorAll(
        'button:not([disabled]), [href], video[controls], [tabindex]:not([tabindex="-1"])'
      );
      return Array.prototype.filter.call(nodes, function (el) {
        return el.offsetWidth > 0 || el.offsetHeight > 0;
      });
    }

    function trapTab(event) {
      if (event.key !== "Tab") return;
      var focusable = getFocusable();
      if (!focusable.length) return;
      var first = focusable[0];
      var last = focusable[focusable.length - 1];
      var active = document.activeElement;

      if (event.shiftKey) {
        if (active === first || !modal.contains(active)) {
          event.preventDefault();
          last.focus();
        }
      } else {
        if (active === last || !modal.contains(active)) {
          event.preventDefault();
          first.focus();
        }
      }
    }

    function open() {
      // 念のため：まだ先読みが走っていなければ即開始
      startBackgroundPreload();

      lastFocused = document.activeElement;
      modal.removeAttribute("hidden");
      // 1フレーム遅らせて data-open を付け、CSS のフェードイン遷移を効かせる
      requestAnimationFrame(function () {
        modal.setAttribute("data-open", "true");
      });
      document.body.style.overflow = "hidden";

      if (video) {
        // 開くたびに必ず先頭から。preload="none" のためここで読み込みが始まる。
        try {
          video.currentTime = 0;
        } catch (e) {}
        var playPromise = video.play();
        // 自動再生がブロックされた場合もコントローラーから再生できるので握りつぶす
        if (playPromise && typeof playPromise.catch === "function") {
          playPromise.catch(function () {});
        }
      }

      // フォーカスを閉じるボタンへ移動（キーボード操作対応）
      var firstClose = modal.querySelector(".c-movie-modal__close");
      if (firstClose) firstClose.focus();
    }

    function close() {
      modal.setAttribute("data-open", "false");
      document.body.style.overflow = "";

      if (video) {
        video.pause();
        try {
          video.currentTime = 0;
        } catch (e) {}
      }

      // フェードアウト後に hidden を付ける
      setTimeout(function () {
        if (modal.getAttribute("data-open") === "false") {
          modal.setAttribute("hidden", "");
        }
      }, 320);

      // 起点のボタンへフォーカスを戻す
      if (lastFocused && typeof lastFocused.focus === "function") {
        lastFocused.focus();
      }
    }

    openBtn.addEventListener("click", open);
    closeTargets.forEach(function (el) {
      el.addEventListener("click", close);
    });

    document.addEventListener("keydown", function (event) {
      if (modal.getAttribute("data-open") !== "true") return;
      if (event.key === "Escape") {
        close();
      } else if (event.key === "Tab") {
        trapTab(event);
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      initDrawer();
      initPersonFilter();
      initInternship();
      initOfficeTour();
      initMovieModal();
    });
  } else {
    initDrawer();
    initPersonFilter();
    initInternship();
    initOfficeTour();
    initMovieModal();
  }
})();
