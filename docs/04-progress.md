# 04. 進行管理

このファイルはタスクチェックリストです。Claude も人間の開発者も、作業の着手・完了時に必ず更新してください。

## ステータス記法

| 記号 | 意味 |
|:-:|:--|
| `[ ]` | 未着手 |
| `[~]` | 実装中（現在進行形で作業中のタスクは 1 つに絞るのが理想） |
| `[r]` | レビュー待ち（実装は終わったがレビュー／確認未済） |
| `[x]` | 完了 |

## 更新ルール

1. タスク着手時に `[ ]` → `[~]` に変更する。
2. 実装が終わったら `[~]` → `[r]` に変更する。
3. レビュー／動作確認が通ったら `[r]` → `[x]` に変更する。
4. 新しいタスクが発生したら該当カテゴリの末尾に追記する（番号は連番で続ける）。
5. 既存タスクの意味が変わった場合は、項目を書き換えて良い。削除は慎重に（完了した作業の記録は残す）。

---

## M1. ドキュメント整備

- [r] M1-1 `docs/` 初版作成（README / 01 / 02 / 03 / 04 / 05）。
- [ ] M1-2 `CLAUDE.md` に docs への導線を追記。DoD：`CLAUDE.md` 内から `docs/README.md` へリンクされている。
- [ ] M1-3 docs 初版のユーザーレビュー。DoD：ユーザーから OK／修正指示を受領。
- [r] M1-4 14 ページ分の仕様書追加（`06-spec-common.md`、`07-spec-subpages.md`）＋ `01` / `03` / `README` の更新。DoD：6 → 8 ファイルに拡張、相互リンク切れなし。

---

## M2. 共通基盤整備

### SCSS Foundation

- [r] M2-F1 Figma から色を抽出し `foundation/_variables.scss` に反映（navy / primary / cyan / blue-50〜400 / ice / magenta / bg-sky / bg-cloud / bg-page / bg-light）。
- [r] M2-F2 余白（spacing xs〜3xl）・角丸（sm〜pill）・ページ幅・シャドウ・トランジションを `_variables.scss` に追加済み。
- [r] M2-F3 `_base.scss` をクリーンアップ（Welcome 向けレガシー撤去）。body のフォントファミリ／カラー／行間を設定。
- [ ] M2-F4 Web フォント／ローカルフォントの読込みを `public/fonts/` に配置。※ 現状は Google Fonts CDN 前提。

### 共通コンポーネント（詳細は [06-spec-common.md](./06-spec-common.md)）

- [r] M2-C1 `Header.astro` ＋ `_l-header.scss`。Figma `361:538`。実装（2026-04-24）：ロゴ＋インターンシップ／応募はこちら CTA ＋ハンバーガー。
- [r] M2-C2 `Footer.astro` ＋ `_l-footer.scss`。Figma `360:179`。実装：4 カラム構成＋大型 HOSHIZAKI ワードマーク。
- [r] M2-C3 `Breadcrumb.astro` ＋ `_c-breadcrumb.scss`。Props: `basePath`, `items[]`（`.c-breadcrumb`）。
- [ ] M2-C4 `IceLinkButton.astro` ＋ `_c-ice-link.scss`。Figma `365:16915`。※ 現状トップページ内の `.p-top-*` として実装・将来的に共通化候補。
- [r] M2-C5 `BottomCta.astro` ＋ `_c-bottom-cta.scss`。INTERNSHIP + ENTRY 横並びバナーで M2-C5 統合版。
- [r] M2-C6 `PageHero.astro` ＋ `_c-page-hero.scss`。Props: `en`, `ja`, `variant`, `compact`, `align`, `bg`。
- [r] M2-C7 [`PersonCard.astro`](../src/components/PersonCard.astro) ＋ `_c-person-card.scss`（2026-04-25 にコンポーネント化）。`person.astro` から 14 回呼出し。Props: `image`, `quote`, `body`, `department`, `href?`。
- [r] M2-C8 SPECIAL CONTENTS ストーリーのデータ共通化（[`src/data/specialStories.ts`](../src/data/specialStories.ts)、2026-04-25）。トップ S6 と `/special/` インデックスの両方がここから 3 件を読み出す。見た目（`.p-top-special__card` と `.p-special__card`）は意図的に非共通化。
- [r] M2-C9 新規 SCSS partial をすべて [style.scss](../src/scss/style.scss) に `@use` 登録。
- [r] M2-C10 `SectionHeading.astro` ＋ `_c-section-heading.scss`（新規）。日本語＋英語セクション見出し。
- [r] M2-C11 `.c-interview-block` ＋ `_c-interview-block.scss`（新規）。Person 詳細・Special 各ページの Q+A ブロック。
- [r] M2-C12 `.c-stat-card` ＋ `_c-stat-card.scss`（新規）。Fact ページの数値カード。

### スクリプト基盤

- [ ] M2-S1 Lenis のスムーススクロール初期化を `src/scripts/lenis.ts` に実装し、`Layout.astro` から読み込む。
- [ ] M2-S2 GSAP の共通セットアップ（`src/scripts/gsap.ts`）。ScrollTrigger の共通設定を用意。
- [ ] M2-S3 Swiper は使用セクションで個別初期化する方針を合意（共通化しない）。
- [ ] M2-S4 Person 一覧のクライアントサイドフィルター（`src/scripts/person-filter.ts`）。

---

## M3. トップページ実装（`/`）

各セクションの **DoD（完了条件）** は [07-spec-subpages.md の「全ページ共通 DoD」](./07-spec-subpages.md#全ページ共通-dod) に統一。

### セクション（[03-spec-top-page.md](./03-spec-top-page.md) のセクション番号に対応）

- [r] M3-0 [src/pages/index.astro](../src/pages/index.astro) に Header／Footer 配置、ビルド成功確認（2026-04-24）。
- [r] M3-S1 Hero（`.p-top-hero`）— タグライン／ペンギン／コンセプトムービー／背景ビジュアル。2026-04-30 Figma 296:7137 準拠で再構築。
- [r] M3-S2 PIONEER SPIRIT（`.p-top-pioneer`）— pioneer.png (1600×729) を帯背景に。タイトル左上 / アイスリンクボタン左下。
- [r] M3-S3 コーポレートナビ（`.p-top-trio`）— What's / Beyond / Team を Figma 座標 (% 換算) で階段配置。sec01/sec02/sec03_img.png + link-button-ice_02-04.png。
- [r] M3-S4 先輩たちの「ここに決めた！」（`.p-top-decided`）— sec04_img.png (星型ICEフレーム入り集合写真) を直接利用。
- [r] M3-S5 はたらく環境を知る（`.p-top-env`）— section-bg-environment.jpg をフルブリードで配置。ネイビーピル見出し + アイスリンクボタン。
- [r] M3-S6 SPECIAL CONTENTS（`.p-top-special`）— ネイビー背景 + 3 カード (text 左 / 写真右 / READ MORE 右下)。
- [r] M3-S7 Entry / Internship CTA（`BottomCta` コンポーネント）。

### アニメーション

- [ ] M3-A1 Hero のタグライン／ムービーのフェードインアニメーション（GSAP）。
- [ ] M3-A2 Hero のペンギン微小浮遊（GSAP `yoyo`）。
- [ ] M3-A3 IceLinkButton のスクロール進入演出（ScrollTrigger）。
- [ ] M3-A4 S6 カードの順次フェード（ScrollTrigger）。

### アセット配置

- [~] M3-A-1 トップページのアセットを [../public/images/top/](../public/images/top/) に配置（ap_01〜05 / cloud01〜03 / ice_cubes_01〜04 / bg-city / pioneer / top_penguins / section-bg-environment 等は配置済み。不足分は Figma から追加書き出し）。
- [ ] M3-A-2 ロゴ 2 種を [../public/images/common/](../public/images/common/) に配置：ヘッダー用 `logo-hoshizaki.svg`（マーク）／フッター下部の大型ワードマーク（現状 CSS テキスト）。
- [r] M3-A-3 共通バナー（`images/common/bnr_entry.png` / `bnr_internship.png` / `skelton-penguin.png`）配置済み。

---

## M4. 動作検証（トップページ時点）

- [r] M4-1 `npm run build` が警告なしで通る（14 ページ、2026-04-25 クリーンビルド）。
- [r] M4-2 `grep -r 'data-astro-cid' dist/` が 0 件。
- [r] M4-3 `grep -rE 'href="/|src="/' dist/ --include='*.html'` が 0 件。
- [r] M4-4 `dist/assets/` 内のファイル名にハッシュが付いていない。
- [r] M4-5 `head -30 dist/index.html` でインデントが保持されている。
- [ ] M4-6 `dist/index.html` をブラウザで開き、PC 幅でレイアウト崩れがない。※ Figma アセット入稿後に要確認。
- [ ] M4-7 任意のサブディレクトリでもリンクが機能する。
- [ ] M4-8 主要ブラウザ（Chrome／Safari／Edge）で目視チェック。

---

## M5. 下層ページ仕様確定

- [r] M5-1 各ページの Figma node ID 記録（14 ページ）。
- [r] M5-2 [01-project-plan.md](./01-project-plan.md) のページ構成表を更新（14 行）。
- [r] M5-3 [06-spec-common.md](./06-spec-common.md) ＆ [07-spec-subpages.md](./07-spec-subpages.md) 作成。
- [ ] M5-4 Footer サイトマップの SPECIAL CONTENTS 3 タイトルの正式名称をクライアント確認。
- [r] M5-5 Internship v1 (`246:815`) と v2 (`446:5278`) の正版確認 → **v2 (`446:5278`) を正版として採用・忠実実装済み**（2026-05-28）。
- [ ] M5-6 採用メッセージの「人の写真は使わない／採用ペンギン」の最終方針確認。
- [ ] M5-7 Strategy ページの「飲食市場」「飲食外市場」サブセクション本文の入稿確認。

---

## M6. 下層ページ実装

各ページの **DoD** は [07-spec-subpages.md の「全ページ共通 DoD」](./07-spec-subpages.md#全ページ共通-dod) を満たすこと。

### M6a. インターンシップ（`/internship/`）— 先行実装

最初に着手・実装された下層ページ。共通コンポーネントは M2-C* で整備したものをそのまま利用。

- [r] M6a-1 Header / Footer の設計に反映（M2-C1 / M2-C2 と統合済み）。
- [r] M6a-2 ENTRY ボタンは `BottomCta`（M2-C5）に統合済み。独自の `.c-entry-button` はインターンシップ独自 ENTRY（ページ中央の大型ボタン）用として併存。
- [r] M6a-3 [src/pages/internship.astro](../src/pages/internship.astro) マークアップ。`build.format: "directory"` により `dist/internship/index.html` として出力。
- [r] M6a-4 [`_p-internship.scss`](../src/scss/object/project/_p-internship.scss) 一式＋ `style.scss` への `@use` 登録。
- [r] M6a-5 `foundation/_variables.scss` にトークン追加、`_reset.scss` / `_base.scss` 整備。
- [r] M6a-6 [Layout.astro](../src/layouts/Layout.astro) に `title` / `description` プロップ追加。
- [r] M6a-7 アセットを Figma Dev Mode MCP から 2倍 PNG で書き出し、[../public/images/internship/](../public/images/internship/) に配置（hero-collage-01〜03 / course-01〜04 / voice-01〜04 / penguin-hero / penguin-01〜03 / ice / point-bg）（2026-05-28）。
- [r] M6a-8 Figma `446:5278`（v2）に忠実に全面再実装。ヒーローのチーム写真タイル＋ペンギン＋アイス、COURSE の Swiper カルーセル（タップでコース選択→色付き）、選択コースごとに POINT〜VOICES を切り替えるタブコンテンツ、PROGRAM のペンギンイラスト等を再現（2026-05-28）。
- [ ] M6a-9 クライアント／ユーザーレビュー。コース 2〜4 の POINT/PROGRAM/募集要項/体験者の声は仮文面（Figma 未デザイン）のため要差し替え。

### M6b. その他 12 ページ（並列実装）

共通コンポーネント（M2-C1〜C9）が揃ってから着手。各ページの詳細仕様は [07-spec-subpages.md](./07-spec-subpages.md) の該当セクションを参照。

- [r] M6b-P00 トップ `/`（node `296:7137`）— 並列サブエージェント実装済み（2026-04-24）
- [r] M6b-P01 採用メッセージ `/message/`（node `162:53`）— [07 の 01 節](./07-spec-subpages.md#01-採用メッセージpioneer-spirit--message)
- [r] M6b-P02 What's HOSHIZAKI `/fact/`（node `238:6058`）— [07 の 02 節](./07-spec-subpages.md#02-whats-hoshizaki数字で見るホシザキ--fact)
- [r] M6b-P03 Beyond HOSHIZAKI `/strategy/`（node `245:557`）— [07 の 03 節](./07-spec-subpages.md#03-beyond-hoshizaki事業領域海外展開--strategy)
- [r] M6b-P04 Team HOSHIZAKI `/job/`（node `245:287`）— [07 の 04 節](./07-spec-subpages.md#04-team-hoshizaki職種紹介--job)。2026-05-28 に Figma 忠実コーディング＋実アセット書き出し済み（後述セッションログ参照）。
- [r] M6b-P05 Person 一覧 `/person/`（node `246:1055`）— [07 の 05 節](./07-spec-subpages.md#05-先輩たちのここに決めた一覧--person)
- [r] M6b-P05s Person 詳細 `/person/detail/`（node `360:58`）— [07 の 05s 節](./07-spec-subpages.md#05s-person-詳細--personslug)
- [r] M6b-P06 はたらく環境 `/environment/`（node `242:446`）— [07 の 06 節](./07-spec-subpages.md#06-はたらく環境environment--environment)
- [r] M6b-P07 募集要項 `/requirement/`（node `242:71`）— [07 の 07 節](./07-spec-subpages.md#07-募集要項requirement--requirement)
- [r] M6b-P08 SPECIAL CONTENTS インデックス `/special/`（node `368:1401`）— [07 の 08 節](./07-spec-subpages.md#08-special-contents-インデックス--special)
- [r] M6b-P08-1 クロストーク `/special/crosstalk/`（node `246:935`）— [07 の 08-1 節](./07-spec-subpages.md#08-1-クロストーク--specialcrosstalk)
- [r] M6b-P08-2 プロジェクトストーリー `/special/project/`（node `393:1711`）— [07 の 08-2 節](./07-spec-subpages.md#08-2-プロジェクトストーリー--specialproject)
- [r] M6b-P08-3 スペシャルトーク `/special/talk/`（node `393:1902`）— [07 の 08-3 節](./07-spec-subpages.md#08-3-スペシャルトーク--specialtalk)

### アセット一括配置

- [ ] M6-A1 13 ページ分のアセットを Figma から書き出して [../public/images/<page>/](../public/images/) 配下へ配置（各ページ仕様書のアセット表に従う）。
- [ ] M6-A2 Person 用 14 名分の写真を [../public/images/person/](../public/images/person/) に配置し、必要に応じて `src/data/persons.ts` から参照。

---

## M7. 納品

- [ ] M7-1 M4（トップ） ＋ M6 全ページの DoD が満たされている。
- [ ] M7-2 `docs/` 全体がレビュー済みで最新。
- [ ] M7-3 `dist/` をクライアントへ引き渡し（配布方法は要確認）。
- [ ] M7-4 クライアントによる手編集シナリオを 1 件実機確認（任意のセクションの文言を変更 → 表示反映）。

---

## セッションログ（次エージェントへの引き継ぎ）

新しい Claude セッションが本リポジトリで作業を継続するときは、まずこのログを読んで現在の状態を把握してください。新しい作業を完了するたびに、このログに**日付＋短い記録**を追加してください（時系列で末尾に積み増す方針）。

### 2026-04-24 セッション 1：インターンシップページ先行実装

- **着手範囲**：[/internship/](../src/pages/internship.astro) の単独実装と共通基盤の初期整備。
- **作成ファイル**：
  - [src/pages/internship.astro](../src/pages/internship.astro)（マークアップ）
  - [src/components/Header.astro](../src/components/Header.astro) / [Footer.astro](../src/components/Footer.astro)（v1 骨組み）
  - [src/scss/object/project/_p-internship.scss](../src/scss/object/project/_p-internship.scss)
  - [src/scss/object/component/_c-entry-button.scss](../src/scss/object/component/_c-entry-button.scss)
  - [src/scss/layout/_l-header.scss](../src/scss/layout/_l-header.scss) / [_l-footer.scss](../src/scss/layout/_l-footer.scss)
- **基盤改修**：[Layout.astro](../src/layouts/Layout.astro) に `title` / `description` プロップ追加、Google Fonts（Noto Sans JP / Montserrat）を CDN 読込み。
- **ブランドトークン**：[_variables.scss](../src/scss/foundation/_variables.scss) に navy / primary / cyan / blue-50〜400 / ice / 余白／角丸／シャドウ／ページ幅トークンを定義。
- **検証**：`npm run build` 成功（3 ページ）、`data-astro-cid` 0 件、絶対パス 0 件、`<style>` 0 件。
- **未完**：Figma `446:5278` のアセット書き出し（hero-bg / course-*.jpg / voice-*.png 等）。

### 2026-04-24 セッション 2：13 ページ並列実装＋共通コンポーネント拡張

- **着手範囲**：M6b（残り 13 ページ＝トップ＋12 下層）の一括実装。
- **共通コンポーネント追加**：
  - [PageHero.astro](../src/components/PageHero.astro)（`en` / `ja` / `variant: light|blue|cloud` / `compact` / `align` / `bg`）
  - [SectionHeading.astro](../src/components/SectionHeading.astro)（`en` / `ja` / `note` / `id` / `align` / `size`）
  - [Breadcrumb.astro](../src/components/Breadcrumb.astro)（`basePath` 付与で 採用TOP を自動先頭付与）
  - [BottomCta.astro](../src/components/BottomCta.astro)（INTERNSHIP + ENTRY 横並びバナー）
  - 対応 SCSS：`_c-page-hero.scss` / `_c-section-heading.scss` / `_c-breadcrumb.scss` / `_c-bottom-cta.scss` / `_c-stat-card.scss` / `_c-person-card.scss` / `_c-interview-block.scss`
- **新規ページ**（全 13 ファイル、`build.format: "directory"` で `dist/<route>/index.html` として出力）：
  - [index.astro](../src/pages/index.astro) / [message.astro](../src/pages/message.astro) / [fact.astro](../src/pages/fact.astro) / [strategy.astro](../src/pages/strategy.astro) / [job.astro](../src/pages/job.astro) / [environment.astro](../src/pages/environment.astro) / [requirement.astro](../src/pages/requirement.astro) / [person.astro](../src/pages/person.astro)
  - 2 階層下層：[person/detail.astro](../src/pages/person/detail.astro) / [special.astro](../src/pages/special.astro) / [special/crosstalk.astro](../src/pages/special/crosstalk.astro) / [special/project.astro](../src/pages/special/project.astro) / [special/talk.astro](../src/pages/special/talk.astro)
- **新規 SCSS partial**（13 ファイル、合計約 4,500 行）：`_p-top.scss` / `_p-message.scss` / `_p-fact.scss` / `_p-strategy.scss` / `_p-job.scss` / `_p-person.scss` / `_p-person-detail.scss` / `_p-environment.scss` / `_p-requirement.scss` / `_p-special.scss` / `_p-crosstalk.scss` / `_p-project-story.scss` / `_p-special-talk.scss`。すべて [style.scss](../src/scss/style.scss) に `@use` 登録済み。
- **クラス命名の注意**：requirement / environment ページは `.p-req` / `.p-env` を使用（`.p-requirement` / `.p-environment` ではない）。次エージェントは既存の `_p-requirement.scss` / `_p-environment.scss` 内のクラスプレフィックスを尊重すること。
- **Header / Footer の v2 化**：`Header.astro` を「ロゴ＋『インターンシップ』『応募はこちら』2 つの濃紺 CTA ＋ハンバーガー」構成に更新。`Footer.astro` を「採用TOP / About / SPECIAL / Career の 4 列構成＋大型 `HOSHIZAKI` ワードマーク」に更新。`l-header--light` / `l-header--solid` バリアント追加。

### 2026-04-25 検証：14 ページ・クリーンビルド

```sh
npm run build
# → 14 page(s) built in 704ms
```

| 項目 | 結果 | コマンド |
|:--|:-:|:--|
| 生成ページ数 | **14** | `find dist -name 'index.html' \| wc -l` |
| `data-astro-cid` 混入 | **0** | `grep -r 'data-astro-cid' dist/ \| wc -l` |
| インライン `<style>` 混入 | **0** | `grep -rl '<style' dist/ --include='*.html' \| wc -l` |
| ルート絶対パス | **0** | `grep -rE 'href="/\|src="/' dist/ --include='*.html' \| wc -l` |
| 出力 CSS 行数（非圧縮） | **5,944** | `wc -l dist/css/style.css` |
| HTML 整形 | OK | `js-beautify` 自動適用 |

生成された 14 ルート：

```
dist/
├─ index.html                     ← /
├─ environment/index.html         ← /environment/
├─ fact/index.html
├─ internship/index.html
├─ job/index.html
├─ message/index.html
├─ person/index.html
├─ person/detail/index.html
├─ requirement/index.html
├─ special/index.html
├─ special/crosstalk/index.html
├─ special/project/index.html
├─ special/talk/index.html
└─ strategy/index.html
```

### 2026-04-30 セッション: トップページの Figma 忠実コーディング

- **着手範囲**: トップページ (`/`) を Figma `296:7137` に忠実に再構築。
- **修正ファイル**:
  - [src/pages/index.astro](../src/pages/index.astro) — マークアップを Figma セクション構造 (S1〜S6) に合わせて全面リライト。
  - [src/scss/object/project/_p-top.scss](../src/scss/object/project/_p-top.scss) — Figma 座標準拠で全面リライト (≈ 800 行)。`.c-ice-link` 共通クラスを定義し、6 つの ice-link button (Figma `LinkButtonIce` 207×200) を統一管理。
  - [src/scss/foundation/_variables.scss](../src/scss/foundation/_variables.scss) — `--color-brand-sky` (鮮やか cyan) `--color-brand-sky-light` `--color-special-bg` `--color-special-card` `--font-family-display` (Barlow Condensed) を追加。
- **アセット対応** ([../public/images/top/](../public/images/top/)):
  - PIONEER SPIRIT 帯背景: `pioneer.png` (1600×729 = Figma node 296:7176 と完全一致)
  - 飛ぶペンギン (Hero): `ap_01-05.png`
  - 雲: `cloud01-03.png`
  - 都市シルエット: `bg-city.png`
  - 氷キューブ装飾: `ice_cubes_01-04.png`
  - Trio 各画像: `sec01_img.png` (What's: 単独ペンギン) / `sec02_img.png` (Beyond: 地球儀) / `sec03_img.png` (Team: 3 羽)
  - ここに決めた! 集合写真: `sec04_img.png` (星型氷フレーム入りの 3 名社員)
  - アイスリンクボタン: `link-button-ice_01-06.png`
  - 環境セクション背景: `section-bg-environment.jpg`
- **SPECIAL CONTENTS カード**: [public/images/special/01-03.png](../public/images/special/) (Figma 各カード 1436×519) を photo として使用。アバター丸は `sp01_pic01-04.png` / `sp02_pic01-02.png` / `sp03_pic01.png`。
- **検証**: `npm run build` 14 ページ クリーンビルド。`data-astro-cid=0`, インライン `<style>=0`, ルート絶対パス `=0`, ファイル名ハッシュ無し。Playwright で各セクションを 1600×900 ビューポート目視確認 (Hero / Pioneer / Trio / Decided / Env / Special)。
- **既知の TODO**:
  - CONCEPT MOVIE のサムネイル画像 (Figma 296:7295/12584 IM6_8107) と `concept-movie.mp4` 入稿待ち — 現状はダミーの青グラデ + 再生ボタンのみ。
  - SP 版 (Figma `431:1181`) のレイアウト適用は未着手 (現状は @media 960px の暫定縦並び)。
  - Hero / IceLink / SPECIAL カードの GSAP アニメーション (M3-A1〜A4) は未実装。

### 2026-05-28 セッション: 職種紹介ページ（/job/）の Figma 忠実コーディング

- **着手範囲**: `/job/`（Figma `245:287`「04_job」1600×6226）を Figma に忠実に再構築＋実アセットを Figma から書き出し。
- **修正ファイル**:
  - [src/pages/job.astro](../src/pages/job.astro) — フラットなカード一覧から **3 グループ構成**（製品を生み出す／製品を広める／会社を管理・サポートする）に全面リライト。各グループ＝シアンのラベルバー＋ペンギン装飾＋カード。組織図（チャート）も Figma 構造に刷新。
  - [src/scss/object/project/_p-job.scss](../src/scss/object/project/_p-job.scss) — 全面リライト。カードは白・角丸 10px・タイトル左に縦ティック（`--color-brand-primary`）。本文 18px/行間 2。組織図ボックスは白・角丸 25px＋アイステクスチャ（32%）、見出し `#00a0e9`（`--color-brand-cyan`）、項目ネイビー。連携／サポートは矢印付きピルで表現。先輩インタビュー導線（カード 01 のみ）。
- **アセット書き出し**（[../public/images/job/](../public/images/job/)、全て Figma から MCP で書き出し→ 2 倍解像度に加工）:
  - 職種カード写真 8 枚 `card-01.jpg`〜`card-08.jpg`（720×455、Figma マスク比 ≈315:199 で中央クロップ、JPEG q80、各 52〜76KB）。元写真は全解像度（4096px 級）で書き出されるため中央クロップ＋縮小で生成。card-01=IM6_8959 / card-08=IM6_8735（別写真）。
  - 組織図テクスチャ `diagram-bg.png`（760×922、低ポリのアイス）。
  - グループ見出し脇のペンギン切り抜き 3 種 `penguin-create.png`（レンチ持ち）/ `penguin-spread.png` / `penguin-support.png`。
  - ヒーローは既存 `page-fv.png` を継続利用。
- **判断（ユーザー確認済み）**: ①カード写真=中央クロップ＋2x、②先輩インタビューはカード 01 のみ、③組織図は忠実再現。先輩インタビューのリンク先は既存 `/person/`、丸アバターは既存 `images/person/thumb01.png`（開発設計職の人物）を流用 ← 要確認なら差し替え可。
- **検証**: `npm run build` 14 ページ成功。`data-astro-cid=0`、`/job/` のインライン `<style>=0`、ルート絶対パス `=0`、アセットハッシュ無し。静的サーバ（dist/ を `python3 -m http.server`）＋ Playwright 1440 幅で全体・組織図を目視確認し Figma と一致。
- **未確認 / TODO**:
  - 先輩インタビューのリンク先・アバターの正式指定（暫定で `/person/` ＋ `thumb01.png`）。
  - SP（モバイル）レイアウトは `@media 768px` で暫定縦並び。Figma の SP デザイン確認後に再調整。

### 2026-05-28 セッション: 募集要項ページ（/requirement/）の Figma 忠実コーディング

- **着手範囲**: `/requirement/`（Figma `242:71`「07_requirement」1600×2908）を Figma に忠実に再構築。
- **修正ファイル**:
  - [src/pages/requirement.astro](../src/pages/requirement.astro) — マークアップ全面リライト。①リードを左寄せ 18px に。②総合職セクションを「見出し（左）＋白カード（右）」の横並びレイアウトに（旧：見出し上・カード下の縦積み）。③初期配属を白カード無しのプレーンテキストに修正（Figma は note にカード無し）。④見出しの装飾を「平面シアン四角」→ Figma の 3D アイスキューブアイコン画像に差し替え。⑤見出しを `<p>` → `<h2>`（アクセシビリティ）。
  - [src/scss/object/project/_p-requirement.scss](../src/scss/object/project/_p-requirement.scss) — 全面リライト。カード=白・角丸 **12px**・影 `0 4px 4px rgba(0,0,0,.15)`・幅 800px 右寄せ（`flex` + `justify-content:space-between`）。テーブル行=`grid 210px 1fr`、区切り線 `1px solid #e4e9ec`、dt=Noto Bold 15px・dd=Noto 15px（共に `--color-text-primary`、旧実装の dt シアンは Figma 準拠で黒に修正）。見出し=Noto Bold 28px、リード/note=18px/行間2。コンテンツ帯 max-width 1300px。
- **アセット** ([../public/images/requirement/](../public/images/requirement/)): `icon-ice.png`（Figma node `485:1193` の ice キューブを 512→96px 2x 化）。ヒーローは `PageHero variant="cloud"`（`bg` 無し＝雲スカイ）で再現。当初 environment の `page-fv.png` を流用したが**建物写真**で誤りのため削除し cloud バリアントに変更。
- **テーブルデータ（Mynavi 最新反映済み）**: 当初指定の `corp2913/outline.html` は会社概要（2028卒の募集要項は無し）だったが、ユーザー追加提示の **`displayPrevEmployment`（前年度採用データ / 2025年4月実績）** `https://job.mynavi.jp/28/pc/corpinfo/displayPrevEmployment/index/?corpId=2913&recruitingCourseId=27044419` に募集要項全項目が掲載。比較の結果、諸手当・昇給・賞与・勤務地・勤務時間・年間休日・休日・待遇は Figma 値と**完全一致**、**初任給のみ差分**（Figma は 270,000円 単一→Mynavi は4区分: 修士了愛知270,000／学部卒愛知248,400／修士了島根240,100／学部卒島根219,900）。`generalRows` の初任給を `tiers[]`（対象＋月給）構造に変更し4区分＋「（2025年4月実績）」注記を表示。データ出典コメントを astro 冒頭に記載。
- **検証**: `npm run build` 14 ページ成功。`/requirement/` の `data-astro-cid=0`／インライン `<style>=0`／ルート絶対パス `=0`。静的サーバ（dist/ を `python3 -m http.server`）＋ Playwright 1440 幅で全体目視し Figma と一致＋初任給4区分の表示を確認。
- **TODO**: SP（モバイル）は `@media 960px`（カード縦積み）＋`600px` で暫定。Figma の SP デザイン確認後に再調整。
### 2026-05-28 セッション: インターンシップページ（/internship/）の Figma 忠実コーディング（v2 全面再実装）

- **着手範囲**: `/internship/`（Figma `446:5278`「09_internship」1600×8277、v2 を正版採用）を忠実に全面リライト。Footer は共通、Header はロゴのみ差し替え（白ロゴ `internship-logo.png`）、パンくずは共通構造で白文字。
- **コア機能（ユーザー要件）**: COURSE を **Swiper カルーセル**で表示。コースをタップすると色付き（`#cbfbff`＋`#00a0e9` ボーダー）になり、その下の **POINT→PROGRAM→募集要項→VOICES** が選択コース専用のタブコンテンツとして切り替わる。コースごとに 4 セクションを個別設定可能。
- **作成ファイル**:
  - [src/components/CourseCard.astro](../src/components/CourseCard.astro) — カルーセルのスライド（コース選択ボタン、`data-course-tab`）。
  - [src/components/CourseDetail.astro](../src/components/CourseDetail.astro) — 選択コースのタブパネル（ピル＋POINT〜VOICES、`data-course-panel`、`Course` 型を export）。
  - [src/components/InternshipHeading.astro](../src/components/InternshipHeading.astro) — ja 小＋en 特大（Barlow Condensed 100px）の見出し。
- **修正ファイル**:
  - [src/pages/internship.astro](../src/pages/internship.astro) — 全面リライト。`courses` データ配列（コース1＝Figma 実コンテンツ、コース2〜4＝仮文面）＋ ヒーロー／イントロ／COURSE カルーセル／コース詳細パネル群／MESSAGE。
  - [src/scss/object/project/_p-internship.scss](../src/scss/object/project/_p-internship.scss) — 全面リライト（`p-internship-*` / `p-course*` / `p-point` / `p-program` / `p-requirements` / `p-voices` / `p-internship-message`）。`clamp()` でフルイド対応。**注意**: 当初 `.p-message` を使い `_p-message.scss`（白背景）と衝突→白地に白文字で不可視化したため `.p-internship-message` に改名済み。
  - [public/js/main.js](../public/js/main.js) — `initInternship()` 追加（Swiper 初期化＋コードのタブ切替）。
  - [src/layouts/Layout.astro](../src/layouts/Layout.astro) — `<slot name="head" />` 追加（ページ個別の head 注入用）。
- **Swiper の扱い**: CDN ではなく `node_modules/swiper/swiper-bundle.min.{js,css}` を [public/js/](../public/js/) ／ [public/css/](../public/css/) に**ベンダリング**（FTP 納品でオフラインでも動くように）。internship ページの head slot で読込み。
- **アセット書き出し**: Figma Dev Mode MCP（`127.0.0.1:3845`、許可ディレクトリにプロジェクトルートを追加してもらい `get_design_context` の `dirForAssetWrites` で 2倍 PNG を取得）。[../public/images/internship/](../public/images/internship/) に配置（hero-collage-01〜03 / course-01〜04 / voice-01〜04 / penguin-hero / penguin-01〜03 / ice / point-bg）。旧 `p01〜p04.png`（未使用）は削除。
- **検証**: `npm run build` 14 ページ成功。`data-astro-cid=0`、`/internship/` のインライン `<style>=0`、ルート絶対パス `=0`、ハッシュ無し。dist を `python3 -m http.server` で配信し Chrome ヘッドレス（1440 幅／390 幅）で全セクション目視→ Figma と一致。Swiper の `swiper-initialized` 付与・先頭で prev ボタン disabled も確認。
- **未確認 / TODO**:
  - **コース 2〜4 の POINT/PROGRAM/募集要項/体験者の声は仮文面**（Figma 未デザイン）。クライアント入稿で差し替え。
  - 「冒険を始める ENTRY」ボタンの**外部リンク URL が未定**（現状 `href="#"`）。決定後に差し替え。
  - SP レイアウトは `@media 768px` で暫定。Figma の SP デザイン確認後に再調整。

### 既知の未完タスク（次エージェントが拾うべき優先課題）

1. **アセット入稿待ち（最優先）** — 全ページが画像参照を持つが、現状は多くがプレースホルダパス。Figma から書き出して各 `public/images/<page>/` 配下に配置する必要がある。詳細は [M6-A1](#m6-下層ページ実装) と各ページ仕様（[07-spec-subpages.md](./07-spec-subpages.md)）を参照。
   - 特に必須：`public/images/common/logo-hoshizaki.svg`（ヘッダーロゴ／不在時は CSS フォールバックの "HOSHIZAKI" テキストが表示される）。
2. **ブラウザ目視確認（M4-6 / M4-8）** — `npm run preview` で実機レイアウトを確認。アセット入稿後でないと意味のある検証にならない。
3. **クライアント仕様確認（M5-4 / M5-5 / M5-6 / M5-7）** — Footer の SPECIAL タイトル正式名称、Internship v1/v2 の正版、採用メッセージの写真方針、Strategy 飲食市場本文。
4. **Web フォントのローカル化（M2-F4）** — 現状 Google Fonts CDN。納品後にクライアント側で FTP 配置することを考慮し、必要なら `public/fonts/` へのセルフホスト切替を検討。
5. **JS 基盤（M2-S1〜S4）** — Lenis / GSAP / Swiper / Person フィルター。Astro `<script>` で読込み予定だが未着手。
6. **アニメーション（M3-A1〜A4）** — トップページの GSAP アニメーション。アセット入稿後に着手。
7. **共通化リファクタ候補** — `IceLinkButton.astro`（M2-C4）と `SpecialStoryCard.astro`（M2-C8）。現状は各ページの `.p-*` で個別実装。

### 開始時に走らせるコマンド

```sh
# 状態確認
npm run build                                    # 14 ページのビルドが通ることを確認
grep -r 'data-astro-cid' dist/ | wc -l           # 0 であること
grep -rE 'href="/|src="/' dist/ --include='*.html' | wc -l  # 0 であること
npm run preview                                  # http://localhost:4321 で目視

# 開発
npm run dev                                      # http://localhost:4321
npm run watch:scss                               # SCSS 変更の即時反映（dev 中の別ターミナル）
```

### ファイルインベントリ（2026-04-25 時点）

- **Astro ページ**：14 ファイル（[src/pages/](../src/pages/)、`about.astro` は Astro デフォルトの参考用で残置）
- **共通コンポーネント**：6 ファイル（[src/components/](../src/components/)。`Welcome.astro` は Astro デモ・残置）
- **SCSS**：foundation 3 + layout 5 + component 8 + project 14 = **30 partials**＋エントリ [style.scss](../src/scss/style.scss)
- **画像ディレクトリ**：[public/images/](../public/images/) 配下に 10 サブディレクトリ（common / environment / fact / job / message / person / requirement / special / strategy / top）。一部画像配置済み・大半は未配置。
