# 03. トップページ詳細スペック（`/`）

## Figma リファレンス

- **ファイル**：ホシザキ　本社採用
- **ページノード**：`296:7137`（レイヤー名：`00_top`）
- **URL**：[Figma を開く](https://www.figma.com/design/Q5PQirN5wGl9c1AqJJHZBt/%E3%83%9B%E3%82%B7%E3%82%B6%E3%82%AD%E3%80%80%E6%9C%AC%E7%A4%BE%E6%8E%A1%E7%94%A8?node-id=296-7137&m=dev)
- **キャンバス**：1600 × 9488 px（PC 向け縦長 1 ページ）
- **SP 版**：`431:1181`（`top_sp`, 402×4914）が並走。トップのみ SP 版あり。他ページの SP 版は未確認。

## 出力先

- Astro ファイル：[../src/pages/index.astro](../src/pages/index.astro)
- `basePath`：`"./"`（デフォルト）

## メッセージとトーン

- メインコピー：**「常識の先へ、跳べ。」**
- テーマモチーフ：氷・ペンギン・都市風景・青／白の寒色パレット
- 主要キーフレーズ：`PIONEER SPIRIT` / `What's HOSHIZAKI` / `Beyond HOSHIZAKI` / `Team HOSHIZAKI` / `SPECIAL CONTENTS` / フッターの大見出し `HOSHIZAKI`

## セクション構成

Figma の Y 座標順。スクリーンショット（画像1）と Figma `296:7137` を突き合わせて確定。

| # | セクション | 役割 | SCSS partial | クラス | 主な中身 |
|:--|:--|:--|:--|:--|:--|
| S1 | Hero | ファーストビュー：タグライン＋コンセプトムービー＋ペンギン＋都市風景 | `_p-hero.scss` | `.p-hero` | 見出し「常識の先へ、跳べ。」／飛ぶペンギン 4〜5 羽／CONCEPT MOVIE プレイヤー／本文導入コピー／「さぁ、その想いを翼に変えて。」／背景の都市＋雲＋氷山＋ペンギン群 |
| S2 | PIONEER SPIRIT（採用メッセージ） | ブランドメッセージへの導入 | `_p-pioneer-spirit.scss` | `.p-pioneer-spirit` | 見出し `PIONEER SPIRIT` ／サブ「採用メッセージ」／氷山に立つペンギンイラスト／IceLinkButton（`href="./message/"`, label「採用メッセージ」） |
| S3 | コーポレートナビ（What's / Beyond / Team） | 下層 3 ページへの導線 | `_p-corporate-nav.scss` | `.p-corporate-nav` | 中央：地球儀＋ペンギンの装飾／上「What's HOSHIZAKI」IceLinkButton（`./fact/`, label「キーワードで見る」）／左「Beyond HOSHIZAKI」IceLinkButton（`./strategy/`, label「ホシザキの海外展開」）／右「Team HOSHIZAKI」ペンギン群写真＋IceLinkButton（`./job/`, label「グループの役割」） |
| S4 | 先輩たちの「ここに決めた！」 | 社員インタビュー一覧への導線 | `_p-person-lead.scss` | `.p-person-lead` | 星型マスクの集合（中央に大きな星＋周囲に 4 枚の社員写真）／見出し「先輩たちの『ここに決めた！』」／IceLinkButton（`./person/`, label「はたらく人を知る」） |
| S5 | はたらく環境を知る | 環境ページへの導線 | `_p-top.scss` | `.p-top-env` | 横長オフィス写真（女性＋ペンギン群, `images/top/section-bg-environment.jpg`）／シアン帯（#00a0e9）の見出し「はたらく環境を知る」(56px 白)／白帯＋黒太字コピー「制度も環境も、妥協せずに整えてきました。」／IceLinkButton（`./environment/`, label「はたらく環境を知る」）。Figma 868:5243 |
| S6 | SPECIAL CONTENTS | 企画コンテンツ 3 本への導線 | `_p-special-contents.scss` | `.p-special-contents` | 大見出し `SPECIAL CONTENTS`（白抜き）＋クジラ／ペンギンシルエット背景／サブ「ホシザキではたらくリアル」／横長ダークカード × 3（クロストーク／プロジェクトストーリー／スペシャルトーク。各カードは背景写真＋ラベル＋見出し＋概要＋顔写真 avatar＋`READ MORE`） |
| S7 | Entry / Internship CTA | 共通 CTA ペア | 共通コンポーネント | — | Entry / Internship の 2 つの CTA バナー（[06-spec-common.md](./06-spec-common.md) の `EntryCta` / `InternshipCta` を使用） |

※ Header（最上部固定）／Footer（最下部）は全ページ共通。[06-spec-common.md](./06-spec-common.md) を参照。

## S1 Hero 詳細

### 要素

- **ナビ部（固定ヘッダー）**：`Header` コンポーネント。Hero の上に被せる／`position: fixed` 想定。詳細は [06-spec-common.md](./06-spec-common.md)。
- **タグライン**：`h1` で「常識の先へ、/ 先へ、/ 跳べ。」を 3 行に分けて表示（読点で改行）。フォントは太めのゴシック／サイズは Figma inspect で確定。
- **コンセプトムービー**：`<video>` タグ＋カスタム再生ボタン。ポスター画像（男性が写ったサムネイル）上に白い再生 ▶ アイコン。ラベル「CONCEPT MOVIE」を上に配置。
- **本文導入**：
  > ホシザキを、／厨房機器だけのメーカーと思っていないか。／国内のフードサービス機器でトップクラスのシェア。／でも、それだけではない。／世界50ヶ国以上に広がるネットワーク、／海外売上比率50%にも迫るグローバル企業、／食材ロス削減、環境負荷軽減、／そして医療や食品加工といった新分野への挑戦。／常識で思い込みに縛られない。／これからも、ホシザキは進化を止めない。／**さぁ、その想いを翼に変えて。**
- **飛ぶペンギン**：4〜5 羽（サイズ・角度違い）。
- **背景**：空グラデーション（水色〜薄ピンク）＋雲＋下部に都市のシルエット＋氷山。

### アセット

| 名前 | 形式 | 配置先 | 備考 |
|:--|:--|:--|:--|
| Hero 背景（空＋都市＋氷山） | JPG／PNG | `public/assets/hero-bg.jpg` | 1600 幅。都市部は明度を抑える |
| 飛ぶペンギン（透過） | PNG ×4〜5 | `public/assets/hero-penguin-01.png` 〜 `-05.png` | サイズ違い。`object-fit` と `z-index` で重ね順を調整 |
| コンセプトムービー | MP4 | `public/assets/concept-movie.mp4` | クライアント提供予定 |
| ムービーポスター | JPG | `public/assets/concept-movie-poster.jpg` | Figma の人物サムネイルを書き出し |

### アニメーション

- ページロード時にタグラインをフェードイン（GSAP、1.2 秒ディレイ 0〜0.8 秒）。
- ペンギンは `transform: translate` で微小浮遊（`keyframes` または GSAP `to` の無限 yoyo）。
- ムービー再生ボタンクリックで `<video controls>` 表示 or モーダル再生（要 UX 確認）。

## S2 PIONEER SPIRIT 詳細

### 要素

- 背景：薄青の傾斜セパレーター（Hero と次セクションの境目を斜めに切る三角形）。
- 装飾：氷山に立つペンギン 1 羽（PNG 透過）。
- 見出し：`PIONEER SPIRIT`（英字大見出し）＋サブ「採用メッセージ」。
- IceLinkButton 1 個（`./message/`）— label「採用メッセージ」／下に `READ MORE`。

### アセット

| 名前 | 形式 | 配置先 |
|:--|:--|:--|
| 氷山ペンギン | PNG（透過） | `public/assets/pioneer-penguin.png` |
| 傾斜青セパレーター | CSS で描画（グラデーション／`clip-path`） | — |

## S3 コーポレートナビ 詳細

### 要素

- 3 つの下層ページへの導線を「地球儀」を中心にしたレイアウトで配置。
- 中央：地球儀球体の中に 2 羽のペンギン（丸いビジュアル）。
- **What's HOSHIZAKI**（上）：大きな文字＋ペンギン写真＋IceLinkButton（label「キーワードで見る」）／href `./fact/`
- **Beyond HOSHIZAKI**（左）：大きな文字＋IceLinkButton（label「ホシザキの海外展開」）／href `./strategy/`
- **Team HOSHIZAKI**（右）：大きな文字＋ペンギン集団の写真＋IceLinkButton（label「グループの役割」）／href `./job/`
- 氷ブロックのイラスト（キューブ状）を各所に散りばめ、浮遊感を演出。

### アセット

| 名前 | 形式 | 配置先 |
|:--|:--|:--|
| 地球儀＋ペンギン | PNG | `public/assets/nav-globe.png` |
| Beyond 用ペンギン | PNG | `public/assets/nav-beyond-penguin.png` |
| Team 用ペンギン集団 | PNG | `public/assets/nav-team-penguins.png` |
| What's 用ペンギン | PNG | `public/assets/nav-whats-penguin.png` |
| 氷キューブ装飾 | PNG × 複数 | `public/assets/ice-cube-*.png` |

## S4 先輩たちの「ここに決めた！」 詳細

### 要素

- 大きな星型マスクに人物写真（4 名のビジネス人物、ひとりが前に出るように構成）。
- 小さな星型マスク × 3〜4（周囲に散りばめ）。
- 見出し「先輩たちの」＋手書き風の「ここに決めた！」（フキダシ風）。
- IceLinkButton（`./person/`, label「はたらく人を知る」）。

### アセット

| 名前 | 形式 | 配置先 |
|:--|:--|:--|
| 星型マスク画像 | JPG（星型 `clip-path` で切り抜き） | `public/assets/person-star-01.jpg` 〜 `-05.jpg` |
| 「ここに決めた！」手書き | SVG/PNG | `public/assets/person-headline-koko.png` |

## S5 はたらく環境を知る 詳細

### 要素

- フルブリードの背景写真（オフィスコリドール／スーツ女性＋ペンギン群）。ペンギンは写真に焼き込み済みで前景 PNG は不要。
- 写真の上に左寄せ（左 123/1600・上 153/660）で重ねる：シアン帯（`#00a0e9`）の見出し「はたらく環境を知る」（Noto Sans JP 56px / Regular / 白）＋その下にサブコピー「制度も環境も、妥協せずに整えてきました。」（白帯＋黒の太字 17px / Bold）。
- IceLinkButton（`./environment/`, label「はたらく環境を知る」）。サブから約 93px 下。
- 実装は `_p-top.scss` の `.p-top-env*`。固定アスペクト比 1600/660 を保ち、% 配置＋ vw サイズで全体を比例スケール（1600px で実寸一致）。≤960px で通常フローに切替。Figma 868:5243。

### アセット

| 名前 | 形式 | 配置先 |
|:--|:--|:--|
| 背景写真（女性＋ペンギン込み） | JPG | `public/images/top/section-bg-environment.jpg` |
| アイスリンクボタン背景 | PNG（透過） | `public/images/common/link-button-ice.png` |

## S6 SPECIAL CONTENTS 詳細

### 要素

- 背景：濃青＋クジラ／ペンギンのシルエット、数字／データビジュアル的装飾（技術感）。
- 大見出し `SPECIAL CONTENTS`（白抜き、左寄せ）。
- サブ「ホシザキではたらくリアル」。
- ダークカード × 3（上から）。各カードは：
  - 左側に小さなラベル（「クロストーク」「プロジェクトストーリー」「スペシャルトーク」）。
  - 中央に白文字の見出し（2 行）。
  - 下に概要コピー。
  - さらに下に出演者の丸 avatar（クロストーク 4 名／プロジェクトストーリー 2 名／スペシャルトーク 1 名）。
  - 右下に `READ MORE ▸`（黒 × 黄色の矢印アイコン）。
  - 背景は該当ストーリーの写真をぼかして使用。

### 各カードの href

カード内容は [`src/data/specialStories.ts`](../src/data/specialStories.ts) を正とし、共通コンポーネント [`SpecialContents.astro`](../src/components/SpecialContents.astro) がトップ S6 と `/special/` 索引で同じ UI を描画する（下表はデータの転記）。

| カード | 見出し | 概要 | href |
|:--|:--|:--|:--|
| 1 | 若手が語るはたらく環境 | 入社3年目社員に聞いてみた！会社のリアル | `./special/crosstalk/` |
| 2 | 互いの知恵を重ね、前例なきモノづくりへ。 | 設計×生産技術、職種を越えた共創 | `./special/project/` |
| 3 | ホシザキの技術、その未来とは？ | ホシザキの開発責任者による特別トーク | `./special/special-talk/` |

### アセット

| 名前 | 形式 | 配置先 |
|:--|:--|:--|
| 背景クジラ／ペンギンシルエット | PNG | `public/assets/special-bg-silhouette.png` |
| カード 1 背景（会議写真） | JPG | `public/assets/special-crosstalk-bg.jpg` |
| カード 2 背景（部品写真） | JPG | `public/assets/special-project-bg.jpg` |
| カード 3 背景（ロゴが見える機器） | JPG | `public/assets/special-talk-bg.jpg` |
| 出演者 avatar 丸（各カード分） | JPG × 多 | `public/assets/special-avatar-*.jpg` |

## S7 Entry / Internship CTA

[06-spec-common.md](./06-spec-common.md) の `EntryCta` / `InternshipCta` を使用。トップページでは `.p-entry-cta` ラッパーで左右並び（2 カラム）配置する。

## アニメーション要件（暫定）

| 対象 | 技術 | 期待挙動 |
|:--|:--|:--|
| ページ全体 | Lenis | スムーススクロール |
| S1 タグライン | GSAP | フェード＋Y シフト（in） |
| S1 ペンギン | GSAP（`y` yoyo 無限） | 微小浮遊 |
| S2〜S5 の IceLinkButton | GSAP ＋ CSS | スクロール進入でスライドイン／ホバーで浮遊 |
| S6 カード | GSAP ScrollTrigger | 各カードが順にフェード＋スライド |
| S3 氷キューブ装飾（`.p-top-trio__cube--1〜4`） | バニラ JS（`main.js` の `initParallax()`） | スクロール視差。`data-parallax` の係数（正＝奥／負＝手前）でキューブごとに速度・方向を変え奥行きを演出。**2026-06-10 実装済み** |

## 未解決事項（TODO）

- [ ] CONCEPT MOVIE の再生 UX（`<video controls>` かモーダルか）を確定。
- [ ] 傾斜青セパレーター（S1→S2）が `clip-path` か画像かを Figma で確定。
- [ ] S3 の 3 コーポレートナビの配置（グリッド／絶対配置）を Figma の座標から詳細化。
- [ ] S4 星型マスクの枚数と各画像のトリミング位置を Figma で確定。
- [ ] S6 出演者 avatar のソース画像（各 SPECIAL CONTENTS ページの avatar と同一か）を確認。
- [x] SP 版（`431:1181`）のレイアウト差分を追記。→ 下記「SP 版レイアウト」。**2026-06-12 実装済み**

## SP 版レイアウト（Figma `431:1181` top_sp, 402×4914 — 2026-06-12 実装）

PC と同じ「固定アスペクト比ステージ＋絶対配置(%)＋cqw」方式のまま、`@media (max-width: 960px)` で基準キャンバスを **402px** に切り替える（Figma px ÷ 4.02 = cqw）。どの端末幅でも見た目の比率は変わらない（320/390/768 で検証済み）。実装はすべて [_p-top.scss](../src/scss/object/project/_p-top.scss) の同メディアクエリ内。

| 帯 | Figma y | ステージ | PC との主な違い |
|:--|:--|:--|:--|
| S1 Hero | 0–1556 | 402×1556 | ペンギン 5 羽の個別配置 → **一枚画像 `top_penguins.png`**（431:1184 と同構図・既存アセット）。雲は `common/hero-cloud.png`（Group 2184）×2。空グラデは実測 `104.5deg #1081f4→#10aef4`。本文 15px/行送り36px。「さぁ、」(22.78px) は本文直下・CONCEPT MOVIE(30.9px) の上。都市は左右ブリードの全幅（x-21, w450.6）。ムービーは別トリミングのポスター `concept-movie-poster-sp.png`（`<picture>` で切替）＋黒49%オーバーレイ＋白輪郭円・白三角の再生ボタン |
| S2 PIONEER | 1556–1874 | 402×318 | 見出し 58.1px（Barlow Condensed Light。`BarlowCondensed-Light.woff2` を 2026-06-12 追加）・**#00a0e9**。イラストは `pioneer.png`（同構図・下端揃え全幅）、ボタンは左上 (22,1719) |
| S3+S4 Trio | 1874–3178 | 402×1304 | `Beyond HOSHIZAKI` → **「世界へ跳べ」**（Noto Light 42.1px）。筆文字 SVG → **テキスト 2 行**（17.2px/24.5px）。英字・テキストは全て **#00a0e9**（`--color-brand-cyan-deep`）。氷キューブは単体画像 `ice_cube_sp.png` ×7（ice 7/10/14/15/16/17/18）。背景に絹布テクスチャ `trio-bg-silk-sp.jpg`（431:4927、CSS グラデマスクで上端フェード近似） |
| S5 はたらく環境 | 3178–3694 | 402×516 | シアン帯タイトル(23.7px)は写真上の白地、白帯サブ(11.7px)は写真上端に重なる。写真 402×352（既存 jpg を `object-position: 68%` で切り出し）。ボタンは写真右下隅をまたぐ (273,3570) |
| S6 SPECIAL 以降 | 3694– | — | **未対応**。SpecialContents／BottomCta／Footer は従来の SP スタイルのまま（Figma SP は 280×150 の小型カード案。/special/ ページと共通コンポーネントのため、適用範囲をクライアント確認のうえ別タスクで対応） |

- アイスリンクボタンは Figma では PC コンポーネント 207×200 の **0.449 倍縮小インスタンス（93×90）**。ラベル 6.7px 相当（1.677cqw）＋下線、READ MORE 4.9px 相当。`.p-top` 配下の `--fluid` と env ボタンに適用。
- SP 専用 DOM（`__penguins-sp` / `__cloud--sp-l/r` / `__silk` / `__cube-sp` / `__ja-beyond` / `__decided-sp`）は PC で `display: none`、PC 専用要素（個別ペンギン・雲 3 つ・PC キューブ・`__en--beyond`・`__decided-lead/koko`）は SP で `display: none`。
