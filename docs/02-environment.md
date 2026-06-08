# 02. 環境仕様とビルド制約

このドキュメントは「なぜこの設定なのか」を記録する根拠資料です。[../astro.config.mjs](../astro.config.mjs) や [../package.json](../package.json) の scripts を変更するときは、**必ずこのファイルを同時に更新**してください。

## 大前提：納品後はクライアントが HTML を直接編集する

この一点がすべての設定を決定しています。以下の要件は**すべて「納品後の手編集で破綻しないこと」**から導かれています。

| 要件 | 破綻する失敗例 |
|:--|:--|
| Astro の scoped CSS（`data-astro-cid-*`）が HTML に混入しない | クライアントがクラスを手編集したとき、対応する `[data-astro-cid-xxx]` セレクタと同期できず、スタイルが効かなくなる |
| HTML／CSS／JS が圧縮されていない | 手編集できない |
| CSS は外部ファイル化されている | インラインスタイルだと管理できない |
| ファイル名にハッシュが付いていない | 次回ビルドで差替えたときにクライアント側のリンクが切れる |
| すべてのパスが相対 | サーバー上のサブディレクトリに配置したとき、絶対パスだとリンク切れ |
| 下層ページが `/about/index.html` 形式 | `about.html` だと URL から拡張子が見えて編集者が迷う／SEO 的にも不利 |

## `astro.config.mjs` の設定一覧

現行 [../astro.config.mjs](../astro.config.mjs) は上記要件をすべて満たしています。**変更不要**。各設定の意図は以下の通り。

| 設定 | 値 | 意図 |
|:--|:--|:--|
| `base` | `"./"` | 相対パスでリンクを出力。配置先のサブディレクトリが変わってもリンク切れしない。 |
| `compressHTML` | `false` | HTML 圧縮を無効化。インデントと改行を保持し手編集可能にする。 |
| `build.assets` | `"assets"` | アセットの出力先ディレクトリを `dist/assets/` に固定。 |
| `build.inlineStylesheets` | `"never"` | CSS をインライン化せず外部ファイル化。`css/style.css` として独立。 |
| `build.format` | `"directory"` | 下層ページを `dist/about/index.html` 形式で出力（`/about/` でアクセス可）。 |
| `vite.build.minify` | `false` | JS の圧縮・難読化を無効化。可読な JS を出力。 |
| `vite.build.cssMinify` | `false` | CSS の圧縮を無効化。 |
| `vite.build.rollupOptions.output.entryFileNames` | `"assets/[name].js"` | エントリ JS のファイル名ハッシュを除去。 |
| `vite.build.rollupOptions.output.chunkFileNames` | `"assets/[name].js"` | チャンク JS のファイル名ハッシュを除去。 |
| `vite.build.rollupOptions.output.assetFileNames` | `"assets/[name][extname]"` | アセットのファイル名ハッシュを除去。 |

## ビルドパイプライン

[../package.json](../package.json) の `scripts.build` は次の 3 段階を順に実行します。

```
npm run build:scss  ->  astro build  ->  js-beautify (dist/**/*.html)
```

| 段階 | コマンド | 目的 | なぜこの順序か |
|:--|:--|:--|:--|
| 1 | `sass src/scss/style.scss public/css/style.css --style expanded --no-source-map` | SCSS を単一の `public/css/style.css` にコンパイル | `public/` 配下は Astro がそのままコピーするだけなので、**Astro ビルド前に CSS が出来ている**必要がある。`--style expanded` で非圧縮、`--no-source-map` で map ファイルを出力しない。 |
| 2 | `astro build` | 静的ファイルを `dist/` に出力 | `public/css/style.css` を含めた `dist/` を生成。 |
| 3 | `find dist -name '*.html' -exec npx js-beautify --type html -r {} +` | すべての HTML をインデント整形 | Astro の `compressHTML: false` でも属性整形までは保証されないため、最終段で `js-beautify` を通して手編集に耐える体裁にする。 |

## SCSS 運用（FLOCSS）

エントリは [../src/scss/style.scss](../src/scss/style.scss)。ここに登録されない partial はビルドされません。

```
src/scss/
├── style.scss              エントリポイント（@use を列挙）
├── foundation/
│   ├── _variables.scss     CSS カスタムプロパティ定義
│   ├── _reset.scss         リセット
│   └── _base.scss          ベース要素スタイル
├── layout/                 l-*  （レイアウト）
├── object/
│   ├── component/          c-*  （汎用コンポーネント）
│   ├── project/            p-*  （プロジェクト固有）
│   └── utility/            u-*  （ユーティリティ）
```

### 命名規則

| プレフィックス | 層 | 例 |
|:--|:--|:--|
| `l-` | Layout | `.l-container`, `.l-main` |
| `c-` | Component（再利用可能） | `.c-box`, `.c-button` |
| `p-` | Project（ページ・セクション固有） | `.p-hero`, `.p-news`, `.p-about` |
| `u-` | Utility | `.u-hidden`, `.u-mt-16` |

### ルール

1. **CSS カスタムプロパティを使う**。Sass 変数・mixin は使わない（`:root` の `--xxx` を `var(--xxx)` で参照）。
2. **新規 partial を追加したら `style.scss` に `@use` を追記する**。自動発見されない。
3. `foundation/_variables.scss` を唯一のトークン定義場所にする（色・余白・角丸・フォント等）。

## コンポーネント規約（Astro）

### `<style>` ブロックは書かない

`.astro` ファイル内の `<style>` ブロックは Astro が scoped 化して `data-astro-cid-*` を HTML に注入します。これは**納品要件に反する**ため使用禁止。

```astro
<!-- ❌ 使わない -->
<style>
  .hero { color: red; }
</style>

<!-- ✅ すべて src/scss/ 配下に書く -->
```

`<style is:global>` も避ける（同様の属性付与は起こらないが、スタイルを 1 ヶ所に集約する運用から外れる）。

### `Layout.astro` の `basePath` プロップ

[../src/layouts/Layout.astro](../src/layouts/Layout.astro) は `basePath` プロップを取り、`favicon` と `css/style.css` の参照パスを切り替えます。

| ページ深さ | 指定する `basePath` | 例 |
|:--|:--|:--|
| トップ（`src/pages/index.astro`） | `"./"`（デフォルト） | `<Layout>` |
| 1 階層下（`src/pages/message.astro`） | `"../"` | `<Layout basePath="../">` |
| 2 階層下（`src/pages/person/[slug].astro`・`src/pages/special/crosstalk.astro`） | `"../../"` | `<Layout basePath="../../">` |

**新しい下層ページを追加したら、必ず適切な `basePath` を渡す**。忘れると CSS が読み込めず真っ白になります。

### アセット参照

- 画像・フォント等の静的ファイルは [../public/assets/](../public/assets/) または `public/` 配下の適切なディレクトリに配置する。
- HTML／CSS／JS から参照するときは `./assets/xxx.png` または `../assets/xxx.png` のように**相対パス**を使う。
- `import` でアセットを読み込む Astro／Vite 標準の手法は使わない（ビルド時にファイル名がハッシュ化される可能性を完全に排除するため、常に `public/` 静的配信で統一）。

## 検証コマンド

`npm run build` 後、以下で納品要件の充足を確認します。

```sh
# 1. Astro 固有属性が残っていないか（0 件であること）
grep -r 'data-astro-cid' dist/

# 2. CSS がインライン化されていないか（<style> が生 HTML に無いこと）
grep -r '<style' dist/ --include='*.html'

# 3. ファイル名にハッシュが混入していないか（ハッシュ風の英数文字列が無いこと）
ls dist/assets/

# 4. パスが相対か（"/css" や "/assets" などルート絶対パスが無いこと）
grep -rE 'href="/|src="/' dist/ --include='*.html'

# 5. HTML がインデント整形されているか
head -30 dist/index.html
```

## 禁止事項まとめ

- ❌ `.astro` 内の `<style>` ブロック
- ❌ Sass 変数・mixin（CSS カスタムプロパティを使う）
- ❌ `import "./xxx.png"` 形式のアセット import
- ❌ ルート絶対パス（`/css/style.css` 等）
- ❌ `compressHTML: true` や `minify: true` への変更
- ❌ ファイル名ハッシュを有効化する変更
- ❌ `inlineStylesheets: "auto" | "always"` への変更
