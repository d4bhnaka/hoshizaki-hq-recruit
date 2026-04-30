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
- [r] M3-S1 Hero（`.p-top-hero`）— タグライン／ペンギン／コンセプトムービー／背景ビジュアル。
- [r] M3-S2 PIONEER SPIRIT（`.p-top-pioneer`）— 採用メッセージ氷カード＋斜面背景。
- [r] M3-S3 コーポレートナビ（`.p-top-trio`）— What's / Beyond / Team の 3 ページ導線（階段状レイアウト）。
- [r] M3-S4 先輩たちの「ここに決めた！」（`.p-top-decided`）— 星型マスク＋人物写真。
- [r] M3-S5 はたらく環境を知る（`.p-top-env`）— オフィス写真＋ペンギン。
- [r] M3-S6 SPECIAL CONTENTS（`.p-top-special`）— ストーリーカード × 3。
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
- [ ] M5-5 Internship v1 (`246:815`) と v2 (`446:5278`) の正版確認。
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
- [ ] M6a-7 アセット（hero-bg / course-*.jpg / voice-*.png / logo-hoshizaki-white.svg 等）を Figma から書き出して [../public/images/](../public/images/) 配下に配置。
- [ ] M6a-8 Figma `446:5278`（v2）との見比べ＆差分修正（ヒーローのチーム写真 5 枚タイル／PROGRAM のペンギンイラスト等）。
- [ ] M6a-9 クライアント／ユーザーレビュー。

### M6b. その他 12 ページ（並列実装）

共通コンポーネント（M2-C1〜C9）が揃ってから着手。各ページの詳細仕様は [07-spec-subpages.md](./07-spec-subpages.md) の該当セクションを参照。

- [r] M6b-P00 トップ `/`（node `296:7137`）— 並列サブエージェント実装済み（2026-04-24）
- [r] M6b-P01 採用メッセージ `/message/`（node `162:53`）— [07 の 01 節](./07-spec-subpages.md#01-採用メッセージpioneer-spirit--message)
- [r] M6b-P02 What's HOSHIZAKI `/fact/`（node `238:6058`）— [07 の 02 節](./07-spec-subpages.md#02-whats-hoshizaki数字で見るホシザキ--fact)
- [r] M6b-P03 Beyond HOSHIZAKI `/strategy/`（node `245:557`）— [07 の 03 節](./07-spec-subpages.md#03-beyond-hoshizaki事業領域海外展開--strategy)
- [r] M6b-P04 Team HOSHIZAKI `/job/`（node `245:287`）— [07 の 04 節](./07-spec-subpages.md#04-team-hoshizaki職種紹介--job)
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
