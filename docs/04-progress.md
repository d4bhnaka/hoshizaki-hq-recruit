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
- [r] M2-F4 Web フォントをセルフホスト化（Google Fonts CDN 撤去）。**2026-06-09**：Barlow Condensed（8 ウェイト・フルセット）＋ Noto Sans JP（`unicode-range` 124 チャンク・可変フォント）を `public/fonts/` に woff2 配置し、`public/css/fonts.css` の `@font-face` を [`Layout.astro`](../src/layouts/Layout.astro) で読込。ソース・再生成手順は [`fonts/README.md`](../fonts/README.md)（`python3 fonts/regenerate.py`、変換はスキル `webfont-selfhost`）。トップで全 124 中 約30 チャンクのみ遅延読込・外部依存ゼロを検証済み。

### 共通コンポーネント（詳細は [06-spec-common.md](./06-spec-common.md)）

- [r] M2-C1 `Header.astro` ＋ `_l-header.scss`。Figma `361:538`。実装（2026-04-24）：ロゴ＋インターンシップ／応募はこちら CTA ＋ハンバーガー。
- [r] M2-C2 `Footer.astro` ＋ `_l-footer.scss`。Figma `360:179`。実装：4 カラム構成＋大型 HOSHIZAKI ワードマーク。
- [r] M2-C3 `Breadcrumb.astro` ＋ `_c-breadcrumb.scss`。Props: `basePath`, `items[]`（`.c-breadcrumb`）。
- [r] M2-C4 [`IceLinkButton.astro`](../src/components/IceLinkButton.astro) ＋ `_c-ice-link.scss`。Figma `365:16915`。**2026-06-11 コンポーネント化**：`.c-ice-link` スタイルを `_p-top.scss` から component 層へ移設し、トップ 6 個＋strategy 地図 7 個の直書きマークアップを差し替え（出力 HTML は実質同一）。Props: `href` / `label` / `sublabel?` / `basePath?` / `fluid?` / `lazy?` / `class?` ＋透過属性。
- [r] M2-C5 `BottomCta.astro` ＋ `_c-bottom-cta.scss`。INTERNSHIP + ENTRY 横並びバナーで M2-C5 統合版。
- [r] M2-C6 `PageHero.astro` ＋ `_c-page-hero.scss`。Props: `en`, `ja`, `variant`, `compact`, `align`, `bg`。
- [r] M2-C7 [`PersonCard.astro`](../src/components/PersonCard.astro) ＋ `_c-person-card.scss`（2026-04-25 にコンポーネント化）。`person.astro` から 14 回呼出し。Props: `image`, `quote`, `body`, `department`, `href?`。
- [r] M2-C8 SPECIAL CONTENTS の共通化。データは [`src/data/specialStories.ts`](../src/data/specialStories.ts)（3 件、`slug: crosstalk | project | special-talk`）。**2026-06-08 時点で見た目も [`SpecialContents.astro`](../src/components/SpecialContents.astro) ＋ `_p-special.scss` で共通化済み**：トップ S6 と `/special/` インデックスが同一のスタックカード UI を共有し、`basePath` / `storyBase` / `headingTag` プロップで差分を吸収する。当初の「見た目は意図的に非共通化」方針からコンポーネント共通化へ移行した。
- [r] M2-C9 新規 SCSS partial をすべて [style.scss](../src/scss/style.scss) に `@use` 登録。
- [r] M2-C10 ~~`SectionHeading.astro` ＋ `_c-section-heading.scss`（新規）。日本語＋英語セクション見出し。~~ **2026-06-19 に [`IceHeading`](../src/components/IceHeading.astro) へ統合し削除**（見出し共通化。C6 参照）。
- [r] M2-C11 `.c-interview-block` ＋ `_c-interview-block.scss`（新規）。Person 詳細・Special 各ページの Q+A ブロック。
- [r] M2-C12 `.c-stat-card` ＋ `_c-stat-card.scss`（新規）。Fact ページの数値カード。
- [r] M2-C13 [`SpecialContents.astro`](../src/components/SpecialContents.astro)（新規）。SPECIAL CONTENTS のヒーロー見出し＋スクロール連動スタックカード。トップ `/` と `/special/` で共有（M2-C8 の見た目共通化の実体）。
- [r] M2-C14 [`IceHeading.astro`](../src/components/IceHeading.astro) ＋ `_c-ice-heading.scss`（新規・2026-06-04）。アイスキューブ＋日本語28px＋巨大英字（Barlow Condensed 100px）の大見出し。**2026-06-19 以降、EN+JA セクション見出しはこのコンポーネントに一本化**（environment / job / strategy で共用。旧 `SectionHeading` は削除）。
- [r] M2-C15 [`OfficeTourCarousel.astro`](../src/components/OfficeTourCarousel.astro) ＋ `_c-office-tour.scss`（新規・2026-06-04）。中央スライド強調の Swiper カルーセル。environment の拠点紹介（豊明本社／島根工場）で再利用。
- [r] M2-C16 インターンシップ専用コンポーネント 3 種（2026-05-28）：[`CourseCard.astro`](../src/components/CourseCard.astro)（コース選択スライド）／[`CourseDetail.astro`](../src/components/CourseDetail.astro)（選択コースのタブパネル、`Course` 型を export）／[`InternshipHeading.astro`](../src/components/InternshipHeading.astro)（ja 小＋en 特大見出し）。

### スクリプト基盤

- [x] M2-S1 ~~Lenis のスムーススクロール初期化~~ → **不採用に確定（2026-06-19）**。納品制約（クライアントが生成物を手編集・FTP配布。重いランタイム依存を足さない）＋ユーザー確認により、Lenis は導入しない。スムーススクロールはブラウザ標準に委ねる（固定ヘッダー／ページ遷移シャッター／パララックスとの競合も回避）。
- [x] M2-S2 ~~GSAP の共通セットアップ~~ → **不採用に確定（2026-06-19）**。スクロール出現・パララックス・各種演出はすべて**素のバニラ CSS＋IntersectionObserver＋rAF**で実装済み（[`_u-inview.scss`](../src/scss/object/utility/_u-inview.scss) ＋ [`main.js`](../public/js/main.js) の `initInview` / `initHeroReveals` / `initParallax` / `initCountUp`）。GSAP/ScrollTrigger は既存バニラ実装と二重化し納品物に重い依存を持ち込むため導入しない。ユーザー確認済み（「素のJSで実装できるならそれに越したことはない」）。
- [ ] M2-S3 Swiper は使用セクションで個別初期化する方針を合意（共通化しない）。
- [r] M2-S4 Person 一覧のクライアントサイドフィルター。**実装済み**：`src/scripts/person-filter.ts` ではなく [`public/js/main.js`](../public/js/main.js) の `initPersonFilter()`（`data-person-tags` による 7 種絞り込み＋空状態トグル）。
- [r] M2-S5 全ページ共通のページ遷移アニメーション（斜めシアーシャッター）。**2026-06-09 実装**：[`public/js/main.js`](../public/js/main.js) の `initPageTransition()` ＋ [`_c-page-transition.scss`](../src/scss/object/component/_c-page-transition.scss)（[style.scss](../src/scss/style.scss) に `@use` 登録）、[Layout.astro](../src/layouts/Layout.astro) の `head` インラインガード＋`body` のシャッター/`.pt-page` ラッパー。参考サイト `~/Projects/sok-c.com/` の遷移を、納品制約に合わせ**バニラ CSS+JS** で移植。サイト内リンク遷移時にシアン2トーンの平行四辺形シャッターが左→右へスイープ（覆う→見せる）。詳細は下のセッションログ参照。

---

## M3. トップページ実装（`/`）

各セクションの **DoD（完了条件）** は [07-spec-subpages.md の「全ページ共通 DoD」](./07-spec-subpages.md#全ページ共通-dod) に統一。

### セクション（[03-spec-top-page.md](./03-spec-top-page.md) のセクション番号に対応）

- [r] M3-0 [src/pages/index.astro](../src/pages/index.astro) に Header／Footer 配置、ビルド成功確認（2026-04-24）。
- [r] M3-S1 Hero（`.p-top-hero`）— タグライン／ペンギン／コンセプトムービー／背景ビジュアル。**2026-06-05 全面再構築**：固定アスペクト比ステージ(1600×2562)＋絶対配置(%)＋`cqw` で Figma 座標に忠実化。都市は `bg-city` を下端フェード、ムービーは実ポスター(`concept-movie-poster.png`)。本文の誤字「さあ」→「さぁ」修正。**2026-06-10 背景修正**：`cloud01-03` は発明物ではなく Figma の雲グループ 3 つ（296:9053／296:10806／296:7300）の正確な 2x 書き出しと判明し、Figma 座標でスクリーン合成（80%）復元。空のグラデも実測の滑らかな斜めグラデ（135.93deg）へ修正（2026-06-05 の「撤去」「120.636deg」判断を訂正）。
- [r] M3-S2 PIONEER SPIRIT（`.p-top-pioneer`）— pioneer.png (1600×729) を帯背景に。**2026-06-05**：見出しを Barlow Condensed Thin 180px `#00a0e9`、サブ「採用メッセージ」40px に修正。
- [r] M3-S3 コーポレートナビ（`.p-top-trio`）— **2026-06-05**：S4 と統合し Figma 365:13388 帯(1600×2219)の 1 ステージに。EN ラベルを Barlow Condensed **ExtraLight** 120px `#00a0e9`・非斜体に修正（旧：italic＋誤色 #1ab4e5）。Google Fonts に weight 200 追加。
- [r] M3-S4 先輩たちの「ここに決めた！」— **2026-06-05** に S3 帯へ統合（`.p-top-trio__*--decided`）。「ここに決めた！」は Figma 筆文字を `koko-decided.svg`（#00A0E9）で再現。`.p-top-decided` は廃止。
- [r] M3-S5 はたらく環境を知る（`.p-top-env`）— section-bg-environment.jpg をフルブリードで配置。ネイビーピル見出し + アイスリンクボタン。
- [r] M3-S6 SPECIAL CONTENTS — **2026-06-08 に共通コンポーネント [`SpecialContents.astro`](../src/components/SpecialContents.astro) へ移行**（`/special/` インデックスとスタックカード UI を共有。`headingTag="h2"` でトップ用見出しに）。
- [r] M3-S7 Entry / Internship CTA（`BottomCta` コンポーネント）。

### アニメーション

- [r] M3-A1 Hero のタグライン／ムービーのフェードイン。**2026-06-19 バニラ実装**：タグライン／本文は `initHeroReveals` ＋ 白バー keyframe（既存）。CONCEPT MOVIE は絶対配置のため座標を動かさない `data-inview="fade"`（不透明度のみ）でフェードイン（[index.astro](../src/pages/index.astro)）。※ GSAP は不採用（M2-S2 参照）。
- [~] M3-A2 Hero のペンギン微小浮遊。**意図的に保留（2026-06-19）**：各羽の出現アニメ（`p-top-penguin-in-N`）は `both` で着地姿勢を保持しており、PC は rotate(0)・SP 版（`-sp`）は rotate(-17.96°/-5.99°）と着地角が異なる。浮遊を transform で重ねると着地角を壊す危険が高く、雲のドリフト強化で十分な空気感が出ているため見送り。実装する場合はラッパー要素を介して着地姿勢と分離すること。
- [r] M3-A3 IceLinkButton のスクロール進入演出。**2026-06-19 バニラ実装**：`IceLinkButton` 等のホバー transform を持つ要素は `data-inview="fade"`（不透明度のみ）でスクロール進入。トップ＋strategy 地図＋各下層ページで適用。
- [r] M3-A4 S6 カードの順次フェード。SPECIAL CONTENTS（[`SpecialContents.astro`](../src/components/SpecialContents.astro)）は既存の **`position: sticky` スタックスクロール演出＋ホバー（写真ズーム／矢印スライド）** で順次的に立ち上がるため、reveal は二重化回避で付与せず本タスクを充足とする。
- [r] M3-A5 S3 帯の装飾氷キューブ（`.p-top-trio__cube--1〜4`）のスクロール視差（パララックス）。**2026-06-10 実装**：[`public/js/main.js`](../public/js/main.js) の `initParallax()`（汎用 `[data-parallax]` 機構・バニラ JS）。属性値が速度係数（正＝スクロールより遅い＝奥、負＝速い＝手前。現値 `-0.18 / 0.14 / 0.1 / -0.24`）で、「ビューポート中央と要素基準中央の差分 × 係数」を `translate3d` で適用（中央で変位 0 のため Figma 配置座標は不変）。rAF スロットル＋`prefers-reduced-motion` で無効化＋resize/load で基準再計測。SP はキューブ自体が `display:none` のため対象外。CDP 実機検証で 4 キューブが係数どおりの速度・方向で移動することを確認。

### アセット配置

- [r] M3-A-1 トップページのアセットを [../public/images/top/](../public/images/top/) に配置（ap_01〜05 / cloud01〜03 / ice_cubes_01〜04 / bg-city / pioneer / top_penguins / section-bg-environment 等）。**2026-06-19：アセット入稿すべて完了**（不足分なし）。
- [x] M3-A-2 ヘッダーロゴは `hoshizaki-logo-mark-header.png`（マーク・配置済み）を使用。**2026-06-19 クライアント確認**：旧案の `logo-hoshizaki.svg` は不要。フッター下部の大型ワードマークは現状 CSS テキストのまま据え置き。
- [r] M3-A-3 共通バナー（`images/common/bnr_entry.png` / `bnr_internship.png` / `skelton-penguin.png`）配置済み。

---

## M4. 動作検証（トップページ時点）

- [r] M4-1 `npm run build` が警告なしで通る（**2026-06-08 時点 28 ページ**＝固定 13 ルート＋Person 詳細 15 ルート。旧 14 ページのうち Person 詳細 1 ルートを 15 名分の動的ルートへ拡張した結果。初回クリーンビルドは 2026-04-25 の 14 ページ）。
- [r] M4-2 `grep -r 'data-astro-cid' dist/` が 0 件。
- [r] M4-3 `grep -rE 'href="/|src="/' dist/ --include='*.html'` が 0 件。
- [r] M4-4 `dist/assets/` 内のファイル名にハッシュが付いていない。
- [r] M4-5 `head -30 dist/index.html` でインデントが保持されている。
- [~] M4-6 `dist/index.html` をブラウザで開き、PC 幅でレイアウト崩れがない。**2026-06-19：アセット入稿完了を受けてユーザーがブラウザ目視確認中**。
- [ ] M4-7 任意のサブディレクトリでもリンクが機能する。
- [~] M4-8 主要ブラウザ（Chrome／Safari／Edge）で目視チェック。**2026-06-19：ユーザーが目視確認中**。

---

## M5. 下層ページ仕様確定

- [r] M5-1 各ページの Figma node ID 記録（14 ページ）。
- [r] M5-2 [01-project-plan.md](./01-project-plan.md) のページ構成表を更新（14 行）。
- [r] M5-3 [06-spec-common.md](./06-spec-common.md) ＆ [07-spec-subpages.md](./07-spec-subpages.md) 作成。
- [ ] M5-4 Footer サイトマップの SPECIAL CONTENTS 3 タイトルの正式名称をクライアント確認。
- [r] M5-5 Internship v1 (`246:815`) と v2 (`446:5278`) の正版確認 → **v2 (`446:5278`) を正版として採用・忠実実装済み**（2026-05-28）。
- [r] M5-6 採用メッセージの「人の写真は使わない／採用ペンギン」の最終方針確認。**2026-06-05**：Figma `162:53` 確定版に基づき決着。人物写真は使わず、スーツ姿の採用ペンギン（`img01.png`）＋施設写真（ショールーム `img02.png`／厨房機器 `img03.png`）で実装。
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
- [r] M6b-P01 採用メッセージ `/message/`（node `162:53`）— [07 の 01 節](./07-spec-subpages.md#01-採用メッセージpioneer-spirit--message)。**2026-06-05** に Figma `162:53` 忠実コーディング＋実アセット書き出し済み（後述セッションログ参照）。
- [r] M6b-P02 What's HOSHIZAKI `/fact/`（node `238:6058`）— [07 の 02 節](./07-spec-subpages.md#02-whats-hoshizaki数字で見るホシザキ--fact)。2026-06-05 に Figma 忠実コーディング＋実アセット書き出し済み：ヒーローを job 同様の「左インデント＋右ブリード」写真帯に修正／成長セクションを 3 列ベント配置（短=261・中=314・高=589 のアスペクト比で列揃え）に再構築／淡色ウォーターマーク画像（王冠/月桂冠/日本地図/世界地図/製品/棒グラフ、Figma 指定 opacity 再現）／海外売上比率は conic-gradient 円グラフ／福利厚生4枚を上50:50・下33:67 グリッドに。アイコン16点を `public/images/fact/` へ書き出し。**2026-06-19 に数字カードを Figma 実測で忠実化**：ラベルを平行四辺形→**六角形**（`clip-path` で左右9.86px尖り・180×41・Noto Sans JP Bold 20px・#00A0E9）に修正／カード角丸22px＋影 `0 4px 5px rgba(0,0,0,.1)`／数字を DIN Condensed 実寸に合わせ Barlow Condensed 600 で再サイズ（1947=124・No.1=150・15=198(回57)・600=122・45.9=169(％72)・427=152・120・1,157=112／福利厚生は120, ％52, 単位 年40/時間月26, 女性男性30, 説明文18px）／円グラフ配色を #B9D7FF(海外)・#E1EDFF(国内) に修正／見出しを28px＋アイス氷アイコン左はみ出し配置／福利厚生カードを全4枚 358px 高さに統一（育児のペンギンは数字間に中央絶対配置）。CDP で実測一致を確認（成長カード 442×261/589/314・ラベル180×41・数字124px ピクセル一致）。
- [r] M6b-P03 Beyond HOSHIZAKI `/strategy/`（node `245:557`）— [07 の 03 節](./07-spec-subpages.md#03-beyond-hoshizaki事業領域海外展開--strategy)
- [r] M6b-P04 Team HOSHIZAKI `/job/`（node `245:287`）— [07 の 04 節](./07-spec-subpages.md#04-team-hoshizaki職種紹介--job)。2026-05-28 に Figma 忠実コーディング＋実アセット書き出し済み（後述セッションログ参照）。
- [r] M6b-P05 Person 一覧 `/person/`（**最新 node `836:2220`**／旧 `246:1055`）— [07 の 05 節](./07-spec-subpages.md#05-先輩たちのここに決めた一覧--person)。2026-06-04 に Figma `836:2220` 忠実コーディング＋実データ反映済み（後述セッションログ）。
- [r] M6b-P05s Person 詳細 `/person/[slug]/`（node `360:58`）— **動的ルートで 15 名分を静的生成**（[`src/pages/person/[slug].astro`](../src/pages/person/) ＋ [`src/data/personDetails.ts`](../src/data/personDetails.ts) の `getStaticPaths`、slug は `01`〜`15`）。一覧カードから `./01/`〜`./15/` へリンク済み。各ページは横幅いっぱいの固定背景写真（`p-bg-NN.jpg`）＋人物切り抜き（`pNN.png`）。[07 の 05s 節](./07-spec-subpages.md#05s-person-詳細--personslug)
- [r] M6b-P06 はたらく環境 `/environment/`（node `242:446`）— [07 の 06 節](./07-spec-subpages.md#06-はたらく環境environment--environment)。2026-06-04 に Figma 忠実コーディングへ全面再実装＋実アセット書き出し済み（後述セッションログ参照）。Office Tour は Swiper カルーセル。
- [r] M6b-P07 募集要項 `/requirement/`（node `242:71`）— [07 の 07 節](./07-spec-subpages.md#07-募集要項requirement--requirement)
- [r] M6b-P08 SPECIAL CONTENTS インデックス `/special/`（node `368:1401`）— [07 の 08 節](./07-spec-subpages.md#08-special-contents-インデックス--special)
- [r] M6b-P08-1 クロストーク `/special/crosstalk/`（node `246:935`）— [07 の 08-1 節](./07-spec-subpages.md#08-1-クロストーク--specialcrosstalk)
- [r] M6b-P08-2 プロジェクトストーリー `/special/project/`（node `393:1711`）— [07 の 08-2 節](./07-spec-subpages.md#08-2-プロジェクトストーリー--specialproject)
- [r] M6b-P08-3 スペシャルトーク `/special/special-talk/`（旧 node `393:1902` → 最新 `626:1473`／`856:2912`）— **ルート名は `special-talk`（`talk` ではない）**。[`src/pages/special/special-talk.astro`](../src/pages/special/special-talk.astro)。[07 の 08-3 節](./07-spec-subpages.md#08-3-スペシャルトーク--specialspecial-talk)

### アセット一括配置

- [ ] M6-A1 13 ページ分のアセットを Figma から書き出して [../public/images/<page>/](../public/images/) 配下へ配置（各ページ仕様書のアセット表に従う）。
- [r] M6-A2 Person 用 **15 名分**のカード写真を [../public/images/person/](../public/images/person/) に配置（`person01.jpg`〜`person15.jpg`）。Figma のプレースホルダー写真（人物切り抜き＋ぼかし背景の合成）を再現して書き出し。2026-06-04。**実社員写真の支給後に差し替え予定**。

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
  - `SectionHeading.astro`（`en` / `ja` / `note` / `id` / `align` / `size`）※2026-06-19 に [`IceHeading`](../src/components/IceHeading.astro) へ統合し削除
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

### 2026-06-05 セッション: 職種紹介ページ（/job/）の Figma 再忠実化（上記 05-28 のスタイルを刷新）

- **背景**: クライアント指摘で `/job/`（Figma `245:287`）が Figma と大きく乖離していたため再点検。Figma MCP（screenshot / metadata / design_context）で全ノードのジオメトリ・配色・タイポを実測し、現状とのピクセル差分を洗い出して修正。
- **ユーザー確認済みの判断**: ①ヒーローを Figma 通りに作り直す、②組織図コネクタを Figma の塗り矢印にする、③Figma の生の色値に厳密に合わせる（既存トークンと食い違う箇所）。
- **修正ファイル**:
  - [src/pages/job.astro](../src/pages/job.astro) — ①ヒーロー: `PageHero` の全面写真背景（`bg=page-fv.png`）をやめ、`variant="cloud"`（淡色＋線画ペンギン）＋スロットに枠付き写真 `.p-job__hero-visual`（page-fv 1283×430）を配置（docs J-1/J-2 準拠）。②セクション見出しを `align="center"` → `align="left"`。
  - [src/scss/object/project/_p-job.scss](../src/scss/object/project/_p-job.scss) — Figma 値で全面調整。
- **主な差分修正（Figma 準拠）**:
  - 見出し「Job」: 中央 40px → **左寄せ・clamp(56,6.5vw,100)px**（Barlow Condensed 400・色 `#1d2527`）、`職種紹介` は黒 28px Bold。見出しは max-width 1180px 中央寄せで左端 x≈210 に整列。
  - 組織図コネクタ: 角丸ピル＋三角 → **塗りつぶし矢印 `#77ADF1`＋白文字**（`clip-path`。連携=水平双方向矢印、サポート=上向き矢印。SP では連携を下向き矢印に切替）。
  - 組織図ボックス: 角丸 25→**32px**、影なし、上段 382×219 ×2＋下段 535、見出し clamp→**最大35px** シアン、項目ネイビー→**黒**。テクスチャ（diagram-bg）の白ベールを 0.5 に下げて facet を可視化。
  - グループラベル: 小さめ角丸ピル → **ベタ塗りシアン帯（角丸 2px）＋白 clamp(20,2.4vw,28)px**。
  - カード: 縦ティック `--color-brand-primary` → **`#0177fe`**（幅3px・角丸0）、本文/タイトル → **黒**、写真 320×角丸8 → **304×188・角丸18px**。先輩インタビュー導線: 下線/ホバー → `#0177fe`、丸アバター 56→**58px**、ラベル 18px。
- **検証**: `npm run dev`（:3381）＋ Playwright で 1600px 幅（Figma フレーム幅）にて hero / 組織図 / 各カードを要素・ビューポート単位で目視確認し Figma と一致。モバイル 390px でも組織図縦積み・カード縦積みが崩れないことを確認。※フルページ/大領域キャプチャ時に出る暗いブロックは Playwright のレンダリングアーティファクト（DOM スキャン・単一要素撮影では不在）で実バグではない。
- **CTA（INTERNSHIP/ENTRY）/ Footer / Header は焼き込み画像・共通コンポーネントで Figma と一致のため変更なし。**

### 2026-06-05 セッション: 共通カラーパレットの是正（基本5色＋2系統シアンの明確化）

- **背景**: クライアントより「サイト全体の共通基本カラーパレット」を提示（Figma `277:1337–1341`）。`_variables.scss` の値が一部誤りと指摘。
- **基本パレット（Figma 実測）**: primary `#0177fe`（277:1337）/ cyan `#00c8ff`（277:1338）/ ink `#1d2527`（277:1339）/ black `#000`（277:1340）/ page-bg `#d8e5e8`（277:1341）。HTML 背景=`#d8e5e8`、基本文字色=`#1d2527`。
- **修正（[_variables.scss](../src/scss/foundation/_variables.scss)）**:
  - `--color-brand-primary` `#0a69d9` → **`#0177fe`**
  - `--color-brand-cyan` `#00a0e9` → **`#00c8ff`**
  - **`--color-brand-cyan-deep: #00a0e9` を新設**（下記2系統シアン参照）
  - `--color-black: #000` を追加。`--color-text-primary #1d2527`・`--color-bg-page #d8e5e8` は既に正（body が参照）。
- **重要な発見＝2系統のシアン**: サイトには **`#00c8ff`（明るいブランドシアン＝基本パレット）** と **`#00a0e9`（濃いアクセントシアン）** が併存。後者は internship のアクセント/カード枠/グラデ停止、特集3ページ（crosstalk/project/talk）の members バッジ・kicker・タイトル影、strategy の飲食市場セグメント・バッジ・ピル、special 索引のヒーロー帯グラデ（#00a0e9→#005a83）、job の組織図見出し・グループラベル、top のタイトル帯 等で**Figma 実機照合により #00a0e9 と確認**（4サブエージェントで各ページ Figma を照合）。ユーザー判断で **2色を維持**（B案）。
  - 旧 `--color-brand-cyan`（=#00a0e9）を参照していた13箇所（job×2 / top / person×6 / person-detail / header / section-heading アイコン / entry-button グラデ / person-card / office-tour）を **`var(--color-brand-cyan-deep)` に付け替え**、#00a0e9 を復元。
  - 各ページに直書きの `#00a0e9`（internship/strategy/special/特集3）は Figma 通りで**正のため据え置き**（将来 deep トークンへ寄せる DRY 化は任意）。
- **job ページの追従**: tick/下線=`var(--color-brand-primary)`（#0177fe）、本文=`var(--color-text-primary)`（#1d2527）、組織図見出し・ラベル=`var(--color-brand-cyan-deep)`（#00a0e9）にトークン化。
- **検証**: `build:scss` 成功。Playwright で job 組織図見出し/ラベル `rgb(0,160,233)=#00a0e9`、top タイトル帯 `#00a0e9` を計算値で復元確認。top ヒーロー等も崩れなし。

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

### 2026-06-04 セッション: Strategy ページ「Global Pioneers」を Figma 836:2191 に差し替え

- **着手範囲**: `/strategy/` 末尾の **Global Pioneers** セクションを、新デザイン（Figma `836:2191`「海外駐在社員メッセージ」1600×2916）へ内容・レイアウトとも全面差し替え。見出しは `Life Beyond Borders` ＋ `国境を越えて、働く。暮らす。`、本文は 4 行イントロに更新。
- **構成**: 駐在員 3 人（フィリピン・マニラ／英国・テルフォード／米国・ジョージア州）を白カード（角丸 20px・上辺をまたぐ六角バッジ）で表示。各カードは「短い罫線＋見出し＋本文」のトピックを 3 つ持ち、一部トピックは右側に写真サムネイル（マニラ＝1 / テルフォード＝1 / ジョージア＝2、計 4 枚）。テキストは Figma `get_design_context` から正確に転記。
- **修正ファイル**:
  - [src/pages/strategy.astro](../src/pages/strategy.astro) — `pioneers` データ配列を `market`＋`topics[{heading, body, image?, alt?}]` 構造へ刷新し、マークアップを `p-strategy-pioneers__card / __badge / __topics / __topic(--media) / __topic-heading / __media` で再構成。
  - [src/scss/object/project/_p-strategy.scss](../src/scss/object/project/_p-strategy.scss) — Global Pioneers ブロックを全面書き換え（背景 `#d8e5e8`、見出し罫線 `#0177fe`、六角バッジは既存 `.p-strategy-market__badge` を流用）。旧 `__item/__avatar/__content` を撤去し、レスポンシブも追従。
- **画像**: Figma の各サムネイルは元写真をマスクで角丸クリップしているため、**元の長方形写真**を `get_design_context` で書き出し → `sips` で**角丸なし JPEG**（長辺 760px・品質 82）に変換して [../public/images/strategy/](../public/images/strategy/) に配置：`pioneer-manila.jpg`（ボラカイ）/ `pioneer-telford.jpg`（カナーヴォン城）/ `pioneer-georgia-01.jpg`（会食）/ `pioneer-georgia-02.jpg`（シカゴ川ポートレート）。**角丸は CSS（`border-radius` ＋ `overflow:hidden`）でクリップ**。旧プレースホルダ `pioneer-01〜03.jpg` は削除。
- **検証**: `npm run build` 14 ページ成功。`/strategy/` で `data-astro-cid=0`・インライン `<style>=0`・ルート絶対パス `=0`。dist を `python3 -m http.server` 配信＋Chrome ヘッドレス（CDP, 1280 幅 ×2）で当セクションを目視 → Figma と一致（バッジ／罫線／写真の角丸クリップ・配置とも OK）。※`loading="lazy"` のため、目視時はビューポートを縦長にして遅延読み込みを発火させてから撮影。

### 2026-06-04 セッション: Strategy ページ全体を Figma 245:557 に突き合わせ（地図アイスボタン追加）

- **着手範囲**: `/strategy/` 全体を最新 Figma `245:557`（03_strategy / 1600×**10271**）と突き合わせ。Hero／Intro／Business Field／市場カードのテキスト・構成は既に忠実だったため据え置き。Life Beyond Borders（別ノード `836:2191`）はユーザー確認済みで現状維持。
- **主な差分＝Global Market の世界地図**: Figma では各市場（ヨーロッパ／中国・香港／アメリカ／東南アジア／オセアニア／中米／南米）の位置に **アイスキューブ型「READ MORE」リンクボタン**（`LinkButtonIce`）が置かれ、その上にペンギンが立つ構成。現行はペンギンのみでボタンが欠落していたため、7 つのボタンを地図上の Figma 座標（map ノード 1405×773 基準の %）に追加。
  - 既存の共通コンポーネント **`.c-ice-link`**（top ページ流用、`images/common/link-button-ice.png`）を再利用し、地図用の縮小モディファイア **`.c-ice-link--map`** を `_p-strategy.scss` に追加（ラベル下線＋READ MORE、`clamp()` で小サイズ対応）。
  - **リンク先はユーザー選択により「下の該当市場カードへスクロール」**（同ページ内アンカー）。各市場カード `<li>` に `id`（`market-america` 等）を付与し、ボタンは `href="#…"`。`scroll-margin-top:96px` でヘッダー分を確保。
  - 地図が本文帯（1040px）より広い（Figma 1405px）ため、`.p-strategy-global__map` を `width:min(1404px,96vw)` で中央寄せブレイクアウト（`.p-strategy` の `overflow:hidden` で横スクロール無し）。ペンギンは `z-index:3` でボタンの上に。
- **修正ファイル**: [src/pages/strategy.astro](../src/pages/strategy.astro)（`globalMarkets` に `id`・`map{left,top}` 追加＋地図ボタン markup＋カード `id`）／[src/scss/object/project/_p-strategy.scss](../src/scss/object/project/_p-strategy.scss)（地図ブレイクアウト・`.c-ice-link--map`・`scroll-margin`）。新規アセットなし（既存 `link-button-ice.png` を流用）。
- **検証**: `npm run build` 14 ページ成功。`/strategy/` で `data-astro-cid=0`・インライン `<style>=0`・ルート絶対パス `=0`。`scrollWidth==clientWidth`（横溢れ無し）。CDP（1280幅×2）で地図を撮影 → 7 ボタン＋ペンギン＋中央バッジが Figma と一致。アンカー 7 本がカード `id` 7 件と全て対応。

### 2026-06-04 セッション: はたらく環境ページ（/environment/）の Figma 忠実コーディング（全面再実装）

- **着手範囲**: `/environment/`（Figma `242:446`「06_environment」1600×7360）を Figma に忠実へ全面再実装。旧実装はプレースホルダ（プラス型 SVG アイコン・HTML マトリクス・"PHOTO" 枠）だったため破棄し、`get_design_context` の正確なテキスト・配色で作り直し。ページ全体背景は **`#d8e5e8`** 一色、本文グレーは `#7c7c7c`。
- **ヒーロー**: strategy ページ同様 `PageHero variant="cloud"`（雲スカイ）＋スロットに本社外観の帯写真 `page-fv.png`（1283×430・角丸）を配置（`.p-env__fv`）。
- **新共通コンポーネント**: Figma の大見出し（アイスキューブ＋日本語28px＋巨大英字100px）はサイト既存の `SectionHeading`（英字40px・シアン菱形）と別系統のため、**`src/components/IceHeading.astro` ＋ `_c-ice-heading.scss`** を新設（`style.scss` に登録）。Training / Benefits / Office Tour の3見出しで再利用。アイスキューブは既存 `images/common/ice-01.png`。**※ユーザー確認済み：見出しは「Figma に忠実な大見出し」を採用。**
- **Training**: 研修体系図は Figma 上もフラット画像（`635:1380` image 27, 1830×752）だったため、**画像をそのまま書き出し** → `public/images/environment/training-system.png` に配置（クライアントは画像1枚を差し替えるだけ）。続く4制度カード（メンター／語学／社内検定／選抜型）は「左：アイスキューブ付き見出し＋本文／右：サムネイル（既存 `img01〜04.png` 309×179）」の横並び。
- **Benefits**: 白い円（`box-shadow`）＋ **Feather 系アイコンをインライン SVG で再現**（stroke `#2C82BB`：gift / award / pie-chart / trending-up / book / key / home / coffee の8種）の 4列×2行グリッド。テキストは Figma から正確転記。
- **Office Tour**: **Swiper カルーセル**（internship と同じ vendored `public/js|css/swiper-bundle.min.*` を `slot="head"` で読込、初期化は `public/js/main.js` の `initOfficeTour()` を追加し拠点ごとに生成）。拠点ラベルはシアン六角バッジ（`clip-path` で再現、`#00A0E9`）、ナビ矢印は `#00c8ff` の角丸ボタン。**愛知（本社）= 実写真11枚**（`office-tour/toyoake/t01〜t11.jpg`・各写真を目視して `本社外観/開発オフィス/執務スペース/製造ライン/社員食堂/ショールーム/企業ミュージアム/研修センター/独身寮/グラウンド/シンボルの城` とキャプション付与）。**島根工場 = 写真未提供のためグレーのプレースホルダ5枚（「準備中」）＋ astro 内に TODO コメント**（`office-tour/shimane/` に実写真を置いて差し替える指示）。※ユーザー確認済み。
- **修正/新規ファイル**: [src/pages/environment.astro](../src/pages/environment.astro)（全面書換）／[src/scss/object/project/_p-environment.scss](../src/scss/object/project/_p-environment.scss)（全面書換）／[src/components/IceHeading.astro](../src/components/IceHeading.astro)（新規）／[src/scss/object/component/_c-ice-heading.scss](../src/scss/object/component/_c-ice-heading.scss)（新規・`style.scss` 登録）／[public/js/main.js](../public/js/main.js)（`initOfficeTour()` 追加）／`public/images/environment/training-system.png`（新規・Figma 書き出し）。
- **検証**: `npm run build` 14 ページ成功。`/environment/` で `data-astro-cid=0`・インライン `<style>=0`・ルート絶対パス `=0`、Swiper CSS/JS と `main.js` は全て `../` 相対。dist を `python3 -m http.server` 配信＋Chrome ヘッドレス（1440 幅・390 幅）で全体を目視 → Figma と一致（ヒーロー／マトリクス／4カード／8アイコン／2拠点カルーセル＋島根プレースホルダ／CTA すべて OK）。レスポンシブも確認（Benefits 4→2列、Training カード縦積み、Office Swiper 1.15枚表示）。
- **既知の制約**: 研修体系図はフラット画像のため、モバイル幅では文字が小さくなる（Figma 仕様どおり。可読性が要件化したら HTML テーブル化を検討）。`img02`「語学研修制度」の本文は Figma が「資格取得補助制度を設けています」と記載しており、原文ママで忠実転記している。

### 2026-06-04 セッション: Office Tour の掲載順・キャプション・島根工場実写真を Figma 準拠へ更新

- **背景**: 拠点紹介カルーセルの順番・テキストの正は Figma 2フレーム（豊明本社 `666:1519` / 島根工場 `743:1676`）。旧実装の豊明本社はキャプションが目視推測（開発オフィス/執務スペース/独身寮/シンボルの城 等）で順序も Figma と不一致、島根工場は「準備中」プレースホルダ5枚だった。
- **豊明本社**: `office-tour/toyoake/t01〜t11.jpg` を **Figma の読み順（左→右・上→下）に一致**させ、ラベルを「愛知（本社）」→**「豊明本社」**に変更。キャプションを Figma 準拠に修正 → `本社外観 / 社員寮 / 研修センター / お城 / グラウンド / 中央研究所オフィス / 事務フロア / 工場 / 食堂 / ショールーム / 記念館`。t06/t07（中央研究所オフィス＝青デスク / 事務フロア＝明るい大部屋）は Figma 該当セルと写真を突き合わせて確定。t01〜t11 は元々 Figma 読み順で命名されていた。
- **島根工場**: クライアント提供の実写真12枚 `office-tour/unnan/u01〜u12.jpg`（1200×750）を配置し、プレースホルダ＋TODO コメントを撤去。Figma `743:1676` 準拠で順序・キャプション付与 → `社屋外観 ×3 / 事務フロア / 設計フロア / ショールーム / グラウンド / 工場内休憩スペース / 和室会議室 / 工場外観 / 薬師堂 / ふるさと尺の内公園（ホシザキグリーン財団）`。u04/u05（事務フロア / 設計フロア）も Figma セルと突き合わせて確定。雲南（unnan）は島根県の拠点。
- **変更ファイル**: [src/pages/environment.astro](../src/pages/environment.astro)（`offices` データ配列のみ。テンプレート/CSS は変更なし）。
- **検証**: `npm run build` 14 ページ成功。dist 出力で unnan 12枚を参照・コピー、Figma 全キャプションを確認、`準備中`=0、`data-astro-cid`/インライン `<style>`=0。Chrome ヘッドレス（1400 幅）で目視 → 両カルーセルが Figma の写真・キャプション・順序どおりに描画。
- **追補（同日）**: Office Tour カルーセルを**中央スライド強調＋コンポーネント化**に改修（ユーザー要望）。Figma ページ `242:446` の拠点紹介は **中央＝選択中スライドが両隣より一回り大きい**（中央 531×332／両隣 430×269＝約1.23×・両隣は中央に対し上下センタリング）構成。これを再現：
  - 新規 **`src/components/OfficeTourCarousel.astro`**（`label` / `photos` props）＋ **`src/scss/object/component/_c-office-tour.scss`**（`.c-office-tour`・`style.scss` 登録）を作成し、豊明本社／島根工場の 2 拠点で再利用。旧 `.p-env-office__*`（`_p-environment.scss`）は撤去。
  - Swiper（`public/js/main.js` `initOfficeTour()`）を `centeredSlides:true` / `loop:true` / `slideToClickedSlide:true` に変更。CSS で `.c-office-tour__slide{transform:scale(.81)}` ＋ `.swiper-slide-active{transform:scale(1)}` によりサイズ差のみで中央を強調（不透明度は Figma 準拠で落とさない）。キャプションは `text-align:center`。
  - 検証：`npm run build` 成功、`p-env-office` 残存=0、`data-astro-cid`/インライン `<style>`/ルート絶対パス=0。Chrome ヘッドレス（1440／390 幅）で中央拡大・中央揃えキャプション・両隣ピークを目視確認。
- **追補2（同日）**: スライダーが `.p-env__inner`（max 1160px）で途切れる点をユーザー指摘 → **`.c-office-tour__swiper` をフルブリード（ウィンドウ全幅）化**。`width:100vw; margin-inline:calc(50% - 50vw)` でコンテンツ列を飛び出し、ラベル／ナビ（`__head`）はコンテンツ幅のまま据え置き（Figma `242:446` どおり写真のみ全幅）。`--page-max-width:1600px` 超の超ワイドでは既存の `.p-env{overflow:hidden}`（%幅なので body 幅を超えない）がフレーム中央でクリップ＝横スクロールバーは発生しない。全幅化に合わせ Swiper の `slidesPerView` に 1280=3.0／1600=3.4 のブレークポイントを追加し、1枚が過大にならないよう調整。1280／1440／390 幅で目視確認済み。

### 2026-06-04 セッション: 雲ヒーロー（`.c-page-hero--cloud`）を Figma 忠実化（共通6ページ）

- **背景**: 下層ページのヒーローが Figma と不一致との指摘。旧 `.c-page-hero--cloud` は背景 `#eaf4fc` ＋汎用パフ雲 `top/cloud01.png`・`cloud02.png` で、実際の Figma（背景 `#d8e5e8` 一色＋右上のミスト雲を `mix-blend-screen`・不透明度80%で重ねる）と別物だった。
- **調査（ワークフロー並列調査）**: 6ページ（environment / requirement / strategy / job / person / fact）の Figma ヒーローを並列サブエージェントで突き合わせ → **雲ヒーローは全ページ完全共通**と判明（背景 `#d8e5e8`、右上のミスト雲 `imgGroup2184` を `mix-blend-screen`・opacity 0.8、英字136px Barlow Condensed `#1d2527`）。JA サブタイトルのみ environment が **30px**、他5ページは 24px。→ **ユーザー選択で共通コンポーネントを修正**（6ページ同時に忠実化）。
- **雲アセット**: Figma の雲は 1MB の複雑な SVG（`imgGroup2184`／暗いネイビー＋白のミスト）。Chrome ヘッドレスで**透過2x PNG**（2372×1172・約540KB）にラスタライズし [public/images/common/hero-cloud.png](../public/images/common/hero-cloud.png) に配置（全ページ共通アセットのため `common/`）。`mix-blend-screen` を CSS 側で適用するため、暗部は背景同色に沈み・明部（中央）が白いミストとして浮く（=Figma の見た目を再現）。
- **修正ファイル**:
  - [src/scss/object/component/_c-page-hero.scss](../src/scss/object/component/_c-page-hero.scss) — `.c-page-hero--cloud` を `background:#d8e5e8` のみに簡素化し、`::before` でミスト雲を右上配置（`left:49% / top:clamp(-20px,-1.4vw,0) / width:74% / aspect-ratio:1185/586 / mix-blend-mode:screen / opacity:.78`）。`.c-page-hero--ja-lg` 修飾子（JA 30px）も追加。`.c-page-hero` は既に `isolation:isolate` のためブレンドはヒーロー内に限定。
  - [src/components/PageHero.astro](../src/components/PageHero.astro) — `jaSize?: "md"|"lg"` プロップ追加（lg で `c-page-hero--ja-lg`）。
  - [src/pages/environment.astro](../src/pages/environment.astro) — ヒーローに `jaSize="lg"`（Figma 30px）。
  - [src/scss/object/project/_p-requirement.scss](../src/scss/object/project/_p-requirement.scss) — 旧 `.p-req .c-page-hero--cloud`（独自の cloud01.png 背景・PC/SP）を撤去し共通の雲に統一。
- **検証**: `npm run build` 14 ページ成功。6ページ全てで `data-astro-cid`/インライン `<style>`/ルート絶対パス=0。`_c-page-hero.scss` から cloud01/02・eaf4fc 参照が消えたことを確認。Chrome ヘッドレスで6ページのヒーローを撮影し、Figma 実レンダリング（`get_screenshot`）と同スケールで比較 → ミスト雲・背景・タイトルとも一致。雲の不透明度は分離テスト（Figma 座標で 0.8/0.65/0.5 を比較）で 0.78 に微調整。生成された Figma 書き出しのハッシュ名一時ファイル（リポジトリ直下・`public/images/` 直下、計87個）は全て削除済み（コード参照0件を確認）。
- **既知の制約**: 雲 SVG をラスタライズした 540KB PNG を全下層ページで読み込む（FTP 入稿前提で許容範囲）。元の `top/cloud01.png` `cloud02.png` は `_l-background.scss` 等が引き続き参照するため残置。

### 2026-06-04 セッション: Person 一覧（/person/）を Figma 836:2220 に忠実コーディング＋実データ反映

- **着手範囲**: `/person/`（最新 Figma `836:2220`「05_person」1600×3744）を忠実に再実装。旧実装はダミー文面＋thumb01-04 の使い回しだったため、`writing/sources/` の社員 15 名の実データを反映。
- **データ源**: [writing/sources/](../writing/sources/) の社員紹介 15 ファイル。各カードの見出し（「ここに決めた！」キャッチ）は Figma の各カードテキストと完全一致を確認して転記。表示順も Figma の並び（左上→右下／4 列、15 枚＝3 行 4 枚＋末尾行 3 枚）に一致。
- **ユーザー確認した 3 つの判断**:
  1. **カード写真** = Figma の写真を**合成再現**。Figma の写真はストック/AI 合成のプレースホルダー（人物切り抜き＋ぼかし背景）で、Dev Mode では平坦化 1 枚として書き出せず**レイヤー素材のみ**。人物切り抜きは透過 PNG なので、各カードの「人物（IM6_xxxx）＋可視背景（最上位シーン: Firefly 工場 / pixta シーン / 世界地図 等）」を Python(PIL) で合成し `person01.jpg`〜`person15.jpg`（608×376, JPEG q86）として書き出した。フレーミングは頭〜胸の head-and-shoulders で統一（`height_scale≈1.5`）。**実社員写真の支給後に差し替え予定**。
  2. **カテゴリタグ/絞り込み** = **Figma 通りに忠実**（先頭 10 名＝技術系／後半 5 名＝企画管理系）。実部署と一致しない人もいる（例: 加藤＝購買部・南＝情報システム部・山根＝生産管理部 などが技術系表示）が、デザイン忠実を優先。文理（science/humanities）は学部情報から、性別（male/female）はカード写真から判定し `data-person-tags` に付与（絞り込み 7 種に対応）。
  3. **カードのリンク先** = **リンクなし**（個別詳細ページ未確定のため）。`PersonCard.astro` を href 無指定時 `<article>`（非リンク）で描画するよう変更。Figma のシェブロンは視覚要素として残置。
- **修正/作成ファイル**:
  - [src/pages/person.astro](../src/pages/person.astro) — `people[]`（15 名: image/body/category/tags/name）に全面リライト。フィルタタブ＋4 列グリッド＋空状態メッセージ。
  - [src/components/PersonCard.astro](../src/components/PersonCard.astro) — href 省略時に非リンク（`<article>`）化。
  - [src/scss/object/component/_c-person-card.scss](../src/scss/object/component/_c-person-card.scss) — Figma 準拠（角丸 22px・写真角丸 14px・見出し `clamp(18px,1.5vw,24px)` Noto Bold・タグ 13px `#00a0e9`・底面アイステクスチャ）。
  - [src/scss/object/project/_p-person.scss](../src/scss/object/project/_p-person.scss) — 本文バンド `1332px`（Figma のカード帯 x129〜1461）中央寄せ、グリッド col-gap 20 / row-gap 36、ヒーロー背景に**ソフト白クラウド**（Figma `836:2221` のベクタ雲を `radial-gradient` で近似）。
  - [public/js/main.js](../public/js/main.js) — 既存 `initPersonFilter()` に空状態トグルを追加（フィルタ機能自体は既存実装が `data-person-*` と一致しており流用）。
  - [public/images/person/copy.png](../public/images/person/) — 既存はキャッチ文字（青）のみだったため、Figma `836:4217` の**白ハイライトボックス**（2 本）を PIL で焼き込み。
  - [public/images/person/card-ice.jpg](../public/images/person/) — Figma の低ポリ・アイステクスチャ（pixta_103410553）を 820px JPEG に最適化（1.7MB→64KB）。
- **アセット書き出し手順（次エージェント向けメモ）**: Figma Dev Mode MCP の `get_design_context` を各カード node（`837:45xx`）に対し `dirForAssetWrites=public/images/person/_figma/cNN` で実行 → レイヤー PNG（人物=透過, 背景=不透明シーン, ICE=8cd50d 共有）を取得。可視背景は「コード上で人物 div の直前の最上位シーン img」。`_figma/` 一時フォルダは合成後に削除（dist に同梱しない）。
- **検証**: `npm run build` 14 ページ成功。`/person/` で `data-astro-cid=0`・インライン `<style>=0`・ルート絶対パス `=0`・`dist/assets` ハッシュ無し・HTML 整形済み。dev サーバ（Playwright 1600 幅）で全体＋ヒーロー＋カードを目視 → Figma と一致。フィルタ「女性」クリックで該当 5 名（勝部/横山/河村/山羽/呉）のみ表示＝動作確認。Person 画像合計 552KB。
- **未確認 / TODO**:
  - カード写真は**プレースホルダー再現**。実社員写真の支給後に差し替え。
  - 文理/性別タグは学部情報・写真からの**推定**（山根は学部情報欠落のため理系と仮置き）。正式分類が必要なら要確認。
  - 個別詳細ページ（`/person/detail/`）の本実装・カードからの導線は別タスク（現状リンクなし）。
  - **注意**: 本セッション中に別プロセス由来の未追跡ファイル（`public/images/person/p01〜p15.png`・`crosstalk.*` の変更等）が混在。**本タスクの成果物ではない**ためコミット対象から除外すること。

### 2026-06-05 セッション: トップページ S1〜S4 を Figma 忠実へ全面再構築

- **着手範囲**: ユーザー指摘「ヒーローとその後のセクションがデザインと大幅にズレ」を受け、S1 Hero／S2 PIONEER SPIRIT／S3 コーポレートナビ／S4「ここに決めた！」を Figma `296:7137` の実座標で再構築（S5 環境以降は既に忠実なので非変更）。
- **手法（重要・今後の踏襲推奨）**: env セクションで実績のある「固定アスペクト比ステージ＋絶対配置(%)」を全面採用し、サイズは **コンテナクエリ単位 `cqw`**（`container-type: inline-size`、1cqw=ステージ幅1%、1600px時 16px=1cqw＝Figma px ÷16）でステージ幅に完全比例させた。位置 `left/top` は `figma座標 ÷ 1600`（x）/ `÷ ステージ高`（y）。各ステージ高: Hero 2562 / Pioneer 729 / Trio帯 2219。
- **主な是正点**:
  - Hero: 発明物の浮遊雲 `cloud01-03` を撤去（Figma に存在しない）。空は実グラデ `linear-gradient(120.636deg,#107af4 55.261%,#10aff4 55.261%)`、都市 `bg-city.png` を下端＋上端フェードで配置、ペンギン5羽(ap_01-05)を実座標に。CONCEPT MOVIE は実ポスター `concept-movie-poster.png`（Figma 743:1954 書き出し）。
  - 文言誤字 **「さあ」→「さぁ」**（小書きぁ、Figma 296:7299/12585）を修正。
  - S3+S4 を Figma 通り **1 帯に統合**。EN ラベルは Barlow Condensed **ExtraLight(200)** 120px `#00a0e9`・**非斜体**（旧実装は italic＋誤色 `#1ab4e5`）。`Layout.astro` の Google Fonts に weight **200** を追加。
  - 「ここに決めた！」は筆文字ベクター `koko-decided.svg`（Figma 470:1395、#00A0E9）で再現。
  - シアン見出しは全て `--color-brand-cyan #00a0e9`（Pioneer/Trio/先輩たちの）。
- **新規アセット**: [public/images/top/concept-movie-poster.png](../public/images/top/concept-movie-poster.png)、[public/images/top/koko-decided.svg](../public/images/top/koko-decided.svg)。既存 ap_01-05 / bg-city / pioneer / sec01-04 / ice_cubes は流用（dim が Figma rect と一致確認済み）。
- **検証**: `npm run build` クリーン（`data-astro-cid=0` / インライン`<style>=0` / ルート絶対パス=0 / ハッシュ無し）。`dist/` を静的配信し Chrome ヘッドレス 1600px でレンダ→ S1/S2/S3 を Figma スクショ・ユーザー支給デザインと目視照合し一致。さらに 4 エージェントの敵対的レビュー（幾何/タイポ/色アセット/ビジュアル）を実施し、全項目 PASS（幾何ズレ最大 0.05pp、文言・ウェイト・色すべて適合）。
- **未対応**: M3-A1〜A4 の GSAP アニメ（フェードイン/ペンギン浮遊/ScrollTrigger）は引き続き未実装。`src/pages/internship.astro:392` にも「さあ」表記が残るが別 Figma ノードのため本タスク対象外（要確認）。

### 2026-06-05 セッション: 採用メッセージ（/message/）を Figma 162:53 に忠実コーディング

- **着手範囲**: [/message/](../src/pages/message.astro) を Figma `162:53`（01_message, 1600×2804）に忠実再実装。旧実装はプレースホルダ（壊れた画像参照 `photo-01.jpg`/`page-fv.png`、キャプション色・雲/ペンギン位置が独自）だったため全面刷新。
- **ヒーロー**: 青空は横グラデ `linear-gradient(90deg,#107AF4,#10AFF4)` ＋下辺斜めカット（`clip-path: polygon(0 0,100% 0,100% 80.543%,0 100%)` = Figma `Rectangle2224` の `M0 0 H1600 V712 L0 884 Z`）。霧の雲は `images/common/hero-cloud.png` を `mix-blend-mode: screen` で2枚（Group2184/2185 座標）。飛ぶペンギン5羽・タイトル「常識の／先へ、／跳べ。」・キャプション「PIONEER SPIRIT」(Barlow Condensed 80px **白**)＋「採用メッセージ」(30px 白) を、トップと同じ「固定アスペクト比ステージ + 絶対配置(%) + cqw + clamp()」方式で配置。
- **本文**: 採用ペンギン（`img01.png`）＋導入文、続いて本文＋重なる2枚の施設写真（上=ショールーム `img02.png` / 下=厨房機器 `img03.png`、各 311×214 角丸）。可読性優先で最大幅コンテナ + clamp() のフロー/グリッド。背景は `--color-bg-page #d8e5e8`。**M5-6 決着**: 人物写真は使わず採用ペンギン＋施設写真で確定。
- **新規アセット**: Figma Dev Mode MCP（`162:53`）から書き出し、2倍 PNG にリサイズして [public/images/message/](../public/images/message/) に配置 — ペンギン `ap_01〜ap_05.png`（中央の大ペンギンは Figma 番号 ap_05）。アバター/写真 `img01〜img03.png` は既存流用（2倍寸法一致を確認）。雲はトップ等と共通の `common/hero-cloud.png` を流用。
- **検証**: `npm run build` クリーン（`data-astro-cid`=0 / インライン`<style>`=0 / ルート絶対パス=0 / 旧壊れ参照=0）。`dist/` を静的配信し Chrome ヘッドレス **1600 / 1280 / 390px** でレンダ→ユーザー支給 Figma スクショと目視照合し一致。レスポンシブは ≤960（本文を1カラム化・写真センタリング）／≤600（イントロ縦積み・ヒーローを縦長アスペクトに切替）で対応。
- **敵対的レビュー（5観点＋統合）で発見→修正した major 2件**:
  1. 雲がボディ三角部に黒ずんで漏れる不具合。原因はステージの `isolation:isolate` 配下で screen 合成の下地（ボディ `#d8e5e8`）が断たれ、雲PNG下部の濃い帯がそのまま表示されていた。`.p-message-hero__stage` に `background: var(--color-bg-page)` を付与し合成下地を確保→白い霧として馴染むよう修正。
  2. モバイル(≤600)でヒーロータイトルがヘッダーロゴと衝突。`aspect-ratio: 5/6` でヒーローを縦長化し、タイトル `top:28%`／キャプションを再配置して解消。
  その他の指摘（左 8.81% の丸め誤差、cqw の微小丸め、font-family の到達不能フォールバック等）は閾値内・意図的のため不変更。

### 2026-06-08 セッション: ドキュメントをコード実態へ同期（ドリフト解消）

- **背景**: 2026-06-05 以降のコミット（fact／message 再構築・Person 詳細の動的ルート化・footer メニュー更新・Person 一覧の全幅背景写真）の一部が docs に未反映で、進行管理が実態と乖離していた。コードを正としてドキュメントを突き合わせ更新。
- **コードで確認した実態（docs 反映済み）**:
  - **ビルド出力は 28 ルート**（旧 14）。固定 13 ルート＋**Person 詳細を動的ルート化**：[`src/pages/person/[slug].astro`](../src/pages/person/) ＋ [`src/data/personDetails.ts`](../src/data/personDetails.ts)（15 名・slug `01`〜`15`）で個別ページを `getStaticPaths` 生成。一覧カードは `./01/`〜`./15/` へリンク済み（[src/pages/person.astro](../src/pages/person.astro)）。各詳細は横幅いっぱいの固定背景写真（`p-bg-NN.jpg`）＋人物切り抜き（`pNN.png`）。→ M6b-P05s／M4-1 を更新。
  - **スペシャルトークのルート名は `/special/special-talk/`**（旧 docs の `/special/talk/` は誤り）。ファイルは [`src/pages/special/special-talk.astro`](../src/pages/special/special-talk.astro)、Figma 最新ノードは `626:1473`／`856:2912`（プロフィール＝佐々木 誠／執行役員 中央研究所所長）。→ M6b-P08-3／01／03／07 を更新。
  - **SPECIAL CONTENTS は [`SpecialContents.astro`](../src/components/SpecialContents.astro) で見た目も共通化**（トップ S6 と `/special/` インデックスが同一スタックカード UI を共有、`basePath`／`storyBase`／`headingTag` で差分吸収）。`specialStories.ts` の slug は `crosstalk`／`project`／`special-talk`。→ M2-C8／M2-C13／M3-S6 を更新。
  - **未登録だった共通コンポーネントを M2-C13〜C16 として追記**：SpecialContents／IceHeading（`_c-ice-heading.scss`）／OfficeTourCarousel（`_c-office-tour.scss`）／インターンシップ 3 種（CourseCard／CourseDetail／InternshipHeading）。
  - **Person フィルター（M2-S4）は実装済み**：`public/js/main.js` の `initPersonFilter()`（`src/scripts/person-filter.ts` ではない）。→ `[ ]`→`[r]`。
  - **`about.astro`／`Welcome.astro` は削除済み**（旧インベントリは「残置」と記載）。コンポーネント 13・SCSS 32 partial・画像 11 ディレクトリへインベントリを更新。
  - **footer メニュー更新**（コミット `2198952`／`7182299`）：[Footer.astro](../src/components/Footer.astro) は 採用 TOP／SPECIAL CONTENTS／About・Career の構成で、各下層・特集 3 本・外部企業サイトへリンク。スペシャルトークのリンクも `special/special-talk/`。
- **コード非変更**: 本セッションは docs のみ更新（`src/`／`public/` は変更なし）。`npm run build` は 28 ページでクリーン（`data-astro-cid`／ルート絶対パス／インライン `<style>` すべて 0）を確認済み。

### 2026-06-09 セッション: グローバルナビ（ドロワー）に現在地インジケーターを実装

- **着手範囲**: 共通 Header（[Header.astro](../src/components/Header.astro)）のドロワーメニューで、アイスキューブアイコンを「先頭固定（トップページ）」から **「現在表示中のページ」の項目先頭**へ移動（現在地インジケーター化）。ユーザー依頼。
- **判定ロジック**: `Astro.url.pathname` の先頭セグメントを `currentKey` とし、各リンクに付与した `key` と一致した項目にアイコン＋`aria-current="page"` を付与。`/` → トップ、`/person/03/` などの下層は先頭セグメント（`person`）で親項目「はたらく人を知る」に一致させる。ドロワー 8 項目に無いページ（special 索引・特集 3 本・internship）は現在地表示なし（自然な挙動）。
- **レイアウト修正（Figma 518:1195 準拠）**: Figma はナビが「アイコン用ガター（x=17, 47×46）＋ラベル列（x=81）」の 2 カラムで、**全ラベルが x=81 に揃う**。旧実装は「アイコンのある項目だけラベルが右へずれる」構造のため、アイコンを別項目へ移すとラベルがずれる問題があった（トップ項目だけ字下げされる既存の不整合も内包）。→ [_l-header.scss](../src/scss/layout/_l-header.scss) の `.l-drawer__panel` 左 padding 81→17、`.l-drawer__link-icon` を全項目で常時確保する 47×46 枠（中身＝画像は現在ページのみ）に変更し、gap 17 でラベルを x=81 に固定。モバイル（≤600）はガター縮小（左 14・アイコン 36・gap 12）。
- **変更ファイル**: [Header.astro](../src/components/Header.astro)（`currentKey` 判定＋`key` 付与＋テンプレート）／[_l-header.scss](../src/scss/layout/_l-header.scss)（2 カラム化）。
- **検証**: `npm run build` 28 ページ成功、`data-astro-cid`／ルート絶対パス=0。dev サーバで `/`・`/message/`・`/fact/`・`/person/`・`/person/03/` の `aria-current` が正しい項目に 1 個ずつ付くこと、internship は 0 個を確認。ドロワーを `data-open="true"` で強制描画した静的コピーを Chrome ヘッドレス（深さ 1=message／深さ 2=person 詳細）で撮影し、アイコンが現在ページのみ・全ラベル整列・深さ 2 でも画像読込 OK を目視確認。`aria-current` は 28 ページ中 23 ページ（メニュー 8 項目＋person 詳細 15、メニュー外 5 ページは無し）。
- **ドロワー挙動の確認（既存実装で完備）**: 右からスライドイン（0.36s cubic-bezier）／backdrop フェード（0.3s）／ハンバーガー→×（0.2s）／backdrop・閉じる・リンククリック・Esc で閉じる／body スクロールロック。[public/js/main.js](../public/js/main.js) の `initDrawer()`。
- **追加実装: ナビリンクの順次フェードイン（スタッガー）**（ユーザー選択）。ドロワー開扉時に 8 項目を上から順にフェードイン。手法は**依存の少ない CSS トランジション＋カスタムプロパティ**（GSAP は未セットアップ＝M2-S2／全ページに重い依存を足す割に過剰なため不採用。GSAP はトップの ScrollTrigger 系 M3-A で導入予定）。各 `<li>` に添字 `--i`（0〜7）を出力し、`.l-drawer[data-open="true"] .l-drawer__item` の `transition-delay: calc(0.12s + var(--i) * 0.05s)` でずらす。入場の transform は **li 側**に持たせ、リンク(a)のホバー `translateX` と競合させない。`prefers-reduced-motion: reduce` で入場アニメ無効（即時表示）。
  - **検証（凍結フレーム法）**: headless の CDP `Page.captureScreenshot` はアクティブな CSS 遷移でハングするため、出荷と同値・同イージングの keyframe を `animation-play-state: paused` ＋負の `animation-delay` で全体時刻 T に凍結し、CLI `--screenshot` で実フレームを描画。T=300ms／480ms で「上から順に出現する波」とアイコンが現在ページに留まることを目視確認。

### 2026-06-09 セッション: 全ページ共通のページ遷移アニメーション（斜めシアーシャッター）を実装

- **着手範囲**: 参考サイト `~/Projects/sok-c.com/`（Next.js + Framer Motion の `PageTransition.tsx`）の「左→右へ流れる平行四辺形シャッター」を、本サイト（Astro 静的 MPA）へ移植。全 14 ページ共通の [Layout.astro](../src/layouts/Layout.astro) に組み込み。ユーザー依頼。
- **ユーザー確定仕様**（`AskUserQuestion` で確認）: 配色＝**シアン2トーン**（背面 `--color-brand-cyan-deep` #00a0e9 ＋ 前面 `--color-brand-cyan` #00c8ff）／速さ＝**約0.9秒**（覆う 0.42s ＋ 見せる 0.42s）／再生タイミング＝**サイト内リンク遷移のみ**（直接アクセス・リロード・外部流入は即コンテンツ表示）。
- **方式選定（なぜ Astro ClientRouter ではなくバニラ CSS+JS か）**: 本リポジトリの納品制約（[02-environment.md](./02-environment.md)）＝クライアントが生成 HTML/CSS/JS を直接編集・ハッシュ無し・フレームワークランタイムを足さない、に従い、`astro:transitions` を使わず**素の CSS keyframe ＋ `main.js` の介入**で実装。リアルなハードナビゲーションをまたいで「覆う→見せる」を繋ぐ MPA 方式。
- **仕組み（覆う→見せるで 1 回の連続スイープ）**:
  1. サイト内リンククリック → `initPageTransition()` が `<html>` に `.pt-leave` 付与＋`sessionStorage["pt:enter"]="1"` セット → シャッターが画面外左から流れ込み**画面を覆う**（`pt-cover`）→ 背面パネルが覆い切った `animationend` で `window.location` 遷移。
  2. 遷移先では [Layout.astro](../src/layouts/Layout.astro) の `<head>` **インラインスクリプト**がフラグを*描画前に*読み `.pt-enter` を付与（フラッシュ防止：deferred な main.js では遅すぎる）→ シャッターが覆った状態から右へ抜けて**中身を見せる**（`pt-reveal`）＋ 本文 `.pt-page` が `opacity` でふわっと立ち上がる → reveal 完了で main.js が `.pt-enter` を除去。
- **見た目の作り**: シャッターは `position:fixed` の `.pt-shutter`（`overflow:hidden` で viewport にクリップ）内に **2 枚の 140vw パネル**を重ね、`clip-path: polygon(0 0, var(--pt-shear) 100%, 100% 100%, calc(100% - var(--pt-shear)) 0)` で平行四辺形に。前面を `--pt-stagger`(0.06s) 遅らせて 2 トーンの奥行き。被覆フレームの `translateX(-20vw)` で**シアー込みでも viewport を隙間なく全被覆**（幾何計算：W=140vw・shear=14vw で被覆位置 T∈[-26vw,-14vw]）。`z-index 9000`（サイト内最大 40 より上）。
- **堅牢性**: `prefers-reduced-motion: reduce` は CSS（keyframe を `@media (no-preference)` で囲む）＋ JS（リンク傍受せず通常遷移、head ガードも早期 return）の両方で無効化。BFCache 復帰は `pageshow.persisted` で `.pt-leave`/`.pt-enter` をリセット（覆ったまま戻らない）。リンク傍受は同一オリジン・非ハッシュ・修飾キー/中クリック無し・`target`/`download`/`data-no-transition` 除外・同一パス除外。速さ/傾き/色は `:root` のカスタムプロパティ、個別除外は `<a data-no-transition>`。
- **変更ファイル**: [_c-page-transition.scss](../src/scss/object/component/_c-page-transition.scss)（新規）／[style.scss](../src/scss/style.scss)（`@use` 登録）／[Layout.astro](../src/layouts/Layout.astro)（head ガード＋シャッター/ラッパー）／[public/js/main.js](../public/js/main.js)（`initPageTransition()` ＋ `init()` 集約）。
- **検証（Playwright 実機）**: ① cover 中間フレームを Web Animations API で凍結し斜めシアー2トーンの左→右スイープを目視。② **全被覆フレームで隙間ゼロ**（全隅シアン＝遷移瞬間にフラッシュ無し）。③ 実クリック flow＝`pt-leave`＋フラグ"1"→`/internship/` へ遷移→遷移先でフラグ消費（head ガード作動）→後始末まで完走。④ reduced-motion＝傍受せず通常遷移。⑤ 直接ロード＝シャッター無し・即表示。⑥ コンソールエラー 0。⑦ `npm run build` 成功、`dist/` 全ページに正しい相対パス（深さ 2 で `../../js/main.js`）でマークアップ出力、`js-beautify` 後も head インラインスクリプト健全。
- **マージ統合**: 本実装コミット（`b29dc25`）後、`origin/main`（コンセプトムービーのモーダル化＝`initMovieModal` ／ ドロワー現在地インジケーター）と乖離。`main.js`・`style.scss` のコンフリクトは**両方とも追加的で競合しないため両採用**（`init()` で `initPageTransition()` と `initMovieModal()` を併呼び、`style.scss` は `c-page-transition` と `c-movie-modal` を両方 `@use`）。マージ後 `npm run build` クリーン・`node --check` OK を確認。

### 2026-06-09 セッション: ヘッダーを全ページ固定（fixed）＋スクロールで背景ぼかし

- **着手範囲**: 共通 Header を**サイト全体で常に上部固定**へ変更（ユーザー依頼）。あわせて「200px 超スクロールで `backdrop-filter: blur(5px)`、それ以下は `blur(0)`、切替は `transition` でシームレス」を実装。背景色は付けずぼかしのみ（ユーザー指定）。
- **変更ファイル**: [_l-header.scss](../src/scss/layout/_l-header.scss)（`.l-header` を `position: absolute`→**`fixed`**。ぼかしは後述の理由で `.l-header::before` に分離）／[public/js/main.js](../public/js/main.js)（`initHeaderScroll()` 追加・両 init 分岐で呼出し）。
- **重要な CSS の落とし穴と対処**: `backdrop-filter`（blur(0) を含む非 none 値）を `.l-header` 本体に置くと、**その中にある `position: fixed` のドロワー（`.l-drawer`）の包含ブロックが `.l-header`（上部の細い帯）になり、全画面 backdrop／オーバーレイが壊れる**（CSS 仕様：filter/backdrop-filter は fixed 子孫の包含ブロックを生成）。→ ぼかしを**専用の `.l-header::before`（`position:absolute; inset:0; z-index:-1`）に分離**。ドロワーは `::before` の子ではないため包含ブロックは viewport のまま維持される。`.is-scrolled::before` で blur(5px)。transition は `--transition-base`（0.3s ease）。
- **JS**: `window.scrollY > 200` で `.l-header` に `is-scrolled` をトグル。`requestAnimationFrame` スロットル＋`{passive:true}`、初期化時にも `update()`（リロード時に既にスクロール済みでも正しい状態に）。
- **検証**: `npm run build` 28 ページ成功、`data-astro-cid`／ルート絶対パス=0、`node --check` で main.js 構文 OK。①**ドロワー回帰**: ドロワー強制オープンの静的コピーを Chrome ヘッドレス（CLI `--screenshot`）で撮影し、**backdrop が全画面・パネル全高**＝固定ヘッダー化で壊れていないことを確認。②**ぼかし**: `is-scrolled` を強制＋本文を translate でずらし、ヘッダー帯の背後コンテンツが blur(5px) でぼけること（OFF=鮮明 / ON=frosted）を比較確認。※ headless の CDP `Page.captureScreenshot` は本環境（Chrome 149）で恒常的にハングするため CLI `--screenshot` ＋静的状態注入で検証した。
- **補足**: 既存の未使用バリアント `.l-header--solid`（`position: sticky`）は据え置き（どのページからも参照なし）。アンカー遷移のヘッダー被りは strategy が既に `scroll-margin-top` で対応済み、他ページは同一ページ内アンカー無し。

### 2026-06-10 セッション: トップ KV の背景を Figma 忠実化（滑らかグラデ＋雲3つのスクリーン合成）

- **着手範囲**: ユーザー指摘「KV の背景（グラデ＋雲）がデザインと違う」。トップ S1 Hero の背景のみ修正。
- **判明した事実（2026-06-05 セッションの判断を 2 点訂正）**:
  1. **空のグラデはハード 2 トーンではない**。Figma の `get_design_context` は `linear-gradient(120.636deg, #107af4 55.261%, #10aff4 55.261%)`（両ストップ同位置＝ハード分割）を返すが、実レンダリングは**滑らかな斜めグラデ**。レンダ画像 2,572 点の最小二乗フィット（残差中央値 0.26）から平面を復元し、ステージ(1600×2562)用に `linear-gradient(135.93deg, #107af4 -12.8%, #10aff4 77.83%)` へ換算（CSS 換算誤差 0.0）。**codegen のグラデ出力は信用せずレンダ実測を正とする**。
  2. **`cloud01-03.png` は「発明物」ではなかった**。3 枚の寸法が Figma の雲グループ（cloud01=296:9053 Group 2286／cloud02=296:10806 Group 2188／cloud03=296:7300 Group 2184）のちょうど 2x と一致する正確な書き出し。スクリーン合成モデルでの照合誤差 2.5（≒AA ノイズ）で実証済み。
- **アルファ正規化**: 旧 PNG は書き出し時に**グループ不透明度 80% が焼き込み済み**（cloud01 の最大α=204=255×0.8）。CSS で `opacity:0.8` を掛けると二重に薄くなるため、**α×1.25 で「生の雲」に正規化**して上書き（Pillow、クリッピングなし）。以後この 3 枚は「素材=生、スタイル=CSS の screen＋0.8」が正。**Figma から再書き出しした場合は再度 ×1.25 が必要**な点に注意。
- **実装**: [index.astro](../src/pages/index.astro) に雲 3 つの `<img>` を追加、[_p-top.scss](../src/scss/object/project/_p-top.scss) の `.p-top-hero__cloud`（`mix-blend-mode:screen; opacity:0.8`、Figma 座標の %絶対配置）。z-order を Figma レイヤー順へ是正: 都市(1) < テキスト(3) < **雲(4)** < ムービー(5) < ペンギン(6)（ペンギン 2→6、ムービー 3→5）。SP(≤960px) は通常フローのため雲はペンギン同様 `display:none`。
- **検証**: `npm run build` 成功、`data-astro-cid`／インライン style／ルート絶対パス＝全 0。dist を http.server＋Chrome ヘッドレスで撮影し Figma レンダと領域別ピクセル照合 — 空 4 領域 mean 0.15〜0.84、雲ブレンド 3 領域 mean 0.39〜0.50、都市に重なる雲 mean 1.59（エッジの AA/スケーリング差のみ）。実質ピクセル一致。
- **補足**: `.l-page--clouds`（[_l-background.scss](../src/scss/layout/_l-background.scss)）は現在どのページからも未参照のデッド CSS だが cloud01/02 を参照しており、α正規化後はやや濃く見える（使用時は要調整）。
- **追補（同日・ユーザー指示）**: 雲に出現＋漂いアニメーションを追加。出現はゆっくりフェードイン（3.6s ease-out、左 0s／中央 0.5s／右 1s のスタッガー、`opacity 0 → 0.8`）。その後は `translate3d` の `alternate infinite` で自身サイズの 1〜2% をごくゆっくり往復（周期 26s／21s／17s と雲ごとに変えて非同期に見せる。往復なので必ず Figma 原点に戻る）。`prefers-reduced-motion: reduce` では両方無効＝最初から静止表示。実装はすべて `_p-top.scss`（`p-top-cloud-in` / `p-top-cloud-drift`）。

### 2026-06-11 セッション: IceLinkButton のコンポーネント化（M2-C4）

- **着手範囲**: アイスリンクボタン（Figma `365:16915` LinkButtonIce 207×200）の共通コンポーネント化。挙動・見た目の変更なしの純リファクタ。
- **新規ファイル**: [src/components/IceLinkButton.astro](../src/components/IceLinkButton.astro)（Props: `href`／`label`／`sublabel?`＝"READ MORE"／`basePath?`＝"./"／`fluid?`／`lazy?`／`class?`＋`data-inview`・`style`・`aria-label` 等の透過属性）／[src/scss/object/component/_c-ice-link.scss](../src/scss/object/component/_c-ice-link.scss)（`.c-ice-link` 一式を [_p-top.scss](../src/scss/object/project/_p-top.scss) から逐語移設、[style.scss](../src/scss/style.scss) に `@use` 登録）。
- **差し替え箇所**: [index.astro](../src/pages/index.astro) の 6 個（S2 Pioneer／S3 Trio×3／S4 ここに決めた！／S5 環境。fluid 版 5＋固定版 1）／[strategy.astro](../src/pages/strategy.astro) の世界地図 READ MORE 7 個（`class="c-ice-link--map p-strategy-global__map-link"` ＋ `lazy`）。
- **設計判断**: ①docs 旧案の `variant: 'light'|'dark'` は使用実態がないため廃止し、実在する修飾子に合わせ `fluid`（cqw 流体）をプロップ化。②strategy 専用の縮小版 `.c-ice-link--map` はページ固有のため [_p-strategy.scss](../src/scss/object/project/_p-strategy.scss) の project 層拡張のまま維持（`class` プロップで付与）。③カスケード順は不変（component 層→project 層の順で、従来の「`_p-top.scss` 内で先頭定義→ページクラスが後勝ち」と同じ優先関係）。
- **検証**: `npm run build` 28 ページ成功。ビルド前後の `dist/index.html`・`dist/strategy/index.html` を diff し、**差分はクラス順序の入れ替わりのみ**（index）と**装飾画像への `aria-hidden="true"` 付与のみ**（strategy。alt="" の装飾画像なので改善）。`data-astro-cid`／ルート絶対パス／インライン `<style>` すべて 0、`dist/css/style.css` に `.c-ice-link` 出力あり。
- **docs 同期**: [06-spec-common.md](./06-spec-common.md) C7 を「実装済み」に更新（テーブル行・本文・Props）。残タスクは「Team／Environment／Person ページでの使用有無を Figma で確認」のみ。

### 2026-06-11 セッション: strategy／environment の FV 画像を右寄せに統一

- **指示**: fact（数字で見る）／job（職種紹介）と同様に、strategy（事業戦略 `245:557`）／environment（はたらく環境 `242:446`）の FV 画像も右寄せにして Figma と共通化。
- **Figma 実測**（get_metadata）: strategy `687:1456` page-fv は **x=379, 1283×430**（job と同配置＝右端が 1600 枠外へ 62px ブリード）、environment `365:16909` page-fv は **x=317, 1283×430**（fact と同配置）。
- **実装**: [_p-strategy.scss](../src/scss/object/project/_p-strategy.scss)／[_p-environment.scss](../src/scss/object/project/_p-environment.scss) の FV を fact/job と同一パターンへ変更 — `margin: 44px 0 0 auto; width: min(1283px, 100%); margin-right: clamp(-126px, -8vw, 0px); aspect-ratio: 1283/430; border-radius: 20px; overflow: hidden;` ＋ img `object-fit: cover`。≤960px では job と同様 `margin-right: 0` でブリード解除。[strategy.astro](../src/pages/strategy.astro) の width 属性を job と同じ規約（Figma フレーム寸法 1283）に統一。
- **メモ**: job/strategy のアセットは 1221×430（= 1600 − x379。キャンバス内の可視域クロップ）だが、1283/430 ボックス＋cover で job と同一レンダリングになるためアセットは変更不要。
- **検証**: `npm run build` 成功、`data-astro-cid`／インライン style／ルート絶対パス＝全 0。dist を http.server＋Chrome ヘッドレス（1600px）で 4 ページ撮影し、FV 左端が全ページ **x=379** で一致することをピクセル走査で確認。

### 2026-06-12 セッション: トップページ SP レイアウトを Figma top_sp に忠実化

- **指示**: モバイル表示の崩れ（FV ペンギン消失／都市が全幅でない／PIONEER SPIRIT 見切れ／氷山イラストが全幅でない等）を Figma SP 版 `431:1181`（top_sp, 402×4914）どおりに修正。フォント・余白は cqw でコンテナ比率指定し、どの端末幅でも見た目を変えないこと。
- **実装**: [_p-top.scss](../src/scss/object/project/_p-top.scss) の `≤960px` ブロックを全面書き換え（旧・縦積み簡易レイアウトを廃止）。PC と同じ「固定アスペクト比ステージ＋絶対配置(%)＋cqw」方式で 402px 基準に切替。詳細は [03-spec-top-page.md](./03-spec-top-page.md) の「SP 版レイアウト」を参照。[index.astro](../src/pages/index.astro) に SP 専用要素（ペンギン群一枚画像／雲×2／絹布背景／単体キューブ×7／「世界へ跳べ」／「ここに決めた！」テキスト版／`<picture>` ポスター切替）を追加。
- **新規アセット**（すべて Figma 書き出し）: `top/concept-movie-poster-sp.png`（SP 用ポスター 2x）／`top/trio-bg-silk-sp.jpg`（絹布テクスチャ 2x）／`top/ice_cube_sp.png`（単体氷キューブ 2x）。既存の `top/top_penguins.png`（未使用だった SP ペンギン群）と `common/hero-cloud.png` を SP で活用。
- **SP の空グラデ実測**: `get_screenshot` ピクセルの最小二乗フィットで `linear-gradient(104.5deg, #1081f4 0%, #10aef4 100%)`（コード書き出しのハード 2 トーンは PC 同様に誤り）。
- **検証**: `npm run build` ＋ 禁止事項 grep 全 0。dist を http.server ＋ Chrome ヘッドレス CDP（`Emulation.setDeviceMetricsOverride`）で 320/390/768/1600px 撮影し、Figma レンダと 402px 等倍で並置比較（hero/pioneer/trio/env 一致、PC は無変更を確認）。**注意: ヘッドレス Chrome は `--window-size` 幅 500px 未満を無視するため、500px 未満の検証は CDP のデバイスエミュレーション必須**。
- **未対応・要確認**: SPECIAL CONTENTS 以降（SpecialContents／BottomCta／Footer）は共通コンポーネントのため未変更（Figma SP は 280×150 の小型カード案。クライアント確認待ち）。
- **同日追記（クライアント指示反映）**: ①PC の PIONEER 見出し／採用メッセージ／trio 英字／「先輩たちの」を `--color-brand-cyan-deep`(#00a0e9) に統一（Figma と一致。SP 側の重複指定は削除）。②**Barlow Condensed Light(300) を追加** — `fonts/src/BarlowCondensed-Light.ttf`（google/fonts ofl）を取得し woff2 化、`public/css/fonts.css` に @font-face 追記、SP の PIONEER 見出しを weight 300 に変更。`fonts/regenerate.py` も 9 ウェイト対応済みだが、**スキル `~/.claude/skills/webfont-selfhost` が現環境に無く再生成は不可**（今回の woff2 は fontTools+brotli で既存と同仕様＝フルTTF→woff2 変換を直接実施。既存 8 ウェイトとカバレッジ一致を確認済み）。

### 2026-06-19 セッション: サイト全体のインタラクティブアニメーション（全ページ・バニラ実装）

- **着手範囲**: ユーザー指示「サイト全体にインタラクティブなアニメーション（ポップでおしゃれに）」。**方針確認の結果、GSAP / Lenis は不採用とし、既存のバニラ基盤を全面拡張する方向に確定**（納品制約＝クライアントが生成物を手編集・FTP配布／重い依存を足さない。ユーザー明言「素のJSで実装できるならそれに越したことはない」）。M2-S1／M2-S2 を「不採用」、M3-A1／A3／A4 を実装済みに更新。
- **① スクロール出現（reveal）を全28ページへ展開**: 既存の `[data-inview]` 基盤（[`_u-inview.scss`](../src/scss/object/utility/_u-inview.scss) ＋ `main.js` の `initInview`）は従来トップのみだったが、下層13ページ＋共通コンポーネントに展開。バリアントを追加（`pop`＝拡大しながら出現／`left`・`right`＝横スライド／既存 `fade`）。**:hover で transform を使う要素（リンク／ボタン／静的 skew・rotate・translate を持つバッジや見出し）は必ず `fade`** にして変形リセットによる位置崩れを回避（並列実装の検証段で strategy バッジ・project/special-talk/internship のキッカー・見出しの transform 競合を検出・修正済み）。dist 集計: 既定264 / fade98 / pop36 / left31 / right1。
- **共通コンポーネントへ中央集約**: [`PageHero`](../src/components/PageHero.astro)・[`IceHeading`](../src/components/IceHeading.astro)（当時は小見出し `SectionHeading` も対象だったが後述の見出し共通化で削除）の見出しに stagger 付き reveal、[`BottomCta`](../src/components/BottomCta.astro) のバナーに `fade` reveal ＋ホバーズーム（[`_c-bottom-cta.scss`](../src/scss/object/component/_c-bottom-cta.scss)）。これで全ページのヒーロー／見出し／末尾 CTA が一貫して出現演出される。
- **② トップ背景雲を常時浮遊に強化**（[`_p-top.scss`](../src/scss/object/project/_p-top.scss)）: 旧 `from→to` の alternate 往復から、**4点を巡る閉ループ（0%==100% で必ず Figma 原点へ戻る）＋微小スケールの呼吸感**へ刷新。雲ごとに周期(19〜28s)・振幅(±2〜3%)・向きを変えて非同期。`prefers-reduced-motion` で静止。
- **③ 数値カウントアップ**: `main.js` に `initCountUp()` を新規実装（IntersectionObserver で進入時に 0→実値、カンマ・小数を復元、easeOutCubic、低モーション/IO非対応では実値即表示）。fact の主要統計13箇所に `data-countup` 付与（年号 `1947`・`No.1` は除外）。
- **その他**: M3-A1 ＝ CONCEPT MOVIE を `fade` でフェードイン（絶対配置のため座標不変）。M3-A2 ペンギン浮遊は着地姿勢（PC/SP で角度差）を壊す危険のため意図的保留。`logo-hoshizaki.svg` はクライアント確認で不要と確定し docs から撤去（実装は `hoshizaki-logo-mark-header.png`）。
- **実装手法**: 共通基盤（SCSS バリアント・コンポーネント reveal・雲・count-up JS・fact 属性）を先に手実装→ビルド検証。下層13ページの `data-inview` 付与は**ワークフロー（1エージェント=1ファイルの適用→別エージェントが規約遵守・JSX妥当性・transform競合を検証し小修正）で並列実行**。検証段が transform 競合4件を自動修正。
- **検証**: `npm run build` **28ページ クリーンビルド**。`data-astro-cid`＝0、ルート絶対パス＝0、インライン `<style>`＝0、ファイル名ハッシュ無し。全28ページに `[data-inview]` 出力、`inview-ready` ガード健全、fact に `data-countup`×13。`node --check public/js/main.js` OK。※ ブラウザ実機での目視（出現タイミング・カウントアップの体感）はアセット入稿後の `npm run preview` で要確認。

### 2026-06-19 セッション: EN+JA セクション見出しを共通コンポーネントへ一本化（`IceHeading`）

- **背景**: ユーザー指摘「事業領域（strategy）ページの見出しデザインが違う。英語＋日本語セットの見出しは職種紹介（job）の "Job" と同じにしたい。見出し専用の共通コンポーネント化＋他ページも共通化を」。調査の結果、job は小見出し `SectionHeading`（`c-section-heading`）を `.p-job` 側 CSS で大きく上書きして "Job" を約100px化していた（ただしアイコンは Figma のアイスキューブではなく**シアンの菱形のまま**で不忠実）。strategy は上書きなしの小見出しのまま＝両者が不一致だった。
- **対応**: Figma の大見出し（アイスキューブ＋太字和文＋特大 Barlow Condensed 英字）は既存 [`IceHeading`](../src/components/IceHeading.astro)（`_c-ice-heading.scss`、environment が使用）が正。**job・strategy をともに `IceHeading` へ移行**（strategy: Business Field／Global Market、job: Job）。`basePath` を渡してアイスキューブの相対パスを解決。
- **不要コードの削除**: 小見出し `SectionHeading.astro` ＋ `_c-section-heading.scss` を**削除**し `style.scss` の `@use` も撤去（移行後は未使用）。job の `.p-job .c-section-heading*` 上書き群は撤去し、幅可変セクション用の中央寄せ1行 `.p-job .c-ice-heading { max-width:1180px; margin-inline:auto }` のみ残置。
- **共通化しなかった見出し（意図的に別デザインのため据え置き）**: internship `InternshipHeading`（中央寄せ・青地に白・英字先頭 COURSE/MESSAGE・アイコン無し＝独立レイアウト）、strategy "Life Beyond Borders" `p-strategy-pioneers__heading`（英字先頭・アイコン無し）、fact `p-fact__heading`（和文のみ＋専用の大きめ `fact/heading-icon.png`・特大英字無し）。
- **検証**: `npm run build` 28ページ クリーンビルド。strategy／job の出力が `c-ice-heading`（`c-section-heading`＝0）、`ice-01.png` が `../images/common/` で解決、`style.css` から `c-section-heading` 消失。`data-astro-cid`／ルート絶対パス／インライン `<style>`（SVG内除く）＝0。ヘッドレス Chrome で strategy "Business Field"・job "Job" がアイスキューブ大見出しで描画されることを目視確認。

### 既知の未完タスク（次エージェントが拾うべき優先課題）

1. **アセット入稿待ち（最優先）** — 全ページが画像参照を持つが、現状は多くがプレースホルダパス。Figma から書き出して各 `public/images/<page>/` 配下に配置する必要がある。詳細は [M6-A1](#m6-下層ページ実装) と各ページ仕様（[07-spec-subpages.md](./07-spec-subpages.md)）を参照。
   - ヘッダーロゴは `public/images/common/hoshizaki-logo-mark-header.png` を使用（配置済み）。旧案の `logo-hoshizaki.svg` は **2026-06-19 にクライアント確認で不要と確定**。不在時は CSS フォールバックの "HOSHIZAKI" テキストが表示される。
2. **ブラウザ目視確認（M4-6 / M4-8）** — `npm run preview` で実機レイアウトを確認。アセット入稿後でないと意味のある検証にならない。
3. **クライアント仕様確認（M5-4 / M5-5 / M5-6 / M5-7）** — Footer の SPECIAL タイトル正式名称、Internship v1/v2 の正版、採用メッセージの写真方針、Strategy 飲食市場本文。
4. ~~**Web フォントのローカル化（M2-F4）**~~ — **2026-06-09 完了**。Google Fonts CDN を撤去しセルフホスト化（`public/fonts/` woff2 ＋ `public/css/fonts.css`）。詳細は M2-F4 ／ [`fonts/README.md`](../fonts/README.md)。
5. ~~**JS 基盤（M2-S1〜S2）** — Lenis / GSAP は未着手~~ → **2026-06-19 方針確定：Lenis / GSAP は不採用**（納品制約＋ユーザー確認。M2-S1／M2-S2 参照）。サイトのアニメーションはすべて素のバニラで実装。※ Swiper（M2-S3）は vendored（`public/js|css/swiper-bundle.min.*`）で internship／environment が個別初期化済み、Person フィルター（M2-S4）も `public/js/main.js` の `initPersonFilter()` で実装済み。実装済み挙動は `main.js` の `init()` に集約（`initDrawer` / `initHeaderScroll` / `initPersonFilter` / `initInternship` / `initOfficeTour` / `initPageTransition`〔M2-S5・全ページ遷移アニメ〕/ `initMovieModal` / `initInview` / `initHeroReveals` / `initParallax` / `initCountUp`）。
6. ~~**アニメーション（M3-A1〜A4）**~~ → **2026-06-19 バニラで実装完了**（M3-A1／A3／A4 ＝ `[r]`、M3-A2 ペンギン浮遊のみ意図的保留）。加えて**全28ページにスクロール出現（`[data-inview]`）を展開**、トップ背景雲を常時浮遊に強化、fact 統計に数値カウントアップを実装。詳細は下記 2026-06-19 セッションログ。
7. ~~**共通化リファクタ候補** — `IceLinkButton.astro`（M2-C4）~~ — **2026-06-11 完了**。`IceLinkButton.astro` ＋ `_c-ice-link.scss` に共通化（トップ 6 個＋strategy 地図 7 個）。※ SPECIAL CONTENTS は `SpecialContents.astro` で共通化済み（M2-C8／M2-C13 完了）。

### 開始時に走らせるコマンド

```sh
# 状態確認
npm run build                                    # 28 ページのビルドが通ることを確認
grep -r 'data-astro-cid' dist/ | wc -l           # 0 であること
grep -rE 'href="/|src="/' dist/ --include='*.html' | wc -l  # 0 であること
npm run preview                                  # http://localhost:4321 で目視

# 開発
npm run dev                                      # http://localhost:4321
npm run watch:scss                               # SCSS 変更の即時反映（dev 中の別ターミナル）
```

### ファイルインベントリ（2026-06-08 時点）

- **Astro ページ**：14 ファイル（[src/pages/](../src/pages/)）。うち [`person/[slug].astro`](../src/pages/person/) は動的ルートで 15 ページを生成するため**ビルド出力は 28 ルート**。`about.astro` は削除済み（Astro デフォルトの残置物だった）。
- **共通コンポーネント**：13 ファイル（[src/components/](../src/components/)）。`Welcome.astro` は削除済み。`SectionHeading.astro` は 2026-06-19 に `IceHeading` へ統合し削除。一覧：BottomCta / Breadcrumb / CourseCard / CourseDetail / Footer / Header / IceHeading / IceLinkButton / InternshipHeading / OfficeTourCarousel / PageHero / PersonCard / SpecialContents。
- **データモジュール**：[src/data/](../src/data/) に `personDetails.ts`（Person 詳細 15 名）／`specialStories.ts`（SPECIAL 3 本）。
- **SCSS**：foundation 3 + layout 5 + component 13 + project 14 + utility 1 = **36 partials**（2026-06-11 時点）＋エントリ [style.scss](../src/scss/style.scss)
- **画像ディレクトリ**：[public/images/](../public/images/) 配下に 11 サブディレクトリ（common / environment / fact / internship / job / message / person / requirement / special / strategy / top）。多くは Figma 書き出し済み・一部は実アセット入稿待ちのプレースホルダ。
