# docs/ — ホシザキ本社採用サイト プロジェクトドキュメント

このフォルダは本プロジェクトの**一次情報源**です。Claude は実装作業を始める前に必ずここを参照してください。コードから自明な情報ではなく、「なぜそう作るのか」「何を守るのか」「今どこまで進んでいるのか」を集約しています。

## ファイル一覧

| #  | ファイル | 役割 |
|:--|:--|:--|
| 00 | [README.md](./README.md) | 本ファイル。索引と運用ルール。 |
| 01 | [01-project-plan.md](./01-project-plan.md) | プロジェクト全体計画（目的・スコープ・ページ構成 14 ページ・マイルストーン）。 |
| 02 | [02-environment.md](./02-environment.md) | Astro／ビルド環境仕様と禁止事項。納品形態に直結する制約の根拠。 |
| 03 | [03-spec-top-page.md](./03-spec-top-page.md) | トップページ（`/`）詳細スペック。 |
| 04 | [04-progress.md](./04-progress.md) | タスクチェックリストと進行ステータス。 |
| 05 | [05-workflow-for-claude.md](./05-workflow-for-claude.md) | Claude の作業手順・着手前／完了時チェックリスト。 |
| 06 | [06-spec-common.md](./06-spec-common.md) | 共通コンポーネント（Header／Footer／パンくず／氷ボタン／CTA バナー／PageHeader／PersonCard／SpecialStoryCard）の仕様。 |
| 07 | [07-spec-subpages.md](./07-spec-subpages.md) | 下層 13 ページ（Message／Fact／Strategy／Job／Person 一覧・詳細／Environment／Requirement／Special インデックス・3 ストーリー／Internship）の仕様。 |
| 08 | [08-hyoki-report.md](./08-hyoki-report.md) | 全原稿の表記揺れ統一方針 決定シート（`/proofread-jp` で検出・重複統合済み）。クライアント判断用の作業レポート。 |
| 09 | [09-dup-expr-report.md](./09-dup-expr-report.md) | 全原稿の重複表現（二重敬語・重言・近接重複）チェックレポート。クライアント判断用の作業レポート。 |

## Claude の読む順序

新しいセッションで実装作業に着手するときは、以下の順序で読んでください。

1. リポジトリルートの [CLAUDE.md](../CLAUDE.md) — 本リポジトリの全体ガイド。
2. 本ファイル（`docs/README.md`）— 索引。
3. [05-workflow-for-claude.md](./05-workflow-for-claude.md) — 作業フローと禁止事項の要点。
4. [02-environment.md](./02-environment.md) — 環境制約（特に「納品時に守るべきこと」）。
5. 対応するスペック：
   - トップページ → [03-spec-top-page.md](./03-spec-top-page.md)
   - 共通コンポーネント → [06-spec-common.md](./06-spec-common.md)
   - 下層ページ → [07-spec-subpages.md](./07-spec-subpages.md) の該当セクション
6. [04-progress.md](./04-progress.md) — 次に着手すべきタスクを確認し、ステータスを更新。

## 更新ルール

- **仕様変更が発生したら**、コードを書く前に該当 docs を先に更新する。docs とコードの乖離を避けるのが最優先。
- **`astro.config.mjs` や `package.json` の scripts を変更する場合**は、必ず [02-environment.md](./02-environment.md) の該当表を同時に更新する。
- **新しい共通コンポーネントを追加する場合**は [06-spec-common.md](./06-spec-common.md) を更新し、`04-progress.md` の M2 にタスクを追加する。
- **新しい下層ページを追加／既存ページの構成を変更する場合**は [07-spec-subpages.md](./07-spec-subpages.md) の該当セクションを更新し、`01-project-plan.md` のページ一覧と `04-progress.md` の M6b にも反映する。
- **タスクの進捗**は実装者（Claude／人間を問わず）が [04-progress.md](./04-progress.md) のチェックボックスを都度更新する。
- **docs の日本語表記**で統一する（コード識別子や Figma のノード ID など固有名詞を除く）。

## このフォルダ外の関連ファイル

| ファイル | 関係 |
|:--|:--|
| [../CLAUDE.md](../CLAUDE.md) | Claude Code 向けのリポジトリガイド。docs への導線を含む。 |
| [../README.md](../README.md) | プロジェクト公開向け概要（FLOCSS 設計など）。docs/02 と重複する部分があるが、README は外向け・docs は作業用として役割を分ける。 |
| [../astro.config.mjs](../astro.config.mjs) | 納品要件を満たす設定。**変更は慎重に**、必ず docs/02 と連動させる。 |
| [../src/layouts/Layout.astro](../src/layouts/Layout.astro) | `basePath` による相対パス切替。下層ページ追加時に参照。 |
| [../src/scss/style.scss](../src/scss/style.scss) | SCSS エントリ。新規 partial は必ずここに `@use` 登録。 |
