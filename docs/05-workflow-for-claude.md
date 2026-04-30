# 05. Claude のワークフロー

このファイルは Claude 向けの作業手順書です。**新しいセッションで実装タスクに着手するときは、まずこのページに目を通してください。**

## 0. 起動時に読むもの

1. [../CLAUDE.md](../CLAUDE.md) — リポジトリ全体のガイド。
2. [./README.md](./README.md) — docs 索引。
3. 本ファイル（`docs/05-workflow-for-claude.md`）— 作業手順。
4. [./02-environment.md](./02-environment.md) — **禁止事項と納品要件の絶対ルール**。
5. 対応するスペック（現状は [./03-spec-top-page.md](./03-spec-top-page.md)）。
6. [./04-progress.md](./04-progress.md) — 次に着手すべきタスクを確認。

## 1. 作業着手前チェック

タスクを始める前に以下を確認する。

- [ ] `docs/04-progress.md` で該当タスクを `[ ]` → `[~]` に変更した。
- [ ] `docs/02-environment.md` の「禁止事項まとめ」を守れるタスクか確認した。
- [ ] 対象セクションの Figma node ID と `docs/03-spec-top-page.md` の該当行を読んだ。
- [ ] 新規 SCSS partial／Astro コンポーネントを追加する場合、命名規則（`l-` / `c-` / `p-` / `u-`）が決まっている。

## 2. 実装時の絶対ルール

[02-environment.md](./02-environment.md) に詳細がありますが、**頻出の禁止事項**を再掲します。

- ❌ `.astro` ファイル内で `<style>` ブロックを書かない（`data-astro-cid-*` が混入する）。
- ❌ Sass 変数・mixin を使わない。CSS カスタムプロパティ（`var(--xxx)`）で統一。
- ❌ `import "./xxx.png"` でアセットを読まない。`public/` 配下に置いて相対パスで参照。
- ❌ `href="/css/..."` のようなルート絶対パスを書かない。`./` か `../` を使う。
- ❌ `astro.config.mjs` の `compressHTML` や `minify` を `true` に戻さない。
- ✅ 新しい SCSS partial を作ったら **必ず** [../src/scss/style.scss](../src/scss/style.scss) に `@use` を追加する。
- ✅ 下層ページを作ったら `<Layout basePath="../">`（深さに応じて `../../` 等）を必ず指定する。

## 3. タスク完了時チェック

実装が終わったら**必ず**以下を実行する。1 つでも失敗したらタスクを `[r]` にせず、まず修正する。

```sh
# 1. ビルドが通る
npm run build

# 2. Astro 固有属性が残っていない（0 件）
grep -r 'data-astro-cid' dist/

# 3. インラインスタイルが生 HTML に無い
grep -r '<style' dist/ --include='*.html'

# 4. ルート絶対パスが無い（0 件）
grep -rE 'href="/|src="/' dist/ --include='*.html'

# 5. ファイル名にハッシュが付いていない（assets/ の ls 目視）
ls dist/assets/

# 6. HTML がインデント整形されている
head -30 dist/index.html
```

さらに：

- [ ] [../src/scss/style.scss](../src/scss/style.scss) に新規 partial の `@use` が登録されている。
- [ ] [./04-progress.md](./04-progress.md) の該当タスクを `[~]` → `[r]` に更新した。
- [ ] 必要に応じてスクリーンショットや動作確認内容をユーザーに共有した。

## 4. 仕様が変わったら docs を先に更新する

実装中に仕様の解釈変更や追加要件に気付いた場合、**コードより先に docs を更新**する。コード → docs の順は避ける（乖離の原因）。

| 変更の種類 | 更新すべき docs |
|:--|:--|
| ビルド設定（`astro.config.mjs` / `package.json`） | `02-environment.md` |
| SCSS 命名規則や FLOCSS 運用 | `02-environment.md` |
| トップページのセクション構成・クラス・アセット | `03-spec-top-page.md` + `04-progress.md` |
| プロジェクト全体のスコープ・ページ構成・マイルストーン | `01-project-plan.md` |
| Claude のワークフロー自体 | 本ファイル |

## 5. 迷ったときの判断基準

- **「クライアントが納品後の HTML をエディタで開いて編集できるか？」** を常に基準にする。これが守れない設計は不採用。
- **「同じ要素を 2 つ以上のページで使う可能性があるか？」** があれば `c-*`（component 層）または `src/components/` の Astro コンポーネントへ。
- **特定ページ専用** なら `p-*`（project 層）。
- **1 行の調整** なら `u-*`（utility 層）。

## 6. ユーザーへの報告フォーマット（推奨）

実装完了時の報告は簡潔に：

```
- 変更: <変更した主なファイル/セクションを 1〜3 行>
- 検証: npm run build / data-astro-cid grep (0 件) / ブラウザ目視
- 次: <次に着手すべき 04-progress.md のタスク番号>
```
