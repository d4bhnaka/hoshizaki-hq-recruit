# 先輩アバターにイニシャル＋入社年を追記 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 職種紹介ページ `/job/` の各先輩インタビュー・アバターの真下に、イニシャル（例 `Y.C`）と入社年（例 `2014年入社`）を2行（縦並び）で表示する。

**Architecture:** 表示は純粋なプレゼンテーション変更。データは既存の2ファイル（`personDetails.ts` の `initials`、`persons.ts` の `year`）を `slug` キーでマップして使い、新規データ収集はしない。マークアップは [src/pages/job.astro](../../../src/pages/job.astro) の interview リンク内に2行キャプションを追加し、スタイルは [src/scss/object/project/_p-job.scss](../../../src/scss/object/project/_p-job.scss) に追記する。

**Tech Stack:** Astro（静的サイト）、SCSS（FLOCSS、`public/css/style.css` へコンパイル）。テスト基盤は無く、検証は `npm run build` の成否と `dist/` 出力・コンパイル済みCSSへの `grep`、および `npm run dev` の目視で行う。

## Global Constraints

спецからの全タスク共通の制約（各値は逐語コピー）:

- **相対パス維持** — `/job/` は2階層ページ。job.astro の `base = "../"` を変えない。画像・リンクは `${base}...` で参照する。
- **ハッシュ無し / 圧縮無し** — 出力にハッシュ付きファイル名や圧縮を持ち込まない（設定は触らない）。
- **Astro スコープCSS禁止** — `.astro` に `<style>` ブロックを追加しない。スタイルは必ず `src/scss/` 側に書く。出力HTMLに `data-astro-cid-*` 属性を混入させない。
- **FLOCSS 接頭辞** — 新規クラスは `p-` 接頭辞（`.p-job-card__interview-*`）。スタイルは `_p-job.scss` に追記。
- **Sass変数ではなくCSSカスタムプロパティ** — 色は `var(--color-text-primary)` / `var(--color-text-secondary)` を使う。
- **SCSSは先にコンパイル** — `public/css/style.css` はそのまま配信されるため、`npm run build` は `build:scss` → `astro build` の順で走る（既定の `npm run build` がこれを担保）。
- **社員氏名を出さない** — 表示はイニシャルと入社年のみ。`persons.ts` の `name` は使わない。

---

## File Structure

- **Modify** [src/pages/job.astro](../../../src/pages/job.astro)
  - frontmatter: `persons` を import し、`yearBySlug`（`slug → year`）を構築。
  - body: `.p-job-card__interview-item` 内のリンクに2行キャプション（`.p-job-card__interview-meta` 配下の initials / year span）を追加し、`aria-label` に入社年を含める。
- **Modify** [src/scss/object/project/_p-job.scss](../../../src/scss/object/project/_p-job.scss)
  - 既存 `.p-job-card__interview-link` を縦flex化、`.p-job-card__interview-list` に `align-items: flex-start`。
  - 新規 `.p-job-card__interview-meta` / `.p-job-card__interview-initials` / `.p-job-card__interview-year`。

2ファイルはそれぞれ独立してレビュー可能なため、2タスクに分割する。Task 1（内容）→ Task 2（見た目）の順。Task 1 単独ビルドではキャプションは未スタイルで表示され、Task 2 完了後に最終的な見た目が揃う。

---

## Task 1: job.astro — 入社年データのマップとキャプションのマークアップ

**Files:**
- Modify: `src/pages/job.astro`（frontmatter 9行目付近の import / マップ定義、body 225-240行目付近の interview リンク）

**Interfaces:**
- Consumes: `personDetails`（既存 import・`initialsBySlug`）、`persons`（[src/data/persons.ts](../../../src/data/persons.ts) の named export `persons: Person[]`。各要素は `slug: string` と `year: string`、例 `slug:"01", year:"2014年"`）。
- Produces: 後続タスクが参照する新規CSSフック — クラス名 `p-job-card__interview-meta` / `p-job-card__interview-initials` / `p-job-card__interview-year`。これらは Task 2 のセレクタと完全一致させること。

- [ ] **Step 1: `persons` を import する**

[src/pages/job.astro](../../../src/pages/job.astro) の frontmatter、既存の personDetails import の直後にインポートを追加する。

変更前:
```astro
import { personDetails } from "../data/personDetails";

const base = "../";
```

変更後:
```astro
import { personDetails } from "../data/personDetails";
import { persons } from "../data/persons";

const base = "../";
```

- [ ] **Step 2: `yearBySlug` マップを追加する**

既存の `initialsBySlug` 定義の直後に、入社年マップを追加する。

変更前:
```astro
const initialsBySlug = Object.fromEntries(
  personDetails.map((p) => [p.slug, p.initials]),
);
```

変更後:
```astro
const initialsBySlug = Object.fromEntries(
  personDetails.map((p) => [p.slug, p.initials]),
);
// slug → 入社年（"2014年"）。persons.ts が入社年の単一ソース。表示時に「入社」を付与。
const yearBySlug = Object.fromEntries(
  persons.map((p) => [p.slug, p.year]),
);
```

- [ ] **Step 3: interview リンクのマークアップを更新する**

body 内、`job.seniors.map((slug) => ( ... ))` のリンク部分を置き換える。アバター `<img>` の後にキャプションを追加し、`aria-label` に入社年を含める。

変更前:
```astro
<li class="p-job-card__interview-item">
  <a
    class="p-job-card__interview-link"
    href={`${base}person/${slug}/`}
    aria-label={`先輩社員 ${initialsBySlug[slug]} さんのインタビューを見る`}
  >
    <img
      class="p-job-card__interview-avatar"
      src={`${base}images/person/a${slug}.png`}
      alt=""
      loading="lazy"
      width="58"
      height="58"
    />
  </a>
</li>
```

変更後:
```astro
<li class="p-job-card__interview-item">
  <a
    class="p-job-card__interview-link"
    href={`${base}person/${slug}/`}
    aria-label={`先輩社員 ${initialsBySlug[slug]} さん（${yearBySlug[slug]}入社）のインタビューを見る`}
  >
    <img
      class="p-job-card__interview-avatar"
      src={`${base}images/person/a${slug}.png`}
      alt=""
      loading="lazy"
      width="58"
      height="58"
    />
    <span class="p-job-card__interview-meta">
      <span class="p-job-card__interview-initials">{initialsBySlug[slug]}</span>
      <span class="p-job-card__interview-year">{yearBySlug[slug]}入社</span>
    </span>
  </a>
</li>
```

- [ ] **Step 4: ビルドして出力を検証する**

Run:
```bash
npm run build
```
Expected: エラー無く完了（`build:scss` → `astro build` → `js-beautify`）。

続けて出力HTMLを検証する。`/job/` の先輩は全カード合計15名（配列 `[01,02],[03,06],[04,07],[10,08,09],[11],[12,13],[14,15],[05]`）。

Run:
```bash
grep -c 'p-job-card__interview-year' dist/job/index.html
grep -c 'p-job-card__interview-initials' dist/job/index.html
grep -o '2014年入社' dist/job/index.html | head -1
grep -o '（Y.C入社）' dist/job/index.html | head -1
```
Expected:
- 最初の2つ（year / initials のクラス出現数）はどちらも `15`。
- `2014年入社` が1件以上ヒット（slug 01 のキャプション）。
- `（Y.C入社）` は**ヒットしない**（空）= aria-label が「イニシャル」ではなく「入社年」で年を組み立てている確証。代わりに次で確認する。

Run:
```bash
grep -o 'さん（2014年入社）のインタビューを見る' dist/job/index.html | head -1
```
Expected: `さん（2014年入社）のインタビューを見る` がヒット（aria-label に入社年が入っている）。

- [ ] **Step 5: スコープCSS属性が混入していないことを確認する**

Run:
```bash
grep -c 'data-astro-cid' dist/job/index.html
```
Expected: `0`。

- [ ] **Step 6: コミット**

```bash
git add src/pages/job.astro
git commit -m "feat(job): 先輩インタビューのアバターにイニシャルと入社年を表示

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 2: _p-job.scss — キャプションのレイアウトと文字スタイル

**Files:**
- Modify: `src/scss/object/project/_p-job.scss`（344-380行目付近の interview 系ルール）

**Interfaces:**
- Consumes: Task 1 が出力するクラス `p-job-card__interview-meta` / `p-job-card__interview-initials` / `p-job-card__interview-year`、および既存の `p-job-card__interview-link` / `p-job-card__interview-list` / `p-job-card__interview-avatar`。
- Produces: なし（最終プレゼンテーション）。

- [ ] **Step 1: リストを上揃えにする**

`.p-job-card__interview-list` に `align-items: flex-start;` を追加（キャプション行が増えても各アイテムの頭が揃う）。

変更前:
```scss
.p-job-card__interview-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
```

変更後:
```scss
.p-job-card__interview-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 12px;
}
```

- [ ] **Step 2: リンクを縦flexにする**

`.p-job-card__interview-link` を `display: block; border-radius: 50%` から縦並びflexへ変更する。丸枠はアバター側（`.p-job-card__interview-avatar` の `border-radius: 50%`）が保持するため、リンクの `border-radius` は削除。hover / focus の `translateY(-2px)` はそのまま残す。

変更前:
```scss
.p-job-card__interview-link {
  display: block;
  border-radius: 50%;
  text-decoration: none;
  transition: transform var(--transition-fast);

  &:hover,
  &:focus-visible {
    transform: translateY(-2px);
  }
}
```

変更後:
```scss
.p-job-card__interview-link {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  text-decoration: none;
  transition: transform var(--transition-fast);

  &:hover,
  &:focus-visible {
    transform: translateY(-2px);
  }
}
```

- [ ] **Step 3: キャプション用クラスを追加する**

`.p-job-card__interview-link:hover .p-job-card__interview-avatar, .p-job-card__interview-link:focus-visible .p-job-card__interview-avatar { ... }` ルール（box-shadow を付けるブロック、380行目付近で閉じる）の直後、`.p-job-card__figure` の手前に3クラスを追加する。

追加するコード:
```scss
.p-job-card__interview-meta {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  line-height: 1.3;
}

.p-job-card__interview-initials {
  color: var(--color-text-primary);
  font-weight: 700;
  font-size: 13px;
  letter-spacing: 0.04em;
}

.p-job-card__interview-year {
  color: var(--color-text-secondary);
  font-size: 12px;
}
```

- [ ] **Step 4: SCSSをコンパイルして検証する**

Run:
```bash
npm run build:scss
```
Expected: エラー無く `public/css/style.css` が再生成される。

Run:
```bash
grep -c 'p-job-card__interview-meta' public/css/style.css
grep -c 'p-job-card__interview-initials' public/css/style.css
grep -c 'p-job-card__interview-year' public/css/style.css
```
Expected: いずれも `1` 以上（ルールが出力されている）。

- [ ] **Step 5: フルビルドが通ることを確認する**

Run:
```bash
npm run build
```
Expected: エラー無く完了。

- [ ] **Step 6: 目視確認**

Run:
```bash
npm run dev
```
ブラウザで `http://localhost:4321/job/` を開き、確認する:
- 各先輩アバターの真下に、イニシャル（太字・濃色）→ 入社年（やや小さい・グレー）が2行で中央揃え表示される。
- アバターは横並びのまま、複数名（最大3名）はカード幅に応じて折り返す。
- アバター／キャプションのどこをクリックしても `/person/<slug>/` へ遷移する。
- hover でアイテムが少し浮き、アバターにリングが付く。

確認後、`Ctrl+C` で dev サーバーを停止。

- [ ] **Step 7: コミット**

`public/css/style.css` は `.gitignore` で除外された生成物（ビルド時に再生成）なのでコミットしない。SCSS ソースのみをコミットする。

```bash
git add src/scss/object/project/_p-job.scss
git commit -m "style(job): 先輩アバターのイニシャル・入社年キャプションを縦並び表示

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Self-Review

**1. Spec coverage（spec 各項目 → タスク対応）:**
- データソース（initials / year を slug でマップ、氏名非露出）→ Task 1 Step 1-2。
- マークアップ（リンクが avatar＋caption を内包、aria-label に年）→ Task 1 Step 3。
- スタイル（link 縦flex、list 上揃え、meta/initials/year 3クラス、色トークン）→ Task 2 Step 1-3。
- アクセシビリティ（alt="" 維持、Label-in-Name）→ Task 1 Step 3 + Step 4 検証。
- レスポンシブ／制約（スコープCSS無し・相対パス・FLOCSS）→ Global Constraints + Task 1 Step 5 / Task 2 Step 4-6。
- 受け入れ条件1-5 → Task 1 Step 4-5、Task 2 Step 4-6 で検証。
- ギャップ無し。

**2. Placeholder scan:** TBD/TODO・曖昧表現なし。全ステップに実コードと実コマンド・期待値を記載。

**3. Type consistency:** クラス名 `p-job-card__interview-meta` / `-initials` / `-year` は Task 1（出力）と Task 2（セレクタ）で一致。`yearBySlug` / `initialsBySlug` の参照名も一貫。`persons` の `slug` / `year` 型（string）に依拠。
