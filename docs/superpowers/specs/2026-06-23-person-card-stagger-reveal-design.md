# PersonCard 初回表示 stagger アニメーション設計

**日付:** 2026-06-23  
**対象ページ:** `/person/`（`src/pages/person.astro`）  
**ステータス:** 承認済み

---

## 目的

`/person/` ページの社員カードグリッドに、初回スクロール表示時の stagger アニメーションを追加する。
フィルター切り替え時の既存アニメーションと同一の表現を使い、視覚的統一感を保つ。

## 対象外

- フィルター切り替え時のアニメーション（既存の `is-filtering` 実装をそのまま維持）
- CSS・Astro ファイルへの変更

---

## 変更ファイル

`public/js/main.js` のみ。

---

## 変更内容（4点）

### 1. `CARD_STAGGER` 定数をモジュールレベルへ移動

現在 `initPersonFilter` スコープ内にある定数を IIFE 先頭に移動し、後述の `initPersonGridReveal` と共有する。

```js
// IIFE 先頭（既存の関数定義群より前）
var CARD_STAGGER = 0.035; // 1枚あたりのアニメーション開始遅延（秒）
```

### 2. `triggerCardStagger(visibleCards)` ヘルパー関数を追加

stagger 付与ロジックを切り出した純粋関数。`visibleCards` は配列またはカード要素のリスト。

```js
function triggerCardStagger(visibleCards) {
  visibleCards.forEach(function (card, i) {
    card.classList.remove("is-filtering");
    void card.offsetWidth; // reflow でアニメーションをリセット
    card.style.animationDelay = i * CARD_STAGGER + "s";
    card.classList.add("is-filtering");
  });
}
```

### 3. `initPersonFilter` 内の `applyFilter` をリファクタ

`applyFilter` の stagger 付与 5行を `triggerCardStagger` 呼び出し 1行に置き換える。動作は変わらない。

**変更前（該当箇所）:**
```js
if (match) {
  card.style.display = "";
  card.classList.remove("is-filtering");
  void card.offsetWidth;
  card.style.animationDelay = visible * CARD_STAGGER + "s";
  card.classList.add("is-filtering");
  visible++;
}
```

**変更後（具体的な実装）:**

```js
function applyFilter(value) {
  var matched = [];
  cards.forEach(function (card) {
    var tags = (card.getAttribute("data-person-tags") || "").split(/\s+/);
    var match = value === "all" || tags.indexOf(value) !== -1;
    if (match) {
      card.style.display = "";   // display を先に戻してから stagger へ渡す
      matched.push(card);
    } else {
      card.style.display = "none";
      card.classList.remove("is-filtering");
    }
  });
  if (empty) empty.hidden = matched.length !== 0;
  triggerCardStagger(matched);   // まとめて stagger
}
```

`display = ""` を先に設定してから `triggerCardStagger` を呼ぶことが重要。
`triggerCardStagger` 内の `void card.offsetWidth` は要素が visible でないと reflow が正しく機能しない。

### 4. `initPersonGridReveal()` 関数を新規追加

```js
function initPersonGridReveal() {
  var section = document.querySelector(".p-person__grid-section");
  var cards = document.querySelectorAll("[data-person-card]");
  if (!section || !cards.length) return;
  if (!("IntersectionObserver" in window)) return;

  var io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        // display:none でないカードだけ対象（フィルターで非表示の可能性）
        var visible = Array.prototype.filter.call(cards, function (c) {
          return c.style.display !== "none";
        });
        triggerCardStagger(visible);
        io.unobserve(section); // 1回限り
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0 }
  );

  io.observe(section);
}
```

`init()` 関数の末尾に `initPersonGridReveal()` を追加する。

---

## アニメーション仕様

| 項目 | 値 |
|---|---|
| keyframes | `p-person-card-in`（既存） |
| 出現モーション | `opacity 0→1` + `translateY(18px)→0` + `scale(0.97)→1` |
| イージング | `cubic-bezier(0.22, 1, 0.36, 1)` |
| 1枚の所要時間 | `0.5s` |
| stagger 間隔 | `35ms / 枚` |
| 15枚目の開始遅延 | `0.035 × 14 = 0.49s` |
| 全カード完了目安 | `約 1.0s`（最後のカードが 0.49s 遅れ + 0.5s で完了） |
| reduced-motion | CSS `@media (prefers-reduced-motion: no-preference)` が吸収。JS ガード不要 |
| IO 非対応時 | カードはデフォルト visible のまま（graceful degradation） |

---

## フォールバック動作

| 状況 | 動作 |
|---|---|
| JS 無効 | カードは常時表示（`is-filtering` が付かないため） |
| `IntersectionObserver` 非対応 | 早期 return。カードは常時表示 |
| `prefers-reduced-motion: reduce` | `is-filtering` クラスは付くが CSS の animation が off → カードは即表示 |
| グリッドセクションが見つからない | 早期 return |

---

## 非変更ファイル

- `src/pages/person.astro` — HTML 変更なし
- `src/components/PersonCard.astro` — 変更なし  
- `src/scss/object/project/_p-person.scss` — 変更なし（`is-filtering` 既存アニメーションをそのまま利用）
