# hoshizaki-hq-recruit

ホシザキ本社採用サイトのAstroプロジェクトです。

## ビルド出力の仕様

このプロジェクトは、ビルド後のコードをクライアントが直接編集できるよう、以下の設定を適用しています。

### 可読性の確保

- **HTML**: 圧縮なし、インデント付きで出力、`data-astro-cid-*`属性なし
- **CSS**: 外部ファイル（`css/style.css`）として管理、CSSカスタムプロパティ使用
- **JavaScript**: 圧縮・難読化なし

### 相対パス出力

FTPでサーバーのサブディレクトリに配置されることを想定し、すべてのパスは相対パスで出力されます。
どのディレクトリにデプロイしてもリンク切れが発生しません。

- トップページ: `./css/style.css`, `./about/`
- 下層ページ: `../css/style.css`, `../`

### ページ出力形式

下層ページはディレクトリ形式で出力されます（例: `/about/` でアクセス可能）。

### Scoped CSSの廃止

Astroのscoped CSSはHTMLに`data-astro-cid-*`属性を付与するため使用しません。
すべてのスタイルは`src/scss/`配下のSCSSファイルで管理し、ビルド時に`public/css/style.css`へコンパイルします。

### ファイル名のハッシュ化無効

アセットファイルにはハッシュが付与されません。

```
dist/
├── index.html
├── about/
│   └── index.html     (/about/ でアクセス)
├── favicon.svg
├── favicon.ico
├── css/
│   └── style.css      (グローバルCSS)
└── assets/
    ├── astro.svg
    └── background.svg
```

## CSS設計（FLOCSS）

CSSはFLOCSS（Foundation, Layout, Object）に基づいて設計しています。

### ディレクトリ構成

```
src/scss/
├── style.scss              # エントリーポイント
├── foundation/
│   ├── _variables.scss     # CSSカスタムプロパティ
│   ├── _reset.scss         # リセットスタイル
│   └── _base.scss          # ベーススタイル（h1, h2, p, code等）
├── layout/
│   ├── _l-container.scss   # コンテナ
│   ├── _l-main.scss        # メインエリア
│   └── _l-background.scss  # 背景
└── object/
    ├── component/
    │   ├── _c-box.scss     # 汎用ボックス
    │   └── _c-button.scss  # ボタン
    ├── project/
    │   ├── _p-hero.scss    # ヒーローセクション
    │   ├── _p-links.scss   # リンクセクション
    │   ├── _p-news.scss    # ニュースカード
    │   └── _p-about.scss   # Aboutページ
    └── utility/
        └── (必要に応じて追加)
```

### 命名規則

| プレフィックス | 用途 | 例 |
|:--------------|:-----|:---|
| `l-` | Layout（レイアウト） | `.l-container`, `.l-main` |
| `c-` | Component（汎用コンポーネント） | `.c-box`, `.c-button` |
| `p-` | Project（プロジェクト固有） | `.p-hero`, `.p-news`, `.p-about` |
| `u-` | Utility（ユーティリティ） | `.u-hidden`, `.u-mt-10` |

### CSSカスタムプロパティ

Sass変数ではなくCSSカスタムプロパティを使用しています。
`:root`で定義された変数は`var(--変数名)`で参照できます。

```css
:root {
  --color-text-primary: #111827;
  --spacing-md: 16px;
  --border-radius-lg: 16px;
}

.c-box {
  color: var(--color-text-primary);
  padding: var(--spacing-md);
  border-radius: var(--border-radius-lg);
}
```

## 開発時のルール

- **Astroコンポーネント内で`<style>`タグを使用しない**
- スタイルはすべて`src/scss/`配下のSCSSファイルに記述する
- Sass変数・mixinは使用せず、CSSカスタムプロパティを使用する
- クラス名はFLOCSSの命名規則に従う
- 画像・アセットは`public/assets/`に配置し、相対パスで参照する

## 下層ページの追加方法

1. `src/pages/`にページファイルを作成（例: `src/pages/contact.astro`）
2. Layoutに`basePath="../"`を指定して相対パスを調整
3. 必要に応じて`src/scss/object/project/`にスタイルを追加

```astro
---
import Layout from "../layouts/Layout.astro";
---

<Layout basePath="../">
  <div class="l-container">
    <!-- ページ内容 -->
  </div>
</Layout>
```

## Project Structure

```
/
├── public/
│   ├── assets/             ← 画像ファイル
│   │   ├── astro.svg
│   │   └── background.svg
│   ├── css/
│   │   └── style.css       ← ビルドで生成されるCSS
│   └── favicon.svg
├── src/
│   ├── components/
│   │   └── Welcome.astro
│   ├── layouts/
│   │   └── Layout.astro    ← 共通レイアウト（basePath対応）
│   ├── pages/
│   │   ├── index.astro     ← トップページ
│   │   └── about.astro     ← 下層ページ
│   └── scss/               ← SCSSソースファイル
│       ├── style.scss
│       ├── foundation/
│       ├── layout/
│       └── object/
└── package.json
```

## Commands

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | SCSS→CSS変換＋Astroビルド＋HTML整形              |
| `npm run build:scss`      | SCSSをCSSにコンパイル                            |
| `npm run watch:scss`      | SCSSの変更を監視して自動コンパイル               |
| `npm run preview`         | Preview your build locally, before deploying     |
