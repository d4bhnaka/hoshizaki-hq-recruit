# PersonCard 初回表示 Stagger アニメーション 実装計画

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `/person/` ページでグリッドがスクロールしてビューポートに入ったとき、PersonCard が左上から右下へ波状に stagger フェードインする。

**Architecture:** `public/js/main.js` のみを変更。`CARD_STAGGER` 定数とスタッガー付与ロジックを `triggerCardStagger()` ヘルパーに切り出し、既存の `initPersonFilter` と新規 `initPersonGridReveal` の両方から呼ぶ。アニメーション表現は既存の `is-filtering` / `p-person-card-in` keyframes を流用する。CSS・Astro ファイルへの変更はない。

**Tech Stack:** Vanilla JS（ES5 互換）、CSS @keyframes、IntersectionObserver

## Global Constraints

- JS は ES5 互換（`var`・`function` 宣言・`Array.prototype.forEach` 等を使う。`const`/`let`/アロー関数不可）
- フレームワーク・ライブラリ追加禁止
- テストフレームワークなし。検証はすべて `npm run dev` + ブラウザ手動確認
- `prefers-reduced-motion` 対応は CSS 側（`@media (prefers-reduced-motion: no-preference)` で `.is-filtering` の animation を囲んでいる）が担う。JS に motion ガード不要
- `public/js/main.js` はハンドオフ成果物（クライアントが読む）のため、コメントは日本語で既存スタイルに揃える

---

### Task 1: `triggerCardStagger` ヘルパーを追加し `initPersonFilter` をリファクタ

既存のフィルター stagger ロジックをヘルパー関数に切り出す。動作は変わらない。

**Files:**
- Modify: `public/js/main.js`

**Interfaces:**
- Produces: `triggerCardStagger(visibleCards)` — `visibleCards` は DOM 要素の配列。各要素に `is-filtering` を付与して stagger アニメーションを再生する。`CARD_STAGGER` は IIFE スコープの定数（`0.035` 秒/枚）。

---

- [ ] **Step 1: `CARD_STAGGER` を IIFE トップレベルへ移動**

`public/js/main.js` を開き、`"use strict";` の直下（9行目付近）に `CARD_STAGGER` 定数を追加する。

```js
  "use strict";

  var CARD_STAGGER = 0.035; // 1枚あたりのアニメーション開始遅延（秒）
```

- [ ] **Step 2: `initPersonFilter` 内の既存 `CARD_STAGGER` 宣言を削除**

`initPersonFilter` 関数内にある以下の行を削除する（Step 1 で module 側に移したため）。

削除対象:
```js
    var CARD_STAGGER = 0.035; // 1 枚あたりの遅延（秒）
```

- [ ] **Step 3: `triggerCardStagger` ヘルパー関数を追加**

`// Person filter (client-side, no JS frameworks)` コメントブロックの直前（`initPersonFilter` 関数定義の直前）に以下を挿入する。

```js
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
```

- [ ] **Step 4: `applyFilter` を `triggerCardStagger` を使う形にリファクタ**

`initPersonFilter` 内の `applyFilter` 関数全体を以下に置き換える。

削除前（現在のコード）:
```js
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
```

置き換え後:
```js
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
```

- [ ] **Step 5: フィルター動作をブラウザで確認**

```bash
npm run dev
```

`http://localhost:4321/person/` を開き、以下を確認する:

1. ページ初期表示: カードが普通に表示される（まだ初回 stagger なし — Task 2 で追加）
2. フィルターボタン「技術系」をクリック → 一致カードが左上から波状に stagger フェードインする
3. 「すべて」をクリック → 15枚が波状に stagger フェードインする
4. `prefers-reduced-motion` 確認（任意）: Chrome DevTools → Rendering → Emulate CSS media → `prefers-reduced-motion: reduce` → フィルタークリックしてもカードが静止したまま即表示されることを確認

- [ ] **Step 6: コミット**

```bash
git add public/js/main.js
git commit -m "refactor(person): triggerCardStagger ヘルパーを切り出してフィルターロジックを整理"
```

---

### Task 2: `initPersonGridReveal` を追加して初回表示 stagger を実装

グリッドセクションが初めてビューポートに入ったとき、Task 1 の `triggerCardStagger` を呼んで全カードを stagger 表示する。

**Files:**
- Modify: `public/js/main.js`

**Interfaces:**
- Consumes: `triggerCardStagger(visibleCards)` — Task 1 で定義済み
- Consumes: `CARD_STAGGER` — Task 1 で IIFE スコープに移動済み

---

- [ ] **Step 1: `initPersonGridReveal` 関数を追加**

`initPersonFilter` 関数の終わり（`}` の直後）に以下を挿入する。

```js
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
      { rootMargin: "0px 0px -8% 0px", threshold: 0 }
    );

    io.observe(section);
  }
```

- [ ] **Step 2: `init()` に `initPersonGridReveal()` を追加**

`init()` 関数内の `initPersonFilter();` の直後に追記する。

変更前:
```js
    initPersonFilter();
```

変更後:
```js
    initPersonFilter();
    initPersonGridReveal();
```

- [ ] **Step 3: ブラウザで初回表示 stagger を確認**

```bash
npm run dev
```

`http://localhost:4321/person/` を開き、以下を確認する:

1. ページを最上部にリセット（Cmd+Home）してからゆっくりスクロールする
2. グリッドセクションが viewport に入った瞬間（上端が画面下 8% ラインを超えた時点）、カードが左上から右下へ波状にフェードイン + わずかに上昇しながら登場することを確認
3. 一度下まで読んで同じページをリロード → 再度スクロール → アニメーションが1回だけ再生されることを確認（リロードで reset される）
4. ページ表示直後にすでにグリッドが viewport 内にある場合（縦長ディスプレイ等）: stagger が即座に再生されることを確認
5. フィルタークリック後もアニメーション（Task 1 の動作）が変わっていないことを確認

- [ ] **Step 4: コミット**

```bash
git add public/js/main.js
git commit -m "feat(person): PersonCard 初回表示に stagger アニメーションを追加"
```
