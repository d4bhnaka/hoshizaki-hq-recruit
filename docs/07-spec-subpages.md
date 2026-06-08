# 07. 下層ページ仕様

13 本の下層ページを 1 ファイルに集約しています。共通構造は必ず先頭の「全ページ共通テンプレート」を読んでから、各ページ固有仕様に進んでください。

**実装状態（2026-04-25 時点）**：13 ページすべて `src/pages/*.astro` として先行実装済み（`[r]` レビュー待ち）。本ドキュメントは実装を反映した最新版。共通コンポーネントの命名は [06-spec-common.md](./06-spec-common.md) の表に従う（`PageHero` / `BottomCta` / `SectionHeading` / `Breadcrumb`）。

## 目次

- [全ページ共通テンプレート](#全ページ共通テンプレート)
- [01 採用メッセージ（PIONEER SPIRIT） `/message/`](#01-採用メッセージpioneer-spirit--message)
- [02 What's HOSHIZAKI（数字で見るホシザキ） `/fact/`](#02-whats-hoshizaki数字で見るホシザキ--fact)
- [03 Beyond HOSHIZAKI（事業領域／海外展開） `/strategy/`](#03-beyond-hoshizaki事業領域海外展開--strategy)
- [04 Team HOSHIZAKI（職種紹介） `/job/`](#04-team-hoshizaki職種紹介--job)
- [05 先輩たちの「ここに決めた」一覧 `/person/`](#05-先輩たちのここに決めた一覧--person)
- [05s Person 詳細 `/person/[slug]/`](#05s-person-詳細--personslug)
- [06 はたらく環境（Environment） `/environment/`](#06-はたらく環境environment--environment)
- [07 募集要項（Requirement） `/requirement/`](#07-募集要項requirement--requirement)
- [08 SPECIAL CONTENTS インデックス `/special/`](#08-special-contents-インデックス--special)
- [08-1 クロストーク `/special/crosstalk/`](#08-1-クロストーク--specialcrosstalk)
- [08-2 プロジェクトストーリー `/special/project/`](#08-2-プロジェクトストーリー--specialproject)
- [08-3 スペシャルトーク `/special/special-talk/`](#08-3-スペシャルトーク--specialspecial-talk)
- [09 インターンシップ `/internship/`](#09-インターンシップ--internship)

---

## 全ページ共通テンプレート

全下層ページは下記構造を基本とします（**インターンシップのみヒーロー部分が独自**）。

```astro
---
import Layout from "../layouts/Layout.astro";
import Header from "../components/Header.astro";
import Footer from "../components/Footer.astro";
import Breadcrumb from "../components/Breadcrumb.astro";
import BottomCta from "../components/BottomCta.astro";
import PageHero from "../components/PageHero.astro";
import SectionHeading from "../components/SectionHeading.astro";

const base = "../"; // 深さに応じて "../" or "../../"
---
<Layout basePath={base} title="..." description="...">
  <div class="l-container">
    <Header basePath={base} />
    <main class="l-main">
      <article class="p-<page-slug>">

        <PageHero en="..." ja="..." variant="cloud" />

        {/* === ページ固有セクション === */}
        <section class="p-<page-slug>__<section>">
          <SectionHeading en="..." ja="..." />
          ...
        </section>
        ...

        <BottomCta basePath={base} />

        <Breadcrumb basePath={base} items={[{ label: "<ページ名>" }]} />
      </article>
    </main>
    <Footer basePath={base} />
  </div>
</Layout>
```

### 全ページ共通 DoD

1. `data-astro-cid-*` が 0 件（`grep -r 'data-astro-cid' dist/` で検証）。
2. 参照パスは相対（`./` / `../`）。ルート絶対パス `href="/..."` は 0 件。
3. 新規 SCSS partial は [../src/scss/style.scss](../src/scss/style.scss) に `@use` 登録済み。
4. `BottomCta` と `Breadcrumb` が配置されている（独自レイアウトのページを除く）。
5. `PageHero` が独自ヒーローでないページで使用されている。
6. Astro のページファイルは `src/pages/<slug>.astro` に配置（Astro の `build.format: "directory"` が `<slug>/index.html` を出力）。サブディレクトリが必要な場合のみ `src/pages/<slug>/<child>.astro`。

### ページ固有クラスの命名（実装準拠）

| ページ | Astro ファイル | `.p-*` クラス | SCSS partial |
|:--|:--|:--|:--|
| `/` | `src/pages/index.astro` | `.p-top` | `_p-top.scss` |
| `/message/` | `src/pages/message.astro` | `.p-message` | `_p-message.scss` |
| `/fact/` | `src/pages/fact.astro` | `.p-fact` | `_p-fact.scss` |
| `/strategy/` | `src/pages/strategy.astro` | `.p-strategy` | `_p-strategy.scss` |
| `/job/` | `src/pages/job.astro` | `.p-job` | `_p-job.scss` |
| `/person/` | `src/pages/person.astro` | `.p-person` | `_p-person.scss` |
| `/person/[slug]/` | `src/pages/person/[slug].astro` | `.p-person-detail` | `_p-person-detail.scss` |
| `/environment/` | `src/pages/environment.astro` | `.p-environment` | `_p-environment.scss` |
| `/requirement/` | `src/pages/requirement.astro` | `.p-requirement` | `_p-requirement.scss` |
| `/special/` | `src/pages/special.astro` | `.p-special` | `_p-special.scss` |
| `/special/crosstalk/` | `src/pages/special/crosstalk.astro` | `.p-crosstalk` | `_p-crosstalk.scss` |
| `/special/project/` | `src/pages/special/project.astro` | `.p-project-story` | `_p-project-story.scss` |
| `/special/special-talk/` | `src/pages/special/special-talk.astro` | `.p-special-talk` | `_p-special-talk.scss` |
| `/internship/` | `src/pages/internship.astro` | `.p-internship` | `_p-internship.scss` |

> Person 詳細は **動的ルート `src/pages/person/[slug].astro` ＋ `src/data/personDetails.ts`（15 名・slug `01`〜`15`）** で実装されている（`getStaticPaths` で個別ページを静的生成。2026-06-08 時点）。
> SPECIAL CONTENTS 3 ストーリーの**索引・トップ用カード UI は `SpecialContents.astro` ＋ `specialStories.ts` で共通化済み**。ただし各ストーリー本文ページ（crosstalk／project／special-talk）は内容が異なるため **1 本ずつ別クラス／別 partial**（`_p-crosstalk.scss`／`_p-project-story.scss`／`_p-special-talk.scss`）のまま。

### アセット配置規則（全ページ共通）

**以下の記述で `public/assets/<page>-foo.jpg` とある箇所は、実装では `public/images/<page>/foo.jpg` を使っています**（[06-spec-common.md の「アセット配置の実態」](./06-spec-common.md#アセット配置の実態) 参照）。今後追加するアセットも `public/images/<page>/` 配下に置き、参照は相対パス `./images/<page>/foo.jpg` または `../images/<page>/foo.jpg` を使ってください。

---

## 01 採用メッセージ（PIONEER SPIRIT） — `/message/`

### Figma / 出力先

- node：`162:53`（1600×2804）
- Astro：`src/pages/message/index.astro`
- `basePath`：`"../"`

### セクション構成

| # | セクション | クラス | 主な中身 |
|:--|:--|:--|:--|
| M-1 | ヒーロー（斜め青＋ペンギン飛翔） | `.p-message__hero` | 青い斜面背景＋飛ぶペンギン数羽＋大コピー「常識の先へ、跳べ。」／`PageHeader` 代わりの独自ヘッダー（英字見出し `PIONEER SPIRIT` ＋サブ「採用メッセージ」は下部へ） |
| M-2 | 見出し帯 | `.p-message__header` | `PIONEER SPIRIT`（英字大）＋「採用メッセージ」（日本語サブ）。左寄せ |
| M-3 | 本文＋サブビジュアル | `.p-message__body` | 左：本文（4 段落の縦長テキスト、サンプル文言は [画像 2 参照]）／右：社員 3 人談笑写真＋厨房機器写真（上下 2 枚組）／**デザインメモ「人の写真は使わない／採用ペンギン」が Figma に付箋として残存**：最終デザインでは人物写真をペンギンイラストに差し替える予定の可能性あり → **実装前に確認** |
| M-4 | CTA ペア | — | `CtaBannerPair` |
| M-5 | パンくず | — | `採用TOP ▸ 採用メッセージ` |

### 本文サンプル（Figma 上のテキスト）

1 段落目：当社が求めるのは、どんなことにも積極的に取り組む姿勢です。任された仕事をただこなすのではなく、自分で考えたり工夫しながら取り組むことが自分の付加価値を高めることにつながります。次に、担当業務に限らず色々なことに興味を持ち学ぶ意欲。幅広い視野と知識を身に付ければ、自分の仕事の質を高めることができます。積極性と学ぶ意欲を持ち続けることで、多様なニーズに柔軟に対応できる提案力を身に付けることができます。

2 段落目：当社の良さは、役職や部署などの垣根がなくコミュニケーションがとりやすいこと。社内では肩書では呼ばず「さん」付けで呼びあっているほか、役員室がなく社員と経営層の間に壁もありません。性別・年齢・役職に関係なく様々な考え方を認め合う風土なので、誰とでも活発に意見交換できます。

3 段落目：企業を選ぶうえでは、自分自身の「感性」も大切です。企業の規模や知名度だけでなく、「そこで活躍している自分自身がイメージできるか」「何を大切にしている会社か」など目に見えない情報を感じとってください。そのためには、直接企業で働く社員と会える機会を積極的に活用し、知りたいことを遠慮なく聞いていただきたいと思います。

4 段落目：誰かにとってのいい会社ではなく、「あなたが自分らしく活躍できる会社」に出会えるよう、皆さんの就職活動の成功を心より応援しています。

### アセット

| 名前 | 形式 | 配置先 |
|:--|:--|:--|
| ヒーロー背景（空＋斜面） | CSS グラデ／SVG | — |
| ペンギン飛翔（透過） | PNG ×4〜5 | `public/assets/message-penguin-*.png` |
| 社員談笑写真（3 人コーヒー） | JPG | `public/assets/message-photo-01.jpg` |
| 厨房機器写真 | JPG | `public/assets/message-photo-02.jpg` |

---

## 02 What's HOSHIZAKI（数字で見るホシザキ） — `/fact/`

### Figma / 出力先

- node：`238:6058`（1600×4808）
- Astro：`src/pages/fact/index.astro`
- `basePath`：`"../"`

### セクション構成

| # | セクション | クラス | 主な中身 |
|:--|:--|:--|:--|
| F-1 | `PageHeader` | — | 英字 `What's HOSHIZAKI` ／サブ「数字で見るホシザキ」／薄青空背景 |
| F-2 | ヒーロービジュアル | `.p-fact__hero-visual` | 氷山に立つ 1 羽のペンギン（横長写真、幅いっぱい） |
| F-3 | 導入コピー | `.p-fact__intro` | 街中で見かける「ペンギンマーク」。その親しみやすさの裏側には、あなたの想像を超えるダイナミックな世界が広がっています…（※短い導入 2〜3 行） |
| F-4 | HOSHIZAKI の成長を知る | `.p-fact__growth` | 見出し「HOSHIZAKIの成長を知る」＋リード／数字カードグリッド（3 × 3 の 9 枚） |
| F-5 | 長く、自分らしく働く | `.p-fact__welfare` | 見出し「長く、自分らしく働く【環境・福利厚生】」／数字カードグリッド（2 × 2 の 4 枚） |
| F-6 | CTA ペア | — | `CtaBannerPair` |
| F-7 | パンくず | — | `採用TOP ▸ 数字とキーワードで見るホシザキ` |

### F-4 成長カードの内容（9 枚）

| ラベル | 数値 | 装飾 |
|:--|:--|:--|
| 歴史 | 創業 **1947** 年 | 時計アイコン |
| 業界シェア | 製氷機 国内シェア **No.1** | 王冠アイコン／製氷機写真 |
| 製品機種 | **600** 種以上 | 製品写真 |
| 受賞歴 | **15** 回 | メダルアイコン／G マーク |
| 売上高 | **4,858 億 9,000 万円**（連結）／「確かな技術力とサポート体制を武器に、持続的な成長を続けています。」 | 棒グラフアイコン |
| 海外売上比率 | **45.9%**（国内／海外の円グラフ）／「売上の約半分は海外から。真のグローバル企業として、海外市場のさらなる開拓を進めています。」 | 円グラフ |
| 社員数 | **1,157** 名（単体） | 人物アイコン |
| 国内ネットワーク | **427** ヶ所の営業拠点 | 日本地図 |
| グローバル展開 | 世界 **60** ヶ国以上のネットワーク | 世界地図 |

### F-5 福利厚生カード（4 枚）

| ラベル | 数値 | 補足文 |
|:--|:--|:--|
| 平均勤続年数 | **17.5** 年 | 社員が安心してキャリアを築ける環境があります。腰を据えて専門性を高め、長く活躍できるのがホシザキの強みです。 |
| 平均残業時間 | **13.1** 時間 / 月 | 効率的な働き方を推進。仕事の質を追求しながら、プライベートの時間も確保できる風土です。 |
| 有給休暇取得率 | **68.4%** | 「休むときはしっかり休む」リフレッシュを推奨し、オンとオフの切り替えを大切にしています。 |
| 育児休暇取得率 | 女性 **100%** ／男性 **51.9%** | ライフステージが変わっても、キャリアを諦める必要はありません。特に男性の取得率も上昇しており、互いにサポートし合う文化が根付いています。 |

### スタイル

- カードは白背景＋角丸（16〜20px）＋薄ブルーの枠／影。
- 数字は極太のゴシック（60〜80px）、青（`#005CFF` 近似）もしくは黒。
- ラベルは青いタブ状のバッジ。

### アセット

| 名前 | 形式 | 配置先 |
|:--|:--|:--|
| ヒーロー ペンギン氷山 | JPG | `public/assets/fact-hero.jpg` |
| 各数字カード装飾アイコン（時計／王冠／メダル／地図など） | SVG | `public/assets/fact-icon-*.svg` |
| 製氷機写真／製品サムネイル | PNG／JPG | `public/assets/fact-product-*.png` |

---

## 03 Beyond HOSHIZAKI（事業領域／海外展開） — `/strategy/`

### Figma / 出力先

- node：`245:557`（1600×8441）
- Astro：`src/pages/strategy/index.astro`
- `basePath`：`"../"`

### セクション構成

| # | セクション | クラス | 主な中身 |
|:--|:--|:--|:--|
| S-1 | `PageHeader` | — | 英字 `Beyond HOSHIZAKI` ／サブ「「厨房」という事業領域の、その先へ。」／薄青空背景 |
| S-2 | ヒーロービジュアル | `.p-strategy__hero-visual` | ペンギンが氷山をジャンプする横長写真 |
| S-3 | 問いかけ帯 | `.p-strategy__challenge` | 「ホシザキを厨房だけのメーカーだと思っていないか。」／右に「再検討」ボタン／下に導入文＋国内売上比率の円グラフ（飲食市場 58.9% / 飲食外市場 41.1%, 1,598 億円） |
| S-4 | Business Field | `.p-strategy__business` | 見出し `Business Field`／「事業領域」サブ／導入文／**飲食市場** サブセクション（詳細内訳。Figma は暫定的に空枠）／**飲食外市場** サブセクション（同） |
| S-5 | Global Market | `.p-strategy__global` | 見出し `Global Market`／「海外展開」サブ／「五大陸をつなぐ、世界No.1ブランドへ」／導入 3 段落／**世界地図**（地域ピン付き）／中央に「世界60ヶ国／40億人以上の食を支え／進化し続ける」数字バブル |
| S-6 | 地域別市場アコーディオン | `.p-strategy__region-list` | 7 つの地域カード（縦積み）：アメリカ／中東／南米／中国・香港／東南アジア／オセアニア／ヨーロッパ。各カードは見出し（青タブ）＋本文 |
| S-7 | Global Pioneers | `.p-strategy__pioneers` | 見出し `Global Pioneers`／「未知の海へ飛び込んだ、3 人のファーストペンギン。」／**3 つの社員インタビューカード**（東南アジア／中国・香港／ヨーロッパ）。各カードは左側社員写真＋右側 Lorem Ipsum 風テキスト |
| S-8 | CTA ペア | — | `CtaBannerPair` |
| S-9 | パンくず | — | `採用TOP ▸ ホシザキの海外展開` |

### S-3 円グラフの内訳

- 飲食市場：58.9%（飲食店、宿泊業、コンビニエンスストアなど）
- 飲食外市場：41.1%（商品売上高比率）
- 合計：1,598 億円（※単体）
- 円グラフ下：「飲食市場／飲食外市場の割合」

### S-6 地域カード本文（Figma 既存、一部サンプル）

- **アメリカ市場**：アメリカ市場で製氷機、業務用冷蔵庫、食器洗浄機、飲料ディスペンサーなどを展開。特に北米各地の顧客で圧倒的なシェアを持ち、レストラン、ホテル、コンビニエンスストアなどで使用されている。さらに、現地開発と現地生産のモデル制による顧客の多様なニーズに対応した製品開発や保守、全米に広がるネットワークと迅速な保守サービスにより、業界のリーダーとして確固たる地位を築いている。
- **中東市場**：メキシコ・パナマで業界用製氷機や飲料ディスペンサーを中心に展開。メキシコでは、炭酸飲料ディスペンサーをビールディスペンサーの専業生産し、飲食店やホテル、スタジアムなどに販売を推進。…
- **南米市場**／**中国・香港市場**／**東南アジア市場**／**オセアニア市場**／**ヨーロッパ市場** ＝ それぞれ 5〜10 行の本文（Figma 参照）。

### アセット

| 名前 | 形式 | 配置先 |
|:--|:--|:--|
| ヒーロー ペンギンジャンプ | JPG | `public/assets/strategy-hero.jpg` |
| 国内円グラフ | SVG 推奨（動的描画なら Chart.js／自前 SVG） | `public/assets/strategy-pie-domestic.svg` |
| 世界地図（地域ピン＋ポリゴン） | SVG | `public/assets/strategy-worldmap.svg` |
| ペンギン（世界地図周辺装飾） | PNG | `public/assets/strategy-penguins-*.png` |
| Global Pioneers 社員写真 ×3 | JPG | `public/assets/strategy-pioneer-*.jpg` |

### 注意

- Figma 上の「**飲食市場**」「**飲食外市場**」サブセクション本体（S-4 内）は空枠・未入稿の可能性。実装時には暫定のプレースホルダ文を入れるか、クライアントに本文入稿を依頼する（TODO）。

---

## 04 Team HOSHIZAKI（職種紹介） — `/job/`

### Figma / 出力先

- node：`245:287`（1600×6226）
- Astro：`src/pages/job/index.astro`
- `basePath`：`"../"`

### セクション構成

| # | セクション | クラス | 主な中身 |
|:--|:--|:--|:--|
| J-1 | `PageHeader` | — | 英字 `Team HOSHIZAKI` ／サブ「ホシザキの職種紹介」／薄青空背景 |
| J-2 | ヒーロービジュアル | `.p-job__hero-visual` | ペンギン集団（多数）＋氷山 |
| J-3 | 導入 | `.p-job__intro` | 「ホシザキグループは、最前線でお客様を支える『販売会社』と、グローバル戦略の司令塔である『ホシザキ株式会社（本社）』で構成されています。…部門を超えた連携『Team HOSHIZAKI』で、世界No.1の食のインフラ創りに挑む本社の職種をご紹介します。」 |
| J-4 | 職種紹介 / Job ダイアグラム | `.p-job__diagram` | 3 つのボックスフロー：**製品を生み出す**（開発・設計／生産管理・購買／生産技術／品質保証）／**製品を広める**（国内営業企画／海外事業企画）／**会社を管理・サポートする**（コーポレート（総務、経理、人事、他）／社内 SE）。ボックス間は矢印「連携」「サポート」で接続 |
| J-5 | 職種カード（前半） | `.p-job__cards-a` | 4 枚：開発設計職／生産技術職／品質保証職／購買・調達 |
| J-6 | 職種カード（後半） | `.p-job__cards-b` | 4 枚：国内広域営業・営業企画／海外事業企画・海外営業／コーポレート／社内 SE 職（IT 戦略） |
| J-7 | CTA ペア | — | `CtaBannerPair` |
| J-8 | パンくず | — | `採用TOP ▸ Team HOSHIZAKI` |

### 職種カード本文（Figma 既存）

| 職種 | 本文 |
|:--|:--|
| 開発設計職 | 世界No.1を目指す新製品のゼロイチ開発（機械・電気・制御ソフト・化学）。設計から評価まで「製品丸ごと」担当できる裁量の大きさと、環境対応（自然冷媒など）による社会課題の解決。 |
| 生産技術職 | 開発アイデアを「高品質かつ効率的に量産」するための製造ラインを構築。独自の多品種少量生産（セル生産方式）を支え、最新のロボティクスや IoT を駆使したスマートファクトリー化を牽引する。 |
| 品質保証職 | 世界60ヶ国で稼働する製品の安全性を担保する「最後の砦」。各国の厳しい安全規格・環境規制をクリアし、不具合の解析から開発へのフィードバックまで、ブランドの信頼を守り抜く。 |
| 購買・調達 | 国内外のサプライヤーから、最適な品質・コストの部品や素材を安定的に調達する。製造業の「利益の源泉」を担い、世界情勢を見極めながら強靭なサプライチェーンを構築する。 |
| 国内広域営業・営業企画 | 全国展開する大手飲食・小売チェーン「本部」へのソリューション提案、および全国の販売会社への販促支援。日本全国の市場動向を俯瞰し、億単位のダイナミックなビジネスを動かす。 |
| 海外事業企画・海外営業 | 海外 M&A の推進、海外拠点（米・欧・アジア）との経営連携、グローバル販売戦略の立案。異文化の市場特性を紐解き、ホシザキブランドを未開拓エリアのインフラへと育てる最前線。 |
| コーポレート（経営企画・財務・人事・知財など） | グローバル成長を裏方から支える経営基盤の強化、特許戦略による技術の保護。 |
| 社内 SE 職（IT 戦略） | 国内外のグループを繋ぐ基幹システム統合や、製品の IoT 化、社内 DX の推進。守りの社内インフラ保守にとどまらず、攻めの IT でホシザキのビジネスモデル自体を革新する。 |

### カードレイアウト

- 2 カラム：左側（見出し＋本文）／右側（正方形の社員写真、約 200×200px、角丸）。
- 背景：白／薄青のグラデ／角丸 16px。

### アセット

| 名前 | 形式 | 配置先 |
|:--|:--|:--|
| ヒーロー ペンギン集団 | JPG | `public/assets/job-hero.jpg` |
| ダイアグラム用アイコン（矢印など） | SVG | `public/assets/job-diagram-*.svg` |
| 職種カード写真 ×8 | JPG | `public/assets/job-card-dev.jpg` 他 |

---

## 05 先輩たちの「ここに決めた」一覧 — `/person/`

### Figma / 出力先

- node：`246:1055`（1600×3744）
- Astro：`src/pages/person/index.astro`
- `basePath`：`"../"`

### セクション構成

| # | セクション | クラス | 主な中身 |
|:--|:--|:--|:--|
| P-1 | `PageHeader`（白背景版） | — | 英字 `Person` ／サブ「はたらく人を知る」＋さらに手書き風の「先輩たちの『ここに決めた！』」（青ラインのフキダシ風） |
| P-2 | フィルター | `.p-person-list__filter` | 青ボタン × 6：すべて／技術系／企画管理系／理系／文系／男性／女性 |
| P-3 | カードグリッド | `.p-person-list__grid` | 4 列 × 4 行（14 枚）。各カードは `PersonCard`（`src/components/PersonCard.astro`、Figma symbol `365:655` 由来） |
| P-4 | CTA ペア | — | `CtaBannerPair` |
| P-5 | パンくず | — | `採用TOP ▸ はたらく人を知る` |

### PersonCard の構造

```astro
---
interface Props {
  href: string;
  photo: string;
  title: string;
  dept: string;
  highlightPhoto?: string;  // 手書きメッセージボードを手に持つ写真（一部のカードのみ）
}
const { href, photo, title, dept, highlightPhoto } = Astro.props;
---
<a class="c-person-card" href={href}>
  <figure class="c-person-card__photo">
    <img src={photo} alt="" />
    {highlightPhoto && <img src={highlightPhoto} class="c-person-card__ribbon" alt="" />}
  </figure>
  <div class="c-person-card__body">
    <h3 class="c-person-card__title">{title}</h3>
    <p class="c-person-card__dept">{dept}</p>
    <span class="c-person-card__arrow">▸</span>
  </div>
</a>
```

- カードサイズ：318 × 431（Figma master）。
- 上部が人物写真（一部はフキダシ風のメッセージを持つ）、下部が見出し＋部署＋矢印。
- 角丸・薄青背景。

### フィルター実装

- クライアントサイド JS で `data-tag` 属性をフィルター（純 JS、1 ファイル `src/scripts/person-filter.ts`）。

### アセット

| 名前 | 形式 | 配置先 |
|:--|:--|:--|
| 「ここに決めた！」手書き文字（フキダシ風） | SVG | `public/assets/person-headline-koko.svg`（トップと共用） |
| 人物写真 14 枚（カード用） | JPG | `public/assets/person-card-01.jpg` 〜 `-14.jpg` |
| メッセージボード付き写真（上 4 カード用のみ？） | JPG | `public/assets/person-board-01.jpg` 〜 `-04.jpg` |

### 注意

- Figma では上段 4 カードのみメッセージボード付き写真、残り 10 枚は共通の「腕組み社員」写真（プレースホルダ）。実運用では 14 枚すべて個別の社員写真に差し替える前提で、`src/data/persons.ts` などに配列データを持たせる。

---

## 05s Person 詳細 — `/person/[slug]/`

### Figma / 出力先

- node：`360:58`（1600×4434）
- Astro：`src/pages/person/[slug].astro`（**動的ルート**）。[`src/data/personDetails.ts`](../src/data/personDetails.ts) の `personDetails`（15 名・slug `01`〜`15`）を `getStaticPaths` で展開し、`/person/01/`〜`/person/15/` を静的生成する。
- `basePath`：`"../../"`
- **実装状態（2026-06-08）**：当初の「固定テンプレ 1 本（`/person/detail/`）」から**動的ルートへ移行済み**。一覧 [`person.astro`](../src/pages/person.astro) のカードから `./01/`〜`./15/` にリンク。`personDetails.ts` の 1 レコード = `{ slug, initials, dept, year, faculty, title[], photo, photoWidth, qa[{ question, headline[], body }] }`。本文は実データ（プレースホルダではない）。

### セクション構成

ルート要素は `<article class="p-person-detail">`。クラスはすべて `.p-person-detail__*` BEM。`__inner` に CSS 変数 `--person-bg`（背景写真 `p-bg-NN.jpg`）と `--photo-w`（人物切り抜き幅）をインライン付与する。

| # | セクション | クラス | 主な中身 |
|:--|:--|:--|:--|
| PS-1 | Sticky 全幅ビジュアル | `.p-person-detail__stage` / `__bg` / `__stage-inner` / `__photo` | **`position: sticky` で画面に固定**。青帯（`__bg`）＋横幅いっぱいの背景写真（`--person-bg`）＋人物切り抜き（`__photo`、頭が背景写真上端より少しはみ出す）。`loading="eager"` |
| PS-2 | スクロールするインタビュー本文 | `.p-person-detail__flow` | sticky ステージに重なって流れる |
| PS-3 | 小英字 `Person` | `.p-person-detail__label` | 青字 |
| PS-4 | 人物紹介見出し | `.p-person-detail__title`（h1）／`.p-person-detail__meta` | `title[]` を `<br>` 連結した大見出し＋メタ（`__meta-name`=initials／`__meta-item`=dept・year・faculty。faculty が空なら省略） |
| PS-5 | Q&A ブロック × N | `.p-person-detail__qa-list` / `__qa` | 各ブロック：`__q`（先頭に `__q-tick` 装飾＋question）／`__answer`（h2、`headline[]` を `<br>` 連結）／`__body`（回答本文） |
| PS-6 | 「社員インタビュー一覧を見る」ボタン | `.p-person-detail__list` / `__list-btn` | `href="../"`（一覧へ）。`__list-label`＋シェブロン `__list-chevron`（インライン SVG） |
| PS-7 | CTA ペア | — | `BottomCta`（INTERNSHIP / ENTRY） |
| PS-8 | パンくず | `.p-person-detail__breadcrumb` | `Breadcrumb`：`採用TOP ▸ はたらく人を知る ▸ {initials}` |

### Q&A データ

質問・回答見出し・本文は各社員ごとに [`personDetails.ts`](../src/data/personDetails.ts) の `qa[]`（`{ question, headline[], body }`）に実データで定義（社員ごとに件数は可変）。一覧の見出しキャッチ（`title[]`）も Figma の各カードテキストと一致。実社員写真の支給後にカード写真・人物切り抜きを差し替える前提（現状は Figma プレースホルダの合成再現）。

### Sticky の実装

`.p-person-detail__stage`（全幅ビジュアル）が `position: sticky` で固定され、`.p-person-detail__flow`（本文）がその上に重なってスクロールする構成。詳細は [`_p-person-detail.scss`](../src/scss/object/project/_p-person-detail.scss) を参照。

### データ駆動（実装済み）

[`src/data/personDetails.ts`](../src/data/personDetails.ts) に 15 名分の配列（slug／initials／dept／year／faculty／title[]／photo／photoWidth／qa[]）を持ち、`[slug].astro` の `getStaticPaths` で `/person/01/`〜`/person/15/` を静的ビルドする。

### アセット

| 名前 | 形式 | 配置先 |
|:--|:--|:--|
| 人物ポートレート 14 枚 | JPG | `public/assets/person-portrait-01.jpg` 〜 `-14.jpg` |

---

## 06 はたらく環境（Environment） — `/environment/`

### Figma / 出力先

- node：`242:446`（1600×8156）
- Astro：`src/pages/environment/index.astro`
- `basePath`：`"../"`

### セクション構成

| # | セクション | クラス | 主な中身 |
|:--|:--|:--|:--|
| E-1 | `PageHeader` | — | 英字 `Environment` ／サブ「はたらく環境を知る」／薄青空背景 |
| E-2 | ヒーロー写真 | `.p-environment__hero-visual` | 本社外観（道路＋緑地＋社名サイン） |
| E-3 | 教育研修制度 / Training | `.p-environment__training` | 見出し「教育研修制度／Training」／リード「ホシザキでは、新人をしっかりと育成し長く働けるよう体制を整えています。」／**研修体系図**（マトリックス：キャリアステージ × 研修カテゴリ） |
| E-4 | 4 つの制度カード | `.p-environment__training-cards` | 縦並びカード × 4：若手を支えるメンター制度／語学研修制度／社内検定制度／選抜型研修制度（各 2〜3 行本文＋右に写真） |
| E-5 | 福利厚生 / Benefits | `.p-environment__benefits` | 見出し「福利厚生／Benefits」／リード「ホシザキの充実した福利厚生制度の一部をご紹介します。」／アイコン付きカードグリッド（4 列 × 2 行＝8 枚 ×2 セット） |
| E-6 | 拠点紹介 / Office Tour | `.p-environment__tour` | 見出し「拠点紹介／Office Tour」／リード「愛知本社と島根工場のはたらく環境を紹介します。」／**タブ or 縦並び**：愛知（本社）／島根工場。各ブロックは横スクロール可能な写真ギャラリー（Swiper） |
| E-7 | CTA ペア | — | `CtaBannerPair` |
| E-8 | パンくず | — | `採用TOP ▸ はたらく環境を知る` |

### E-3 研修体系図

- マトリクス：行 = 管理職／中堅社員／若手社員（1-3 年目）／新入社員 の 4 段階。列 = 階層別研修／専門スキル・社内検定／自己啓発支援・フォローアップ。
- 各セルにバッジ（情報処理技術者、QC検定、内部監査員、溶接検定、フォークリフト運搬、ビジネススキル研修、新入社員基礎研修、メンター制度、メンター制…など）を配置。
- 凡例：カテゴリ色（青／緑／オレンジ）。
- 実装：SVG または CSS Grid＋バッジ要素で再現。

### E-4 制度カード（4 枚）

| 名称 | 本文 |
|:--|:--|
| 若手を支えるメンター制度 | 入社1年目から3年目までを後輩対象にメンター制度を導入しています。2年目からのメンター選任は、部門や年次に関わらず、メンティー自身のリクエストを受けて調整する柔軟な仕組みです。 |
| 語学研修制度 | 社員の主体的な学びを後押しするため、資格取得補助制度を設けています。 |
| 社内検定制度 | 各種技能検定（製図、溶接、フォークリフト等）や情報処理技術者、QC、内部監査員などの資格取得支援、昇進資格認定を行っています。 |
| 選抜型研修制度 | 各種技能検定（製図、溶接、フォークリフト等）や情報処理技術者、QC、内部監査員などの資格取得支援、昇進資格認定を行っています。（※Figma 上、社内検定と同文になっているため要校閲） |

### E-5 福利厚生カード（8 種 × 可能性として 2 セット繰り返し）

アイコン＋短い名称＋補足 1 行。

| 名称 | 補足 |
|:--|:--|
| 福利厚生倶楽部（リロクラブ） | 多種サービスを優待価格で利用できる会員制の福利厚生です。 |
| 退職金制度 | 勤続年数に応じて、退職時に退職金が支給される制度です。 |
| 財形貯蓄制度 | 給与天引により、無理なく計画的な資産形成が行える制度です。 |
| 社員持株制度 | 自社株を定期的に購入でき、中長期的な資産形成を支援します。 |
| 資格取得補助制度 | 資格取得にかかる費用を会社が補助し、自己啓発を後押しします。 |
| 独身寮制度（入寮要件あり） | 遠方出身者の若手社員が安心して生活できるよう寮を提供します。 |
| 社宅制度 | 転勤時の住居・社員の安定した生活を支える社宅を用意します。 |
| 会社保養施設 | 保養所を利用でき、社員とその家族がリフレッシュできる施設が充実しています。 |

### E-6 拠点紹介

- 愛知本社（外観写真＋内観 4 枚程度、Swiper でスライド）。
- 島根工場（外観写真＋内観）。
- Figma 上、写真は上部に 5 つ並び、左右矢印でスクロール。

### アセット

| 名前 | 形式 | 配置先 |
|:--|:--|:--|
| 本社外観写真 | JPG | `public/assets/env-hq-exterior.jpg` |
| 研修体系図（SVG 推奨） | SVG | `public/assets/env-training-matrix.svg` |
| 制度カード写真 ×4 | JPG | `public/assets/env-training-*.jpg` |
| 福利厚生アイコン ×8 | SVG | `public/assets/env-benefit-*.svg` |
| 拠点ギャラリー（愛知／島根） | JPG × 多 | `public/assets/env-tour-aichi-*.jpg` / `-shimane-*.jpg` |

---

## 07 募集要項（Requirement） — `/requirement/`

### Figma / 出力先

- node：`242:71`（1600×2908）
- Astro：`src/pages/requirement/index.astro`
- `basePath`：`"../"`

### セクション構成

| # | セクション | クラス | 主な中身 |
|:--|:--|:--|:--|
| R-1 | `PageHeader` | — | 英字 `Requirement` ／サブ「募集要項」／薄青空背景 |
| R-2 | リード | `.p-requirement__lead` | 「ホシザキは厨房機器の枠を超え、医療や農業など新たな分野への挑戦を続けています。食材ロスや環境負荷といった社会課題の解決を通じ、世界中の『食』の未来を創ることが私たちの使命です。現状に満足せず、グローバルな舞台で『常識の先へ』跳躍したいと願う、情熱ある皆さんのエントリーをお待ちしています。」 |
| R-3 | 総合職テーブル | `.p-requirement__table` | 見出し「総合職」＋氷ブロックアイコン／白カード内に `<dl>` or `<table>` で 8 項目：初任給／諸手当／昇給／賞与／勤務地／勤務時間／年間休日数／休日・休暇／待遇・福利厚生・社内制度 |
| R-4 | 初期配属 | `.p-requirement__note` | 見出し「初期配属について」＋氷ブロックアイコン／「内定通知の際に初期配属（職種・勤務地）をお知らせします／勤務地については、3 年間固定です。」 |
| R-5 | CTA ペア | — | `CtaBannerPair` |
| R-6 | パンくず | — | `採用TOP ▸ 募集要項` |

### R-3 テーブル内容

| 項目 | 内容 |
|:--|:--|
| 初任給 | 270,000 円 |
| 諸手当 | 時間外・休日・深夜勤務手当、住宅手当、通勤手当、家族手当、役付手当 他 |
| 昇給 | 年1回（4月）2025年度実績 平均 18,197 円 5.320% |
| 賞与 | 年2回（7月、12月）※2024 年度実績 年間 6.7 カ月 |
| 勤務地 | 愛知、島根 |
| 勤務時間 | 8:05〜17:00／実働 7.83 時間／1 日／休憩時間：65 分／※国内営業部門 9:00〜17:50（実働 7.83 時間） |
| 年間休日数 | 122 日 |
| 休日・休暇 | 完全週休2日制（企業カレンダーに基づく）／ゴールデンウィーク・夏季・年末年始休暇、産前産後・育児・介護休暇、慶弔等各種特別休暇、年次有給休暇（半日・時間単位制度含む） |
| 待遇・福利厚生・社内制度 | 福利厚生倶楽部（リロクラブ）、退職金制度、財形貯蓄制度、社員持株会制度、資格取得補助制度、独身寮制度（入寮要件あり）、社宅制度、会社保養施設（山荘）、クラブ活動補助（野球、バスケット、テニス、卓球、茶華道 等）、慶弔見舞金、食事補助 他 |

### スタイル

- テーブルは白背景カード内に配置。左カラム（項目名）180px、右カラム（内容）残り。
- 区切り線：薄グレー。
- 氷ブロックアイコンは各 `<h2>` の左に配置。

### アセット

| 名前 | 形式 | 配置先 |
|:--|:--|:--|
| 氷ブロックアイコン（見出し前） | SVG | `public/assets/ice-cube-heading.svg` |

---

## 08 SPECIAL CONTENTS インデックス — `/special/`

### Figma / 出力先

- node：`368:1401`（1600×3343）
- Astro：`src/pages/special/index.astro`
- `basePath`：`"../"`

### セクション構成

| # | セクション | クラス | 主な中身 |
|:--|:--|:--|:--|
| SI-1 | `PageHeader`（濃青／クジラ背景） | — | 英字 `SPECIAL CONTENTS` 大見出し／サブ「ホシザキをさらに深く知るスペシャルコンテンツ」／クジラ／ペンギンシルエット |
| SI-2 | ストーリーカード × 3 | `.p-special-index__cards` | **トップ S6 と同じ 3 カード**（クロストーク／プロジェクトストーリー／スペシャルトーク）を**フルワイド横長バナー**で縦に並べる。各カードは背景写真＋ダークオーバーレイ＋ラベル＋見出し＋概要＋出演者 avatar＋`READ MORE` |
| SI-3 | CTA ペア | — | `CtaBannerPair` |
| SI-4 | パンくず | — | `採用TOP ▸ スペシャルコンテンツ` |

### カードのマークアップ（共用パーツ）

`src/components/SpecialStoryCard.astro` に切り出してトップ（S6）と共用。

```astro
---
interface Props {
  href: string;
  label: string;         // 'クロストーク' 等
  title: string;         // '若手が語る\nはたらく環境'
  summary: string;
  avatars: string[];     // 画像パス配列
  bgImage: string;
  variant?: 'banner' | 'card';  // top=card, special-index=banner
}
---
```

### アセット

トップ S6 と共有。`public/assets/special-*.jpg`。

---

## 08-1 クロストーク — `/special/crosstalk/`

### Figma / 出力先

- node：`246:935`（1600×7973）
- Astro：`src/pages/special/crosstalk.astro`
- `basePath`：`"../../"`

### セクション構成（`.p-special-story .p-special-story--crosstalk`）

| # | セクション | クラス | 主な中身 |
|:--|:--|:--|:--|
| X-1 | ヒーロー | `.p-special-story__hero` | 会議中の 4 人の写真（幅いっぱい）／左下にラベル「クロストーク」＋白い大見出し「若手が語るはたらく環境」 |
| X-2 | 導入 | `.p-special-story__intro` | 「常識を飛び越え、高め合う。入社3年目が語るホシザキの『リアル』と『チームワーク』。…」（4〜5 行） |
| X-3 | 参加メンバー | `.p-special-story__members` | 見出し「参加メンバー」／丸アバター × 4（S.T 技術サービス 2023年入社 理系卒／A.K 営業職 2023年入社 文系卒／H.M 総合職 2023年入社 理系卒／H.M 総合職 2023年入社 理系卒）※同名 2 名だが Figma 上の表記そのまま |
| X-4〜X-7 | 質問ブロック × 4 | `.p-special-story__qa` | 各ブロック：左マージンに `—— 質問` 見出し／本文は複数段落（発言者ごとの丸アバター＋テキスト） |
| X-8 | 大判写真 × 3〜4 | `.p-special-story__photo` | 質問ブロックの間に挿入（幅 80〜100%） |
| X-9 | スペシャルコンテンツ一覧を見る | `.p-special-story__back` | 水色ボタン、`../`（SPECIAL CONTENTS index）へ |
| X-10 | CTA ペア | — | `CtaBannerPair` |
| X-11 | パンくず | — | `採用TOP ▸ スペシャルコンテンツ ▸ クロストーク` |

### 質問（Figma 既存）

1. 就活時は「厨房機器のメーカー」というイメージだったと思います。実際に入社してみて、仕事内容や働く環境にギャップはありましたか？
2. 若手の意見は言いやすい環境ですか？上司や他部署との関わりで、ホシザキらしい『チームワーク』を感じたエピソードを教えてください。
3. この3年間で、一番「自分が成長した」「新しいことに挑戦できた」と感じた仕事は何ですか？
4. 今後、ホシザキでどんなキャリアを描いていきたいですか？また、これから選考を受ける学生へ向けてメッセージをお願いします。

### 発言マークアップのパターン

```html
<div class="p-special-story__dialog">
  <figure class="p-special-story__avatar"><img src="..." alt="" /></figure>
  <p>発言内容...</p>
</div>
```

発言者の avatar によって `.p-special-story__avatar--st`／`--ak`／`--hm1`／`--hm2` などで色分け可能。

---

## 08-2 プロジェクトストーリー — `/special/project/`

### Figma / 出力先

- node：`393:1711`（1600×6640）
- Astro：`src/pages/special/project.astro`
- `basePath`：`"../../"`

### セクション構成（`.p-special-story .p-special-story--project`）

| # | セクション | 主な中身 |
|:--|:--|:--|
| PJ-1 | ヒーロー | 2 人の開発者写真（ラボ／ペンギンフィギュア）／左下ラベル「プロジェクトストーリー」＋大見出し「妥協なき、／食の未来への挑戦」 |
| PJ-2 | 導入 | 「世代を超えた共創。真空マイクロ波解凍機開発の舞台裏」＋サブ「業界の課題『食材ロス』解決に挑んだ若手社員とベテラン先輩社員。最新機器開発の葛藤と、ホシザキに根付くものづくりへの妥協なきこだわり。そして未来の技術者へ向けた熱い想いを語り合います。」 |
| PJ-3 | 参加メンバー | 2 名：M.W（技術サービス 2010 年入社 理系卒）／Y.S（技術サービス 2021 年入社 文系卒） |
| PJ-4〜 | 質問ブロック × 4（以下） | |

### 質問（Figma 既存）

1. 今回の製品開発で直面した最大の難所は何でしたか？その際、お二人はそれぞれどのような役割やアプローチで課題に向き合いましたか？
2. 先輩の『長年の知見』と、若手の『新しい視点（発想）』が最も上手く掛け合わさったと感じた具体的なエピソードを教えてください。
3. 共に困難を乗り越える中で再認識した、ホシザキの技術者に根付く『絶対に妥協しないこだわり』とは何だと思いますか？
4. 今回のプロジェクトを経て、お二人は今後どのような技術や製品開発に挑戦していきたいですか？未来の技術者（学生）へのメッセージとあわせてお願いします。

### 構造はクロストークと同じ（共通 SCSS `_p-special-story.scss`）

---

## 08-3 スペシャルトーク — `/special/special-talk/`

### Figma / 出力先

- node：旧 `393:1902`（1600×5763） → 最新 `626:1473`／`856:2912`（プロフィール＝佐々木 誠／執行役員 中央研究所所長）
- Astro：`src/pages/special/special-talk.astro`（ルート `/special/special-talk/`。`talk` ではない）
- `basePath`：`"../../"`

### セクション構成（`.p-special-story .p-special-story--talk`）

| # | セクション | 主な中身 |
|:--|:--|:--|
| T-1 | ヒーロー | 開発責任者の写真（都市背景）／ラベル「スペシャルトーク」＋大見出し「ホシザキの技術が作る未来」／サブ「ホシザキの開発責任者による特別トーク」 |
| T-2〜 | 質問ブロック × 4（話者 1 名の単独インタビュー） | |

### 質問（Figma 既存）

1. 今では厨房の『当たり前』となった省エネ技術ですが、開発当時はどのような壁があったのでしょうか？
2. その『ゼロから創る』精神が、現在注力されている『真空マイクロ波解凍機』にも活きていると伺いました。この製品の凄さはどこにあるのでしょうか？
3. なるほど、細胞レベルでの温度制御ができるのですね。そうした技術は、飲食業界以外にも応用が広がっているのでしょうか？
4. 高度な技術開発が進む中で、ホシザキの技術者に根付く『絶対に変わらないもの』は何でしょうか？
5. 最後に、これから共に未来を創る学生の皆さんへメッセージをお願いします。

### 話者アバターの出し分け

- 1 話者のみ（avatar が全発言で同一）。`.p-special-story__avatar--boss` などで統一色。

---

## 09 インターンシップ — `/internship/`

### Figma / 出力先

- node：`446:5278`（1600×8507、**v2 採用**）
- 旧版 node：`246:815`（1600×7488、**使用しない**）
- Astro：`src/pages/internship/index.astro`
- `basePath`：`"../"`

### セクション構成（`.p-internship`）

| # | セクション | クラス | 主な中身 |
|:--|:--|:--|:--|
| I-1 | 独自ヒーロー | `.p-internship__hero` | 青い背景／左上に「HOSHIZAKI インターンシップ」ロゴマーク帯／チーム写真 5 枚のタイル／右にサブ「冷却技術、IoT、サステナビリティ／食のインフラを更新する、知的な冒険へ。」／中央に大きな「冒険を始める／ENTRY」ボタン |
| I-2 | 導入コピー | `.p-internship__intro` | 「日本初の全自動製氷機を生み出したホシザキ。／私たちの開発は、一部の設計だけを担う仕事ではありません。／構想からリリースまでのすべての工程に携わるからこそ味わえる、／『モノづくりの圧倒的な手触り感』を体感してください。」 |
| I-3 | コース / COURSE | `.p-internship__courses` | 見出し `COURSE` ／**コースカード Swiper**：【理系】開発設計職5Daysインターンシップ（機械設計／制御設計コース）／【理系】2Days仕事体験 工場技術コース（愛知本社）／【理系】1Day仕事体験 電子設計コース（WEB）／他（左右矢印で切り替え） |
| I-4 | 選択中コース詳細 | `.p-internship__course-detail` | 選択されたコース名を表示（クリックで遷移 or タブ切替） |
| I-5 | ポイント / POINT | `.p-internship__points` | 見出し `POINT` ／3 カード（01／02／03）：`01「1 台丸ごと」を生み出す開発体験`（「少人数チームで開発の『1から10まで』に携わり、歯車ではないモノづくりの醍醐味を味わう。」）／`02 最先端の開発拠点「中央研究所」が舞台`（「プロが使用する CAD システムや試験室など、実際の開発環境で実務レベルの課題に没頭する。」）／`03 第一線のプロによる個別フィードバック`（「最終日の報告会では、現場で活躍する社員が学生一人ひとりに本気のフィードバックを実施。」） |
| I-6 | プログラム / PROGRAM | `.p-internship__program` | 見出し `PROGRAM` ／3 行テーブル：`DAY 1` インプットと現場理解（会社紹介、工場／試験室見学、オリエンテーション）／`DAY 2〜4` 設計開発・実務体験（社員とのミーティング同席、実際の製品（製氷機や冷蔵庫等）の動作観察、図面作成、開発試験）／`DAY 5` アウトプットとフィードバック（実習の振返り、成果報告会、現場社員（若手〜マネジメント層）からの個別フィードバック）／ペンギン 3 羽のイラスト |
| I-7 | 募集要項 / REQUIREMENTS | `.p-internship__requirements` | 見出し `REQUIREMENTS` ／白カード内テーブル：対象（理系学生〈学部・学科不問／基礎的な Office 操作ができる方〉）／開催時期（8月〜9月の平日5日間）／会場（愛知本社〈中央研究所〉または島根工場〈中央研究所〉）／特典（交通費実費支給、宿泊手配あり（遠方者）、昼食代支給（社員食堂利用））／選考（マイナビよりES提出 → WEB面接（1回）→ 参加決定） |
| I-8 | 体験者の声 / VOICES | `.p-internship__voices` | 見出し `VOICES` ／4 カード（女性 × 2／男性 × 2 のアバター＋テキストコメント）／各コメントは 4〜6 行 |
| I-9 | 採用担当からのメッセージ / MESSAGE | `.p-internship__message` | 見出し「採用担当からのメッセージ／MESSAGE」／本文（中央寄せ）：「『ホシザキを、ただの厨房機器メーカーと思っていないか。』私たちが求めているのは、既存の枠を超え、新しい『食の当たり前』を創り出すパイオニア精神です。世界中の厨房、そして医療や農業の現場を支える製品が、どのような思考と情熱から生まれるのか。この5日間で、あなたの『常識』を塗り替える体験が待っています。」／「さぁ、その想いを翼に変えて。エントリーはマイページから。」 |
| I-10 | 冒険を始める ENTRY | `.p-internship__cta` | 独立した大きな CTA ボタン（ページ内で 2 回目）／ログイン／エントリー導線 |
| I-11 | パンくず | — | `採用TOP ▸ インターンシップ` |

### 注意

- 他ページと異なり **`PageHeader` コンポーネントは使わず**、独自のヒーロー（I-1）を構築する。
- ページ末尾に通常の `CtaBannerPair` を配置するかは要確認（Figma スクショでは独立 ENTRY ボタンのみで、`CtaBannerPair` は無い可能性あり）。**デフォルトでは `CtaBannerPair` を置かない**方針（TODO）。
- コースカルーセルは Swiper 12。`src/scripts/internship-course-swiper.ts` で初期化。

### アセット

| 名前 | 形式 | 配置先 |
|:--|:--|:--|
| ヒーロー チーム写真（5 枚タイル） | JPG | `public/assets/internship-hero-*.jpg` |
| コースカードサムネイル | JPG | `public/assets/internship-course-*.jpg` |
| プログラム ペンギンイラスト | PNG | `public/assets/internship-program-penguins.png` |
| VOICES アバター × 4 | PNG | `public/assets/internship-voice-*.png` |

---

## 全ページ共通の未解決事項（TODO）

- [ ] 各ページの Figma から**フォントサイズ・行間・カラー値**を詳細抽出し、[foundation/_variables.scss](../src/scss/foundation/_variables.scss) にトークン化。
- [ ] Footer のサイトマップの SPECIAL CONTENTS 3 項目の正式タイトルを確認。
- [ ] Person 一覧・詳細の実データ（14 名分）を `src/data/persons.ts` に整理。
- [ ] Internship の v1／v2 のどちらが正かデザイナー確認。
- [ ] 採用メッセージの「人の写真は使わない／採用ペンギン」が最終指示か確認（写真 → ペンギンに差替？）。
- [ ] Strategy（Beyond）の「飲食市場」「飲食外市場」サブセクション本文の入稿確認。
- [ ] 全ページで Swiper／GSAP ScrollTrigger を使うセクションの初期化スクリプトを `src/scripts/` に集約する方針を合意。
- [ ] SP 版レイアウトは全ページ未定。トップのみ `431:1181` を参照し、他は PC 版ベースで最低限のリキッド対応。
