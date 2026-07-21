// ============================================
// Hoshizaki Recruit Site — interactive scripts
// (handed off as plain readable JS — no bundler)
// ============================================

(function () {
  "use strict";

  var CARD_STAGGER = 0.035; // 1枚あたりのアニメーション開始遅延（秒）

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
      if (
        event.key === "Escape" &&
        toggle.getAttribute("aria-expanded") === "true"
      ) {
        setOpen(false);
      }
    });
  }

  // --------------------------------------------
  // Header: 200px 以上スクロールで .is-scrolled を付与（CSS 側でロゴを 80% に縮小）
  // --------------------------------------------
  function initHeaderScroll() {
    var header = document.querySelector(".l-header");
    if (!header) return;
    var THRESHOLD = 200;
    var ticking = false;

    function update() {
      header.classList.toggle("is-scrolled", window.scrollY > THRESHOLD);
      ticking = false;
    }

    window.addEventListener(
      "scroll",
      function () {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(update);
        }
      },
      { passive: true },
    );

    update(); // 初期化（リロード時に既にスクロール済みでも正しい状態に）
  }

  // --------------------------------------------
  // triggerCardStagger — カードリストに stagger アニメーションを付与する共通ヘルパー。
  //   visibleCards: display:none 以外のカード要素の配列。
  //   表示順インデックス × CARD_STAGGER 秒の遅延で is-filtering を付け直す。
  // --------------------------------------------
  function triggerCardStagger(visibleCards) {
    visibleCards.forEach(function (card, i) {
      card.classList.remove("is-filtering");
      void card.offsetWidth; // reflow でアニメーションリセット
      card.style.animationDelay = i * CARD_STAGGER + "s";
      card.classList.add("is-filtering");
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
      var matched = [];
      cards.forEach(function (card) {
        var tags = (card.getAttribute("data-person-tags") || "").split(/\s+/);
        var match = value === "all" || tags.indexOf(value) !== -1;
        if (match) {
          card.style.display = ""; // display を先に戻してから stagger へ渡す
          matched.push(card);
        } else {
          card.style.display = "none";
          card.classList.remove("is-filtering");
        }
      });
      if (empty) empty.hidden = matched.length !== 0;
      triggerCardStagger(matched);
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
  // Person grid 初回表示 stagger
  //   グリッドセクションが初めてビューポートに入った瞬間、
  //   全表示カードを triggerCardStagger で波状に登場させる（1回限り）。
  //   reduced-motion は CSS 側（@media no-preference）が吸収するため JS 判定不要。
  // --------------------------------------------
  function initPersonGridReveal() {
    var section = document.querySelector(".p-person__grid-section");
    var cards = document.querySelectorAll("[data-person-card]");
    if (!section || !cards.length) return;
    if (!("IntersectionObserver" in window)) return;

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          // display:none でないカードだけ対象
          // （フィルタータブがスクロール前に操作された場合に備える）
          var visible = Array.prototype.filter.call(cards, function (c) {
            return c.style.display !== "none";
          });
          triggerCardStagger(visible);
          io.unobserve(section); // 1回限り再生
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0 },
    );

    io.observe(section);
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
          card.getAttribute("data-course-tab") === id ? "true" : "false",
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

    // 選択コースの詳細バー上端を、sticky 固定位置（ヘッダー直下）へスムーズに合わせる。
    // オフセットは CSS の sticky top を getComputedStyle で読み、二重管理を避ける。
    function scrollToCourseDetail(id) {
      var panel = document.querySelector('[data-course-panel="' + id + '"]');
      if (!panel) return;
      var bar = panel.querySelector(".p-course-detail__pillwrap");
      if (!bar) return;
      var offset = parseFloat(getComputedStyle(bar).top) || 0;
      var top = bar.getBoundingClientRect().top + window.scrollY - offset;
      var reduce =
        window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top: top, behavior: reduce ? "auto" : "smooth" });
    }

    cards.forEach(function (card) {
      card.addEventListener("click", function () {
        var id = card.getAttribute("data-course-tab");
        selectCourse(id);
        scrollToCourseDetail(id);
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
          1500: { slidesPerView: 3.8, spaceBetween: 32 },
        },
        navigation: {
          nextEl: "[data-course-next]",
          prevEl: "[data-course-prev]",
        },
      });
    }
  }

  // --------------------------------------------
  // Internship: コース詳細を読み下げた後、コース一覧（カルーセル）へ
  //   ワンタップで戻すフロートボタン。COURSE カルーセルを上に通り過ぎたら
  //   出現し、フッターと重なる位置まで来たら隠す（フッターの上に被せない）。
  //   判定は rAF スロットルのスクロール監視（initHeaderScroll と同方式）。
  //   IntersectionObserver は「交差の有無」しか分からず、上に抜けたか下に
  //   あるかを高速スクロールで取りこぼすため使わない。見た目の出入りは
  //   CSS（.p-course-backtop.is-visible）。
  // --------------------------------------------
  function initCourseBackToTop() {
    var btn = document.querySelector("[data-course-backtop]");
    var anchor = document.querySelector("[data-course-anchor]");
    if (!btn || !anchor) return;

    var footer = document.querySelector(".l-footer");
    var header = document.querySelector(".l-header");
    var ticking = false;

    function update() {
      ticking = false;
      // COURSE カルーセルが画面上端より上に完全に出たら表示する。
      var passedCourse = anchor.getBoundingClientRect().bottom < 0;
      // ただしフッター上端がボタン下端より上へ来たら（＝重なるなら）隠す。
      var overlapsFooter = footer
        ? footer.getBoundingClientRect().top <
          btn.getBoundingClientRect().bottom
        : false;
      btn.classList.toggle("is-visible", passedCourse && !overlapsFooter);
    }

    function requestUpdate() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }

    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate, { passive: true });

    btn.addEventListener("click", function () {
      var reduce =
        window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      // 固定ヘッダーの高さ分だけ上にオフセットし、COURSE 見出しがヘッダー裏に
      // 隠れないようにする（scrollToCourseDetail と挙動を揃える）。
      var offset = header ? header.getBoundingClientRect().height : 0;
      var top = anchor.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({
        top: top < 0 ? 0 : top,
        behavior: reduce ? "auto" : "smooth",
      });
    });

    update(); // 初期化（リロード時に既にスクロール済みでも正しい状態に）
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

      // ループ複製が追加される前に実スライド枚数を控える（イントロ 1 周の回数に使う）。
      var slideCount = swiperEl.querySelectorAll(".swiper-slide").length;

      var swiper = new Swiper(swiperEl, {
        // 隣り合うスライドを重ねて表示し、中央（active）を最前面で大きく見せる。
        // coverflow エフェクトで実現：
        //   - stretch（正・スライド幅に対する%）で隣を中央側へ寄せて重ねる
        //   - scale で中央＝等倍／外側ほど縮小（b = 1 - (1-scale)*|距離|）
        //   - z-index は Swiper が自動付与（中央=最前面、外側ほど背面）
        // 重なり量を変えたいときは stretch の値だけ調整する（正を強める＝重なり増）。
        centeredSlides: true,
        loop: true,
        // イントロの高速フロー中に端でスライドが尽きて空白が出ないよう、
        // 両側に数枚の余分を確保しておく（通常再生時も無害）。
        loopAdditionalSlides: 3,
        slideToClickedSlide: true,
        grabCursor: true,
        effect: "coverflow",
        coverflowEffect: {
          rotate: 0, // 3D 傾けはしない（フラットなカード）
          depth: 0, // 奥行き(translateZ)は使わず、縮小は scale に一本化
          stretch: "33%", // 正の値で隣を中央側へ寄せて重ねる。外側まで重なるよう強め
          scale: 0.88, // 中央=1.0／隣=0.88。外側の縮小を緩めて隙間が開くのを抑える
          modifier: 1,
          slideShadows: false,
        },
        // 自動ループ再生。操作後も再開させ、ホバー中は一時停止する。
        autoplay: {
          delay: 3500,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        },
        // フルブリード（ウィンドウ全幅）表示のため、画面が広いほど枚数を増やして
        // 1枚あたりのサイズが過大にならないようにする。spaceBetween は使わず
        // （0）、間隔・重なりは coverflow の stretch で一括制御する。
        slidesPerView: 1.3,
        breakpoints: {
          600: { slidesPerView: 2.6 },
          900: { slidesPerView: 3.2 },
          1280: { slidesPerView: 3.6 },
          1600: { slidesPerView: 4.2 },
        },
        navigation: {
          prevEl: block.querySelector("[data-office-prev]"),
          nextEl: block.querySelector("[data-office-next]"),
        },
      });

      // 初回スクロールインで演出を再生するまで、通常オートプレイは止めておく。
      swiper.autoplay.stop();

      // ---- 初回イントロ演出 ----
      // カルーセルが画面内に入ったら、全スライドを 1 周だけ“流れるように”送る
      // 起動アニメーションを再生し、そのまま通常オートプレイへ移行する。
      //
      // 実装方針：Swiper 14 のループは実スライド 11 枚を再配置する方式で、複数枚の
      // 一括ジャンプはクランプされ、手動 translate + loopFix はスナップで打ち消される。
      // 一方 autoplay を delay:0＋linear で回すと、Swiper 自身が 1 枚ずつを継ぎ目なく
      // 連結して“止まらない連続スクロール（マーキー）”になる（実測でコマ落ち・
      // 停止フレームなし）。これを土台に、1 枚あたりの送り時間を後半ほど長くして
      // 速度を徐々に落とし、ease-out で滑らかに減速して停止させる。
      var reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      var introStarted = false;

      function playOfficeIntro() {
        if (introStarted) return;
        introStarted = true;

        // reduced-motion 指定時・2 枚未満は演出を飛ばして通常再生へ直行。
        if (reduceMotion || slideCount < 2) {
          swiper.autoplay.start();
          return;
        }

        // 演出は「フロー（等速寄りの連続送り）」＋「最後の1枚を ease-out で減速停止」
        // の 2 段構成。フロー部は autoplay の delay:0＋linear で継ぎ目なく連結し、
        // 最後の 1 枚だけ手動 slideNext の ease-out で、直前フローと同じ速度から
        // 0 まで滑らかに減速して止める（＝再加速せず自然に静止 → 通常再生へ）。
        var FLOW_MS = 620; // フロー（最後の1枚を除く）に充てる合計時間の目安
        var MIN_MS = 60; // 1 枚が速すぎてブレないよう下限
        var flowCount = slideCount - 1; // 最後の 1 枚は settle で個別に減速停止

        // フローの送り時間：後半ほど少しだけ長く（緩やかに減速しながら流す）。
        var weights = [];
        var i;
        for (i = 0; i < flowCount; i++) {
          var f = flowCount > 1 ? i / (flowCount - 1) : 1; // 0→1
          weights.push(1 + 2 * f * f);
        }
        var sumW = weights.reduce(function (a, b) {
          return a + b;
        }, 0);
        var flowSpeeds = weights.map(function (w) {
          return Math.max(MIN_MS, Math.round((FLOW_MS * w) / sumW));
        });
        var lastFlowSpeed = flowSpeeds[flowSpeeds.length - 1] || MIN_MS;

        // 最後の 1 枚（settle）の ease-out。初速がその曲線の初期傾き slope に比例する
        // ため、送り時間を slope×直前フロー速度 に合わせると、フロー終速と settle 初速が
        // ほぼ一致して継ぎ目が消える（少しだけ長めにして“わずかに遅く始まる”＝再加速回避）。
        // easeOutCubic：速度が最初から最後まで単調に減少する（＝再加速しない）ので、
        // フロー終速から 0 へ滑らかに着地できる。
        var SETTLE_EASE = "cubic-bezier(0.33, 1, 0.68, 1)"; // 初期傾き ≒ 1/0.33 ≈ 3.03
        var SETTLE_SLOPE = 3.03;
        var SETTLE_MS = Math.round(lastFlowSpeed * SETTLE_SLOPE * 1.05);

        // wrapper と全スライドのイージングを差し替えるヘルパ。
        function setTiming(v) {
          swiper.wrapperEl.style.transitionTimingFunction = v;
          swiper.slides.forEach(function (s) {
            s.style.transitionTimingFunction = v;
          });
        }

        var origSpeed = swiper.params.speed;

        // 演出中は中央強調（拡大・キャプション・暗転）を止め、全カード均一に流す。
        swiperEl.classList.add("is-intro-playing");
        swiper.allowTouchMove = false;
        setTiming("linear");

        // --- フロー：delay:0 で 1 枚送りを継ぎ目なく連結（一つずつ止まらない流れ）---
        var idx = 0;
        swiper.params.speed = flowSpeeds[0];
        swiper.params.autoplay.delay = 0;

        function onFlowEnd() {
          idx += 1;
          if (idx < flowSpeeds.length) {
            swiper.params.speed = flowSpeeds[idx]; // 次のコマの送り時間（緩やかに減速）
          } else {
            // フロー終了 → 最後の 1 枚を ease-out で減速停止（settle）。
            swiper.off("slideChangeTransitionEnd", onFlowEnd);
            swiper.autoplay.stop();

            // ここで中央強調を復帰。最後の着地（減速）と拡大・暗転・キャプションの
            // フェードが重なり、通常再生へ自然に溶け込む。
            swiperEl.classList.remove("is-intro-playing");
            setTiming(SETTLE_EASE);
            swiper.params.speed = SETTLE_MS;

            swiper.once("slideChangeTransitionEnd", function () {
              // 完全停止。イージングと送り時間を通常へ戻し、REST 後に通常オートプレイを
              // 開始する（stop 直後に start すると即時 1 枚送られる Swiper の癖を回避し、
              // 静止 → 余韻 → 通常再生 の自然な間を作る）。
              setTiming("");
              swiper.params.speed = origSpeed;
              swiper.params.autoplay.delay = 3500;
              swiper.allowTouchMove = true;
              swiper.updateSlidesClasses();
              window.setTimeout(function () {
                swiper.autoplay.start();
              }, 3500);
            });

            swiper.slideNext(SETTLE_MS);
          }
        }

        swiper.on("slideChangeTransitionEnd", onFlowEnd);
        swiper.autoplay.start();
      }

      if ("IntersectionObserver" in window) {
        var officeIo = new IntersectionObserver(
          function (entries) {
            entries.forEach(function (entry) {
              if (!entry.isIntersecting) return;
              officeIo.unobserve(entry.target); // 初回のみ
              playOfficeIntro();
            });
          },
          { threshold: 0.3 },
        );
        officeIo.observe(swiperEl);
      } else {
        // IntersectionObserver 非対応環境は演出を飛ばして通常再生。
        swiper.autoplay.start();
      }
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
        'button:not([disabled]), [href], video[controls], [tabindex]:not([tabindex="-1"])',
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

  // --------------------------------------------
  // Info modal (strategy: 海外展開マップ)
  //   PC で地図の氷アイコン([data-info-trigger])を押すと、その href が
  //   指す市場カードの「市場名＋本文」をモーダルへ流し込んで開く。
  //   内容の単一ソースはカード一覧なので、文言修正は HTML 側だけで済む。
  //   スマホはアイコン自体が CSS で非表示＝クリック不可のため発火せず、
  //   JS が無い環境ではアンカーの既定動作（カードへスクロール）に委ねる。
  // --------------------------------------------
  function initInfoModal() {
    var modal = document.querySelector("[data-info-modal]");
    if (!modal) return;
    var triggers = document.querySelectorAll("[data-info-trigger]");
    if (!triggers.length) return;

    var titleEl = modal.querySelector("[data-info-title]");
    var bodyEl = modal.querySelector("[data-info-body]");
    var closeTargets = modal.querySelectorAll("[data-info-close]");
    var lastFocused = null;

    // --- フォーカストラップ ----------------------------------------------
    function getFocusable() {
      var nodes = modal.querySelectorAll(
        'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
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

    function open(card) {
      var badge = card.querySelector(".p-strategy-market__badge");
      var body = card.querySelector(".p-strategy-market__body");
      if (titleEl) titleEl.textContent = badge ? badge.textContent : "";
      if (bodyEl) bodyEl.textContent = body ? body.textContent : "";

      lastFocused = document.activeElement;
      modal.removeAttribute("hidden");
      // 1フレーム遅らせて data-open を付け、CSS のフェードイン遷移を効かせる。
      requestAnimationFrame(function () {
        modal.setAttribute("data-open", "true");
        // data-open で visibility:hidden→visible になるが、フォーカス可能に
        // なるには算出スタイルの反映が要る。reflow を強制してから移す。
        var firstClose = modal.querySelector(".c-info-modal__close");
        if (firstClose) {
          void modal.offsetWidth;
          firstClose.focus();
        }
      });
      document.body.style.overflow = "hidden";
    }

    function close() {
      modal.setAttribute("data-open", "false");
      document.body.style.overflow = "";

      // フェードアウト後に hidden を付ける
      setTimeout(function () {
        if (modal.getAttribute("data-open") === "false") {
          modal.setAttribute("hidden", "");
        }
      }, 320);

      // 起点のアイコンへフォーカスを戻す
      if (lastFocused && typeof lastFocused.focus === "function") {
        lastFocused.focus();
      }
    }

    triggers.forEach(function (trigger) {
      trigger.addEventListener("click", function (event) {
        var href = trigger.getAttribute("href") || "";
        var id = href.charAt(0) === "#" ? href.slice(1) : "";
        var card = id ? document.getElementById(id) : null;
        // 対応カードが見つからなければ既定のアンカー動作に任せる
        if (!card) return;
        event.preventDefault();
        open(card);
      });
    });

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

  // --------------------------------------------
  // Inview reveal — スクロールでビューポートに入った要素を
  //   ふわっとフェードイン（+上昇）させる。
  //   検知は IntersectionObserver、見た目の動きは CSS
  //   (scss/object/utility/_u-inview.scss)。出現前の非表示ガードは
  //   <html>.inview-ready（Layout.astro head のインラインスクリプトで付与）。
  // --------------------------------------------
  function initInview() {
    var targets = document.querySelectorAll("[data-inview]");
    if (!targets.length) return;

    // 非表示ガード(.inview-ready)が無い＝低モーション/未対応なので何もしない
    // （CSS 側でも初期非表示にしていないため要素は既に見えている）。
    if (
      !document.documentElement.classList.contains("inview-ready") ||
      !("IntersectionObserver" in window)
    ) {
      targets.forEach(function (el) {
        el.classList.add("is-inview");
      });
      return;
    }

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-inview");
          io.unobserve(entry.target); // 一度出たら監視解除（再生は1回）
        });
      },
      // 少し見えてから（下端から12%手前で）発火させる
      { rootMargin: "0px 0px -12% 0px", threshold: 0.12 },
    );

    targets.forEach(function (el) {
      io.observe(el);
    });
  }

  // --------------------------------------------
  // Hero テキストの「白バー塗り→抜き」リビールを、対象がウィンドウに
  //   入った時点で開始する（本文導入コピー / 「さぁ、その想いを翼に変えて。」）。
  //   ここでは .is-inview を付与するだけ。実際の動き（@keyframes と開始前の
  //   一時停止ゲート）は scss/object/project/_p-top.scss が担う。
  //   出現前の非表示ガードは <html>.inview-ready（initInview と共通）。
  // --------------------------------------------
  function initHeroReveals() {
    var targets = document.querySelectorAll(
      ".p-top-hero__body, .p-top-hero__outro",
    );
    if (!targets.length) return;

    // 非表示ガード(.inview-ready)が無い＝低モーション/未対応。ゲートしないので
    // 即 .is-inview を付与（CSS 側も初期非表示にしていない）。
    if (
      !document.documentElement.classList.contains("inview-ready") ||
      !("IntersectionObserver" in window)
    ) {
      targets.forEach(function (el) {
        el.classList.add("is-inview");
      });
      return;
    }

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-inview");
          io.unobserve(entry.target); // 一度出たら監視解除（再生は1回）
        });
      },
      // 少し見えてから（下端から12%手前で）発火させる（他のリビールと揃える）
      { rootMargin: "0px 0px -12% 0px", threshold: 0.12 },
    );
    targets.forEach(function (el) {
      io.observe(el);
    });
  }

  // --------------------------------------------
  // Parallax — スクロールに連動して装飾要素を縦方向に視差移動させる
  //   （トップ S3 帯の氷キューブ等）。対象は [data-parallax] 要素で、
  //   属性値は速度係数：正＝スクロールより遅く流れる（奥に見える）、
  //   負＝速く流れる（手前に見える）。移動量は
  //   「ビューポート中央と要素の基準中央の差分 × 係数」を transform で適用。
  //   要素が画面中央にあるとき変位 0 なので、デザイン上の配置座標は崩れない。
  //
  //   data-parallax-origin="page" を併記した場合のみ、基準を「ページ最上部」に
  //   切り替えて変位 = scrollY × 係数 とする。ファーストビュー内の要素は
  //   読み込み直後から画面中央より上にいるため、既定の基準だと初期表示の時点で
  //   すでにずれてしまう。この指定でスクロール 0 の時に変位 0 が保証され、
  //   デザイン通りの初期構図のままスクロールで視差が付き始める。
  // --------------------------------------------
  function initParallax() {
    var targets = document.querySelectorAll("[data-parallax]");
    if (!targets.length) return;

    // 低モーション設定時は視差を行わず、素の配置のまま静止させる
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    var items = [];
    var ticking = false;

    // 各要素の「視差変形を除いた素の中心位置」（ドキュメント座標）を記録する。
    // transform を一旦外して測ることで、再計測時に視差分が混入しない。
    function measure() {
      items = [];
      targets.forEach(function (el) {
        // SP では display:none になる要素（氷キューブ）は対象外
        if (!el.offsetParent && getComputedStyle(el).position !== "fixed") {
          el.style.transform = "";
          return;
        }
        var prev = el.style.transform;
        el.style.transform = "none";
        var rect = el.getBoundingClientRect();
        el.style.transform = prev;
        items.push({
          el: el,
          speed: parseFloat(el.getAttribute("data-parallax")) || 0,
          center: rect.top + window.scrollY + rect.height / 2,
          fromPageTop: el.getAttribute("data-parallax-origin") === "page",
        });
      });
    }

    function update() {
      ticking = false;
      var vh = window.innerHeight;
      var viewCenter = window.scrollY + vh / 2;
      items.forEach(function (item) {
        var offset = viewCenter - item.center;
        // 画面から大きく離れている間は transform の更新をスキップ
        // （表示判定は基準の違いによらず素の位置関係で行う）
        if (Math.abs(offset) > vh * 1.5) return;
        var delta = item.fromPageTop ? window.scrollY : offset;
        item.el.style.transform =
          "translate3d(0, " + (delta * item.speed).toFixed(1) + "px, 0)";
      });
    }

    function requestUpdate() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }

    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", function () {
      measure();
      requestUpdate();
    });
    // 画像ロード完了でレイアウトが確定してから基準位置を取り直す
    window.addEventListener("load", function () {
      measure();
      requestUpdate();
    });

    measure();
    update(); // 初期表示時点の変位を即適用（最初のスクロールでの跳びを防ぐ）
  }

  // --------------------------------------------
  // Count-up — 数値がビューポートに入ったら 0 から実値までカウントアップ。
  //   対象は [data-countup] 要素。表示テキストの数字を最終値として読み取り、
  //   桁区切り（カンマ）や小数も復元する。検知は IntersectionObserver。
  //   低モーション設定 / IO 非対応では一切いじらず最初から実値を表示する。
  // --------------------------------------------
  function initCountUp() {
    var targets = document.querySelectorAll("[data-countup]");
    if (!targets.length) return;

    var reduce =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // 低モーション・未対応では実値のまま（テキストを書き換えない）
    if (reduce || !("IntersectionObserver" in window)) return;

    var DURATION = 1400; // ms

    function format(value, hasComma, decimals) {
      var s =
        decimals > 0 ? value.toFixed(decimals) : String(Math.round(value));
      if (hasComma) {
        var parts = s.split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        s = parts.join(".");
      }
      return s;
    }

    function run(el) {
      var orig = el.textContent;
      var digits = orig.replace(/[^0-9.]/g, "");
      var target = parseFloat(digits);
      if (!isFinite(target)) return; // 数字を含まなければ何もしない
      var hasComma = orig.indexOf(",") !== -1;
      var dotIdx = digits.indexOf(".");
      var decimals = dotIdx === -1 ? 0 : digits.length - dotIdx - 1;
      var start = null;

      // easeOutCubic（最後に向かってゆっくり止まる）
      function ease(t) {
        return 1 - Math.pow(1 - t, 3);
      }
      function step(now) {
        if (start === null) start = now;
        var t = Math.min(1, (now - start) / DURATION);
        el.textContent = format(target * ease(t), hasComma, decimals);
        if (t < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = orig; // 最終フレームは元テキストを厳密復元
        }
      }
      requestAnimationFrame(step);
    }

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          run(entry.target);
          io.unobserve(entry.target); // カウントは 1 回だけ
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.4 },
    );
    targets.forEach(function (el) {
      io.observe(el);
    });
  }

  function init() {
    initDrawer();
    initHeaderScroll();
    initPersonFilter();
    initPersonGridReveal();
    initInternship();
    initCourseBackToTop();
    initOfficeTour();
    initPageTransition();
    initMovieModal();
    initInfoModal();
    initInview();
    initHeroReveals();
    initParallax();
    initCountUp();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
