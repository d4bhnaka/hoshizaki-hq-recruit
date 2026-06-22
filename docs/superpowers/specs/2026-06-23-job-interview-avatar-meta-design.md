# 職種紹介ページ：先輩アバターにイニシャル＋入社年を追記

- **日付**: 2026-06-23
- **対象ページ**: `/job/`（[src/pages/job.astro](../../../src/pages/job.astro)）
- **ステータス**: 設計確定（実装計画待ち）

## 背景・目的

職種紹介ページの各ジョブカードには「この職種の先輩インタビュー」として先輩社員のアバター画像（`.p-job-card__interview-avatar`）が並んでいる。現状は丸いアバター画像だけで、誰なのか・いつ入社したのかが分からない。

各アバターに **イニシャル表記** と **入社年** を縦並び（2行）で追記し、リンク先のインタビュー対象が一目で分かるようにする。

## 確定事項（ユーザー承認済み）

| 項目 | 決定 |
| --- | --- |
| レイアウト | **アバターの真下に2行**（イニシャル → 入社年）。アバター列はこれまで通り横並び（`flex-wrap`）を維持。 |
| 入社年の表記 | **`2014年入社`**（`persons.ts` の `year` ＋ `入社`） |
| イニシャル表記 | **`Y.C`**（`personDetails.initials` をそのまま） |
| マークアップ構造 | `<a>`（リンク）がアバター画像とキャプションの**両方を内包**。クリック範囲を全体に。 |

## データソース（新規収集なし）

両データとも既存ファイルに `slug` キーで揃っている。社員氏名（非公開）は一切露出しない。

- **イニシャル**: [src/data/personDetails.ts](../../../src/data/personDetails.ts) の `initials`（例 `"Y.C"`）。job.astro で既に `initialsBySlug` を構築済み。
- **入社年**: [src/data/persons.ts](../../../src/data/persons.ts) の `year`（例 `"2014年"`）。同じ `slug` で引ける。

job.astro の `seniors` 配列に現れる slug（`"01"`〜`"15"`）はすべて両ファイルに存在するため、欠損は発生しない。

## 実装内容

### 1. データ層 — job.astro frontmatter

既存の `initialsBySlug` と同じパターンで入社年マップを追加する。

```ts
import { persons } from "../data/persons";

// 既存
const initialsBySlug = Object.fromEntries(
  personDetails.map((p) => [p.slug, p.initials]),
);
// 追加
const yearBySlug = Object.fromEntries(
  persons.map((p) => [p.slug, p.year]),
);
```

`入社` の付与はテンプレート側で行い（`{yearBySlug[slug]}入社`）、データは生の `year` のまま保つ。

### 2. マークアップ — job.astro（`.p-job-card__interview-item` 内のリンク）

`<a>` でアバターとキャプションの両方を囲む（現状はアバター `<img>` のみを内包）。

```astro
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
```

### 3. スタイル — [src/scss/object/project/_p-job.scss](../../../src/scss/object/project/_p-job.scss)

**既存ルールの変更**

- `.p-job-card__interview-link`
  - `display: block; border-radius: 50%;` → `display: flex; flex-direction: column; align-items: center; gap: 6px;`
  - 丸枠はアバター側（`.p-job-card__interview-avatar` の `border-radius: 50%`）が保持するため、リンクの `border-radius: 50%` は削除。
  - hover / focus-visible の `transform: translateY(-2px)` と、`:hover/.focus-visible .p-job-card__interview-avatar` のリング表現は現状維持。
- `.p-job-card__interview-list`
  - `flex-wrap` 横並びを維持。`align-items: flex-start;` を追加し、各アイテムを上揃え（キャプション行数が揃わなくても頭が揃う）。

**追加クラス**

```scss
.p-job-card__interview-meta {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  line-height: 1.3;
}

.p-job-card__interview-initials {
  color: var(--color-text-primary);   // #1d2527
  font-weight: 700;
  font-size: 13px;
  letter-spacing: 0.04em;
}

.p-job-card__interview-year {
  color: var(--color-text-secondary); // #4b5563
  font-size: 12px;
}
```

## アクセシビリティ

- アバター `<img alt="">` は装飾扱いのまま（キャプションが可視テキストとして人物を示す）。
- リンクの `aria-label` に入社年も含め、可視テキスト（イニシャル・年）と読み上げ名を整合させる（WCAG 2.5.3 Label in Name 配慮）。

## レスポンシブ / 整合性

- interview 系の既存メディアクエリは存在しないため競合なし。
- 横並び＋`flex-wrap` のため、1カード最大3名でカード幅に収まらない場合は折り返す。
- ビルド制約を順守：相対パス維持・Astro スコープCSS不使用（`<style>` ブロックを追加しない）・FLOCSS の `p-` 接頭辞・スタイルは `_p-job.scss` に追記。

## 変更ファイル

- [src/pages/job.astro](../../../src/pages/job.astro) — `persons` import、`yearBySlug` 追加、interview リンクのマークアップ更新。
- [src/scss/object/project/_p-job.scss](../../../src/scss/object/project/_p-job.scss) — リンク／リストの調整、メタ用クラス3つ追加。

## スコープ外

- 入社区分（新卒／中途）の表示。今回は入社年のみ。
- 他ページ（person 一覧・個別、特集など）のアバター表記。
- 新規画像・データの追加。

## 受け入れ条件

1. `/job/` の各先輩アバターの真下に、イニシャル（例 `Y.C`）と入社年（例 `2014年入社`）が2行（縦並び）で表示される。
2. アバター列はこれまで通り横並びで、複数名はカード幅に応じて折り返す。
3. アバター・キャプションのどこをクリックしても該当 `/person/<slug>/` へ遷移する。
4. `npm run build` が通り、`dist/` の出力にハッシュ・スコープCSS属性（`data-astro-cid-*`）が混入しない。
5. 表示文言に社員氏名が現れない。
