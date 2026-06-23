# 「このプロジェクトの製品」セクション レイアウト変更 設計

- 日付: 2026-06-23
- 対象ページ: `src/pages/special/project.astro`
- 対象セクション: `.p-project-story__product`（見出し「このプロジェクトの製品」）
- 対象スタイル: `src/scss/object/project/_p-project-story.scss`

## 背景 / 目的

現状の表示順は **画像 → 見出し → 本文**（全幅 1カラム）。
これを **見出し → 本文 → 画像** の順に変更する。
PC では左カラムに「見出し＋本文」、右カラムに「画像」を配置した 2カラムにする。

補足: 当初指定の `.p-person__catch-img` は person ページの別クラス。「このプロジェクトの製品」見出しを持つのは `.p-project-story__product` のため、本セクションを変更対象とする。

## 確定した仕様（ユーザー確認済み）

- PC カラム比率: 左（見出し＋本文）: 右（画像）≒ **6:4**（`1.4fr : 1fr`）
- 2カラム → 縦積み の切替: **600px 以下で縦積み**（タブレットは 2カラム維持）
- PC での画像の縦位置: **上下中央揃え**

## HTML 変更（project.astro）

見出し `<h2>` と本文 `<div>` を新規ラッパ `<div class="p-project-story__product-body">` で囲い、
画像 `<figure>` をラッパの後ろへ移動する。

```
<section class="p-project-story__product">
  <div class="p-project-story__product-body">     // 新規・左カラム
    <h2  class="...__product-heading" --inview-i:0>…</h2>
    <div class="...__product-text"    --inview-i:1>…</div>
  </div>
  <figure class="...__product-image"  --inview-i:2>…</figure>  // 右カラム
</section>
```

- DOM 順を「見出し→本文→画像」にすることで、縦積み時に自然にその順で並ぶ。
- `--inview-i` を 見出し0 / 本文1 / 画像2 に振り直し、出現アニメを上から順にカスケード。

## CSS 変更（_p-project-story.scss）

### 通常（>600px、PC・タブレット）
- `.p-project-story__product`: `display: grid; grid-template-columns: 1.4fr 1fr; column-gap: 48px; align-items: center;`
- `.p-project-story__product-body`: 左カラム（見出し＋本文をまとめる）
- `.p-project-story__product-heading`: `margin-top` を 0 にリセット（旧・画像下の 44px は不要）
- `.p-project-story__product-image`: `margin` リセット、グリッド内で縦中央

### 960px ブロック
- 2カラム維持のまま、`column-gap` / `padding` / アイコン・見出しフォントサイズの既存調整を踏襲。

### 600px ブロック（スマホ）
- `.p-project-story__product`: 1カラム化（`grid-template-columns: 1fr` もしくは `display: block`）
- `.p-project-story__product-image`: 上余白（`margin-top: 1.6em` 程度）を付与
- 並び順: 見出し → 本文 → 画像

## QA

`npm run build:scss` で CSS をコンパイル後、`npm run dev` を起動し、ブラウザで以下を確認:

1. PC 幅（>960px）: 左に見出し＋本文、右に画像、画像が縦中央
2. タブレット幅（600–960px）: 2カラム維持、サイズ調整が効いている
3. スマホ幅（≤600px）: 縦積みで 見出し → 本文 → 画像 の順
4. 各幅で data-inview アニメーションが上から順にカスケード

## 非対象

- person ページ（`.p-person__catch`）は変更しない。
- 製品セクション以外（Q&A、メンバー、CTA）は変更しない。
