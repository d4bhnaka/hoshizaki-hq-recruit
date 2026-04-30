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
| S5 | はたらく環境を知る | 環境ページへの導線 | `_p-work-env-lead.scss` | `.p-work-env-lead` | 横長オフィス写真（女性＋ペンギン群）／見出し「はたらく環境を知る」／コピー「制度も環境も、安心して働ける様まで整えてきました。」／IceLinkButton（`./environment/`, label「はたらく環境を知る」） |
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

- 横長の背景写真（オフィスコリドール／スーツ女性＋ペンギン群）。
- 左寄せの見出し「はたらく環境を知る」＋サブコピー「制度も環境も、安心して働ける様まで整えてきました。」。
- IceLinkButton（`./environment/`, label「はたらく環境を知る」）。

### アセット

| 名前 | 形式 | 配置先 |
|:--|:--|:--|
| オフィス写真 | JPG | `public/assets/work-env-lead.jpg` |
| ペンギン群（前景） | PNG（透過） | `public/assets/work-env-penguins.png` |

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

| カード | 見出し | 概要 | href |
|:--|:--|:--|:--|
| 1 | 若手が語る／はたらく環境 | 入社3年目社員に聞いてみた！会社のリアル | `./special/crosstalk/` |
| 2 | 妥協なき、／食の未来への挑戦 | 開発若手社員×中堅先輩社員 | `./special/project/` |
| 3 | ホシザキの技術が／作る未来 | ホシザキの開発責任者による特別トーク | `./special/talk/` |

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

## 未解決事項（TODO）

- [ ] CONCEPT MOVIE の再生 UX（`<video controls>` かモーダルか）を確定。
- [ ] 傾斜青セパレーター（S1→S2）が `clip-path` か画像かを Figma で確定。
- [ ] S3 の 3 コーポレートナビの配置（グリッド／絶対配置）を Figma の座標から詳細化。
- [ ] S4 星型マスクの枚数と各画像のトリミング位置を Figma で確定。
- [ ] S6 出演者 avatar のソース画像（各 SPECIAL CONTENTS ページの avatar と同一か）を確認。
- [ ] SP 版（`431:1181`）のレイアウト差分を追記。
