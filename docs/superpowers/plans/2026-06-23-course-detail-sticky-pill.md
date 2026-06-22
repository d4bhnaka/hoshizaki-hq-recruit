# コース詳細タイトルの全幅 sticky バー化 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** インターンシップページのコース詳細タイトルを全幅 sticky バー化し、カードクリック時に詳細へ自動スクロールさせて動線を明確にする。

**Architecture:** 既存マークアップ（[CourseDetail.astro:48-50](../../../src/components/CourseDetail.astro#L48-L50)）を変えず、`.p-course-detail__pillwrap`/`__pill` 2クラスの CSS 役割を「全幅バー＋内側見出し」に入れ替える。sticky を効かせるため祖先 `.p-internship` の `overflow: hidden` を `overflow-x: clip` に変更。`main.js` の `selectCourse` にスクロール処理を追加。

**Tech Stack:** Astro（静的ビルド）、素の SCSS（FLOCSS、CSS カスタムプロパティ）、素の JS（フレームワークなし、IIFE + Swiper）。

## Global Constraints

- **テストフレームワークなし** — 各タスクの検証は `npm run build:scss` 成功＋`npm run dev`（localhost:4321）でのブラウザ目視確認。
- **SCSS は CSS カスタムプロパティのみ** — Sass 変数/mixin は使わず `var(--name)` を使う。
- **クラス接頭辞の規律** — `p-` 系を維持。新規クラスは追加しない（既存クラスの再スタイルのみ）。
- **Astro スコープ CSS 禁止** — `.astro` 内に `<style>` を書かない。スタイルは `src/scss/` のみ。
- **`public/css/style.css` は手で編集しない** — `src/scss/` を編集し `npm run build:scss` で再生成する。
- **相対パス維持** — 既存の `basePath` 規約に触れない（本変更では不要）。

---

### Task 1: 全幅 sticky バーの CSS（`.p-course-detail__pillwrap` / `__pill`）と overflow 修正

**Files:**
- Modify: `src/scss/object/project/_p-internship.scss:17`（`.p-internship` の overflow）
- Modify: `src/scss/object/project/_p-internship.scss:499-514`（`.p-course-detail__pillwrap` と `.p-course-detail__pill`）
- Build artifact: `public/css/style.css`（`npm run build:scss` で再生成。**手編集せず、git にもコミットしない**。`.gitignore` で除外済み。）

**Interfaces:**
- Consumes: 既存 CSS 変数 `--ip-blue`、`--ip-gutter`、`--color-white`（[_p-internship.scss:7-13](../../../src/scss/object/project/_p-internship.scss#L7-L13) / foundation）。
- Produces: `.p-course-detail__pillwrap` が `position: sticky` の全幅バーになり、`getComputedStyle(pillwrap).top` が px 値（clamp 解決後）を返す。これを Task 2 の JS が読む。

- [ ] **Step 1: `.p-internship` の overflow を変更する**

[_p-internship.scss:14-18](../../../src/scss/object/project/_p-internship.scss#L14-L18) の該当ブロックを次のように変更する。`overflow: hidden;` の行を置き換え、理由コメントを添える：

```scss
.p-internship {
  position: relative;
  background: var(--ip-blue);
  color: var(--color-white);
  // 横方向の 100vw はみ出し（penguins・全幅セクションの負マージン）はクリップしつつ、
  // overflow:hidden が作る縦スクロールコンテナを避け、子孫の position:sticky を有効化する。
  overflow-x: clip;
}
```

- [ ] **Step 2: `.p-course-detail__pillwrap` を全幅 sticky バーに作り替える**

[_p-internship.scss:499-514](../../../src/scss/object/project/_p-internship.scss#L499-L514) の `.p-course-detail__pillwrap` と `.p-course-detail__pill` の2ブロックを、まるごと次に置き換える：

```scss
.p-course-detail__pillwrap {
  // コース詳細パネルをスクロール中、上部に固定される全幅バー。
  // sticky の封じ込めは親 .p-course-detail が担い、パネル末尾で自然解除される。
  position: sticky;
  top: clamp(72px, 9vw, 100px); // 透過 fixed ヘッダーのロゴ／CTA を避ける高さ
  z-index: 5; // ヘッダー(z-index:20)より下。コース詳細の本文より上。
  width: 100%;
  padding-block: clamp(14px, 1.8vw, 22px);
  background: var(--ip-blue);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
}

.p-course-detail__pill {
  // バー内側の見出しテキスト（旧ピル）。コンテナ幅で中央寄せし、大きく表示する。
  display: block;
  max-width: min(1240px, 100% - var(--ip-gutter) * 2);
  margin-inline: auto;
  padding-inline: var(--ip-gutter);
  color: var(--color-white);
  font-weight: 700;
  font-size: clamp(16px, 2.2vw, 26px);
  line-height: 1.4;
}
```

- [ ] **Step 3: SCSS をビルドする**

Run: `npm run build:scss`
Expected: エラーなく終了し `public/css/style.css` が更新される。

- [ ] **Step 4: ブラウザで目視確認する**

Run: `npm run dev`（別ターミナル）→ `http://localhost:4321/internship/` を開く。
Expected:
- コースタイトルが薄水色セクション上で**濃い青の全幅バー**として表示され、白文字で大きい。
- コース詳細（POINT〜VOICES）をスクロールすると、バーが**上部に固定**され、透過ヘッダーのロゴ／CTA と重ならない。
- 詳細パネル末尾（VOICES の後）でバーが**解除**され、MESSAGE では表示されない。
- penguins・全幅セクションの**横はみ出しが従来どおりクリップ**されている（横スクロールバーが出ない）。

- [ ] **Step 5: コミットする**

```bash
# public/css/style.css は .gitignore 済みのため add しない（ビルドで再生成される）
git add src/scss/object/project/_p-internship.scss
git commit -m "feat(internship): コース詳細タイトルを全幅sticky バー化"
```

---

### Task 2: カードクリック時の詳細へ自動スクロール（main.js）

**Files:**
- Modify: `public/js/main.js:151-171`（`selectCourse` とカードのクリックハンドラ）

**Interfaces:**
- Consumes: Task 1 の `.p-course-detail__pillwrap`（sticky、`getComputedStyle().top` が px を返す）。`panels`（`[data-course-panel]` 要素群、[main.js:149](../../../public/js/main.js#L149)）。
- Produces: なし（ページ内挙動の追加のみ）。

- [ ] **Step 1: `selectCourse` 後にスクロールするヘルパーを追加し、クリックハンドラから呼ぶ**

[main.js:151-171](../../../public/js/main.js#L151-L171) の `selectCourse` 定義とカードクリック登録の間（既存 `selectCourse` 関数はそのまま）に、スクロール関数を追加する。`selectCourse` 内ではなく、ユーザー操作（クリック）時のみスクロールさせるため、クリックハンドラ側で呼ぶ。

`selectCourse` 関数の直後に次を追加：

```javascript
    // 選択コースの詳細バー上端を、sticky 固定位置（ヘッダー直下）へスムーズに合わせる。
    // オフセットは CSS の sticky top を getComputedStyle で読み、二重管理を避ける。
    function scrollToCourseDetail(id) {
      var panel = document.querySelector(
        '[data-course-panel="' + id + '"]'
      );
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
```

- [ ] **Step 2: クリックハンドラでスクロールを呼ぶ**

[main.js:167-171](../../../public/js/main.js#L167-L171) のカードクリック登録を次に変更する（`selectCourse` の後に `scrollToCourseDetail` を呼ぶ）：

```javascript
    cards.forEach(function (card) {
      card.addEventListener("click", function () {
        var id = card.getAttribute("data-course-tab");
        selectCourse(id);
        scrollToCourseDetail(id);
      });
    });
```

- [ ] **Step 3: ブラウザで目視確認する**

Run: `npm run dev` が起動中の状態で `http://localhost:4321/internship/` を再読込。
Expected:
- COURSE カードをクリックすると、対応する詳細の**全幅バーがヘッダー直下に来る位置までスムーズスクロール**する。
- 別のカードをクリックすると詳細が切り替わり、再度その先頭へスクロールする。
- 既に選択中のカードを再クリックしても、詳細先頭へスクロールする。
- 「コース一覧へ戻る」フロートボタンが従来どおり動作する（干渉しない）。

- [ ] **Step 4: `prefers-reduced-motion` を確認する**

DevTools の Rendering タブで「Emulate CSS prefers-reduced-motion: reduce」を有効化し、カードをクリックする。
Expected: スムーズスクロールではなく**瞬間移動**で詳細先頭に移動する。

- [ ] **Step 5: コミットする**

```bash
git add public/js/main.js
git commit -m "feat(internship): コース選択時に詳細先頭へ自動スクロール"
```

---

## Self-Review

**1. Spec coverage:**
- 「大きく・複数行 OK」→ Task 1 Step 2（`font-size: clamp(16px,2.2vw,26px)`、`line-height:1.4`、折り返し自然）。✓
- 「全幅バー」→ Task 1 Step 2（`width:100%`・背景・パディング）。✓
- 「コース詳細の部分で上部 sticky 固定」→ Task 1 Step 2（`position:sticky; top:...`、親パネルで封じ込め）。✓
- 「sticky を有効化する overflow 修正」→ Task 1 Step 1。✓
- 「カードクリックで詳細へ自動スクロール」→ Task 2。✓
- 「prefers-reduced-motion 対応」→ Task 2 Step 1/Step 4。✓
- 「既存戻るボタンと共存」→ Task 2 Step 3 で確認。✓

**2. Placeholder scan:** TBD/TODO/「適切に」等なし。各コード手順に実コードあり。✓

**3. Type consistency:** `scrollToCourseDetail(id)` は Task 2 内で定義・呼び出し一致。`.p-course-detail__pillwrap` / `.p-course-detail__pill` の名称は Task 1（CSS）と Task 2（JS セレクタ）で一致。`data-course-panel` / `data-course-tab` は既存属性に一致。✓
