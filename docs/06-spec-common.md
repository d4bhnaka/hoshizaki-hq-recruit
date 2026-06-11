# 06. 共通コンポーネント仕様

全ページで再利用する部品の仕様書です。**過去セッションで骨組みが先行実装済み**（2026-04-24）。本ドキュメントは実装済みコンポーネントの Props／責務を整理したリファレンスであり、今後の仕様変更はここを先に更新してから実装を触ります。

## 一覧

| # | コンポーネント | Astro ファイル | SCSS partial | 層 | 主クラス | Figma node | 状態 |
|:--|:--|:--|:--|:--|:--|:--|:--|
| C1 | Header | [`src/components/Header.astro`](../src/components/Header.astro) | `layout/_l-header.scss` | layout | `.l-header` | `361:538` | 実装済み |
| C2 | Footer | [`src/components/Footer.astro`](../src/components/Footer.astro) | `layout/_l-footer.scss` | layout | `.l-footer` | `360:179` | 実装済み |
| C3 | Breadcrumb | [`src/components/Breadcrumb.astro`](../src/components/Breadcrumb.astro) | `object/component/_c-breadcrumb.scss` | component | `.c-breadcrumb` | Header バリアント 2（要確認） | 実装済み |
| C4 | PageHero | [`src/components/PageHero.astro`](../src/components/PageHero.astro) | `object/component/_c-page-hero.scss` | component | `.c-page-hero` | 各下層ページ共通帯 | 実装済み |
| C5 | BottomCta | [`src/components/BottomCta.astro`](../src/components/BottomCta.astro) | `object/component/_c-bottom-cta.scss` | component | `.c-bottom-cta` | `367:815` / `367:869` のペア | 実装済み |
| C6 | SectionHeading | [`src/components/SectionHeading.astro`](../src/components/SectionHeading.astro) | `object/component/_c-section-heading.scss` | component | `.c-section-heading` | — | 実装済み |
| C7 | IceLinkButton | [`src/components/IceLinkButton.astro`](../src/components/IceLinkButton.astro) | `object/component/_c-ice-link.scss` | component | `.c-ice-link` | `365:16915` | 実装済み（2026-06-11 コンポーネント化）。トップ 6 個＋strategy 地図 7 個で使用 |
| C8 | PersonCard | [`src/components/PersonCard.astro`](../src/components/PersonCard.astro) | `object/component/_c-person-card.scss` | component | `.c-person-card` | `365:655` | 実装済み（2026-04-25） |
| C9 | SPECIAL ストーリーデータ | [`src/data/specialStories.ts`](../src/data/specialStories.ts) | — | data | — | トップ S6 / SC index で共用 | **データのみ共通化**（コンポーネントは統合せず、`.p-top-special__card` と `.p-special__card` は別構造を維持） |

> **`c-interview-block` / `c-stat-card` / `c-entry-button`**：`style.scss` に登録済みだが Astro コンポーネント化されておらず、各ページで直書きマークアップを `.c-*` クラスだけ使っている状態。ヘルパー的な component 層のクラス集として運用中。

---

## C1 Header — `.l-header`

### Figma

- node：`361:538`（FRAME, 1590×266）
  - `361:537` — デフォルト variant（1558×109）
  - `361:539` — バリアント 2（1558×109）※パンくず付きの可能性あり（要確認）

### 実装（[src/components/Header.astro](../src/components/Header.astro)）

```astro
interface Props {
  basePath?: string;
  variant?: "light" | "solid";
}
```

- 左：ホシザキロゴ（`images/common/logo-hoshizaki.svg`）＋テキストフォールバック。
- 右：インターンシップ CTA ボタン／応募はこちら CTA ボタン／ハンバーガー（3 本線）。
- `variant="solid"` は現状スタイル側のみ対応。ハンバーガー展開メニューの中身は未実装。

### 残タスク

- [ ] ハンバーガータップで展開ナビを出す（Figma `425:1440` 他の `Navigation` frame を参考）。
- [ ] `logo-hoshizaki.svg` が実ファイルで存在することを確認（`onerror` でテキストフォールバック）。

---

## C2 Footer — `.l-footer`

### Figma

- node：`360:179`（1600×539）

### 実装（[src/components/Footer.astro](../src/components/Footer.astro)）

4 カラム固定のサイトマップ＋最下部の `HOSHIZAKI` ワードマーク。

```
列 1: 採用TOP
列 2: 採用メッセージ / What's HOSHIZAKI / Beyond HOSHIZAKI / Team HOSHIZAKI / 先輩たちの「ここに決めた」
列 3: SPECIAL CONTENTS（見出しリンク）/ 入社3年目の挑戦 / 社内SE職の挑戦 / ホシザキ 暮らしのクロストーク
列 4: はたらく環境を知る / 募集要項 / インターンシップ情報 / ホシザキ企業サイト（外部）
```

- 下部の `HOSHIZAKI` ワードマークは CSS テキスト（極太フォント、ページ幅いっぱい）を使用。別途 SVG ロゴを使うならアセット配置＋マークアップ変更が必要。

### 残タスク

- [ ] 列 3 の SPECIAL CONTENTS 3 項目（「入社3年目の挑戦」「社内SE職の挑戦」「ホシザキ 暮らしのクロストーク」）の正式タイトルをクライアント確認。**現状の実装で本体の 3 バナー（クロストーク／プロジェクトストーリー／スペシャルトーク）と文言が一致していない**（M5-4）。

---

## C3 Breadcrumb — `.c-breadcrumb`

### 実装（[src/components/Breadcrumb.astro](../src/components/Breadcrumb.astro)）

```astro
interface Crumb { href?: string; label: string; }
interface Props { basePath?: string; items: Crumb[]; }
```

- 先頭の「採用TOP」は内部で自動挿入されるため、利用側は **自ページぶんだけ** を `items` に渡す。
- 最後の要素は `<span class="c-breadcrumb__current">`、途中は `<a>`。セパレータ `›`。

### 使用例

```astro
<Breadcrumb basePath={base} items={[{ label: "採用メッセージ" }]} />
```

---

## C4 PageHero — `.c-page-hero`

### 実装（[src/components/PageHero.astro](../src/components/PageHero.astro)）

下層ページのタイトル帯（**英字大見出し＋日本語サブ**）を共通化。

```astro
interface Props {
  en: string;
  ja?: string;
  variant?: "light" | "blue" | "cloud";
  compact?: boolean;
  align?: "left" | "center";
  bg?: string;
}
```

- `bg` を渡すと `--page-hero-bg: url('...')` が要素に適用される。
- `<slot />` でサブコピー等を追加、`<slot name="decoration" />` で装飾要素を右側などに配置。

### 各ページのテーマ割り当て

| ページ | `en` | `ja` | `variant` | 備考 |
|:--|:--|:--|:--|:--|
| Message | `PIONEER SPIRIT` | 採用メッセージ | `cloud` | 独自ヒーロー（`p-message-hero`）を使っている可能性あり — 実装確認 |
| Fact | `What's HOSHIZAKI` | 数字で見るホシザキ | `cloud` | — |
| Strategy | `Beyond HOSHIZAKI` | — | `cloud` | — |
| Job | `Team HOSHIZAKI` | ホシザキの職種紹介 | `cloud` | — |
| Person list | `Person` | はたらく人を知る | `light` | — |
| Person single | `Person` | — | `light` | 独自レイアウト（sticky 右カラム） |
| Environment | `Environment` | はたらく環境を知る | `cloud` | — |
| Requirement | `Requirement` | 募集要項 | `cloud` | — |
| Special index | `SPECIAL CONTENTS` | ホシザキをさらに深く知るスペシャルコンテンツ | `blue` | — |
| Crosstalk | クロストーク | 若手が語るはたらく環境 | `light` | 独自ヒーロー（写真幅いっぱい） |
| Project story | プロジェクトストーリー | 妥協なき、食の未来への挑戦 | `light` | 同上 |
| Special talk | スペシャルトーク | ホシザキの技術が作る未来 | `light` | 同上 |
| Internship | — | — | — | 独自ヒーロー、`PageHero` 不使用 |

---

## C5 BottomCta — `.c-bottom-cta`

### Figma

- Internship：`367:869`
- Entry：`367:815` / `363:516`

### 実装（[src/components/BottomCta.astro](../src/components/BottomCta.astro)）

Internship / Entry の 2 つの CTA を **1 コンポーネントで横並び** にレンダリングするラッパー。

```astro
interface Props { basePath?: string; }
```

- 左：`INTERNSHIP` → `${basePath}internship/` 固定。
- 右：`ENTRY` → `${basePath}requirement/` 固定。
- `href` をカスタマイズする Props は現状なし。Entry 先を外部マイページにする場合は Props を追加する余地あり（M5 TODO）。

### 配置場所

- 全下層ページのフッター直前（Breadcrumb よりも上）。

---

## C6 SectionHeading — `.c-section-heading`

### 実装（[src/components/SectionHeading.astro](../src/components/SectionHeading.astro)）

セクション冒頭の見出しブロック。**日本語サブ（氷アイコン付き）＋英字大見出し＋注釈** の 3 パーツ構成。

```astro
interface Props {
  en: string;
  ja?: string;
  note?: string;
  id?: string;
  align?: "left" | "center";
  size?: "md" | "lg";
}
```

### 使用例

- `Fact` ページの `HOSHIZAKIの成長を知る` / `長く、自分らしく働く【環境・福利厚生】`。
- `Strategy` ページの `Business Field` / `Global Market` / `Global Pioneers`。
- `Job` ページの `Job`。
- `Environment` ページの `Training` / `Benefits` / `Office Tour`。
- `Internship` ページの `COURSE` / `POINT` / `PROGRAM` / `REQUIREMENTS` / `VOICES` / `MESSAGE`。

---

## C7 IceLinkButton — `.c-ice-link`

### Figma

- node：`365:16915`（`LinkButtonIce` symbol, 207×200）
- 内部：`ice`（24×25、cube 1〜3 の小さな氷ブロック）

### 実装（[src/components/IceLinkButton.astro](../src/components/IceLinkButton.astro)）— 2026-06-11 コンポーネント化（M2-C4）

氷塊画像（`images/common/link-button-ice.png`）にラベル＋サブラベルを重ねたリンクボタン。スタイルは `object/component/_c-ice-link.scss`（`style.scss` 登録済み）。使用箇所：トップ `/` の S2 Pioneer／S3 Trio×3／S4 ここに決めた！／S5 環境（計 6 個）、`/strategy/` の世界地図 READ MORE ボタン（計 7 個）。

```astro
interface Props {
  href: string;
  label: string;
  sublabel?: string;       // デフォルト "READ MORE"
  basePath?: string;       // 氷画像への相対パス基準（デフォルト "./"。下層は "../"）
  fluid?: boolean;         // cqw 比例の流体サイズ版（container-type のステージ内専用）
  lazy?: boolean;          // 氷画像を loading="lazy" で読み込む
  class?: string;          // ページ側の配置クラス（.p-top-trio__button 等）を追加
  [key: string]: unknown;  // data-inview / style / aria-label などの透過属性
}
```

- 当初予定の `variant: 'light' | 'dark'` は実装不要と判明したため廃止し、実態に合わせ `fluid`（トップのステージ内で cqw 拡縮）を採用。
- strategy の地図用縮小版 **`.c-ice-link--map`** はページ固有のため `object/project/_p-strategy.scss` 側で拡張（`class` プロップで付与）。

### 残タスク

- [ ] Team／Environment／Person の各ページでも同ボタンが使われているかを Figma で確認し、使われていれば差し替え。

---

## C8 PersonCard — `.c-person-card`

### Figma

- node：`365:655`（`PersonCard` symbol, 318×431）

### 実装（[src/components/PersonCard.astro](../src/components/PersonCard.astro)）

Person 一覧（`/person/`）で使用。`src/pages/person.astro` が `<li>` でラップしつつ本コンポーネントを 14 回呼ぶ。

```astro
interface Props {
  image: string;
  quote: string;       // バブル吹き出しのメッセージ
  body: string;        // "／" 区切りで改行される本文
  department: string;  // 部署タグ
  href?: string;       // デフォルト "./detail/"
}
```

- 写真 (`<figure class="c-person-card__photo">`) には `<div>` 背景画像 + `<img>` + `<figcaption>` の吹き出し。
- `body` は `／` で分割して `<br>` で繋ぐ（Figma の文面「ペンギンマークの会社で／働いています！と／自信をもって言える事」に合わせた構文糖衣）。
- フィルター用の `data-person-tags` は **呼び出し側の `<li>`** で管理（カードには持たせない）。

### 残タスク

- [ ] 14 名分の実写真を [../public/images/person/](../public/images/person/) に配置（`person-01.jpg` 〜 `person-14.jpg`）。
- [ ] 将来的に 14 個別ページを作るなら `src/data/persons.ts` に名簿データを抽出し、`[slug]` 動的ルートへ移行。

---

## C9 SPECIAL CONTENTS カード — データのみ共通化

### 役割

SPECIAL CONTENTS の 3 ストーリー（クロストーク／プロジェクトストーリー／スペシャルトーク）への導線カード。**トップ S6 と SPECIAL CONTENTS index（`/special/`）で内容は同じだが、見た目が大きく異なる**：

- **トップ S6**（`.p-top-special__card`）：番号付き縦リスト型の小さめカード。
- **SPECIAL CONTENTS index**（`.p-special__card`）：背景写真付き横長バナー型、見出しが 2 行分割。

マークアップ構造が違うため 1 つの Astro コンポーネントに統合すると Props が肥大化するため、**データのみ共通化**する方針を採用した。

### 実装（[src/data/specialStories.ts](../src/data/specialStories.ts)）

```ts
export interface SpecialStory {
  slug: "crosstalk" | "project" | "talk";
  num: string;                         // "01" / "02" / "03"
  category: string;                    // "クロストーク" 等
  title: string;                       // 単一行版（トップ用）
  titleLines: [string, string];        // 2 行版（SPECIAL index 用）
  sub: string;
  bg: string;                          // basePath 相対の背景画像
  avatars: number;                     // 1 / 2 / 3
}

export const specialStories: SpecialStory[]; // 3 要素
```

### 使う側

- トップ（`/`）：`specialStories.map(s => ({ href: `${basePath}special/${s.slug}/`, tag: s.category, title: s.title, sub: s.sub, num: s.num }))`
- SPECIAL index（`/special/`）：`specialStories.map(s => ({ href: `./${s.slug}/`, category: s.category, titleLines: s.titleLines, sub: s.sub, bg: `${base}${s.bg}`, avatars: s.avatars, modifier: s.slug }))`

これにより：
- **見出し／概要／背景画像／アバター数の単一管理**ができる。
- ストーリーを増減するときの変更箇所が 1 ファイルに収まる。
- マークアップは各ページの `.p-*` 層で最適化したままにできる。

### 残タスク

- [ ] 3 ストーリーの背景画像 `images/special/special_0{1,2,3}/hero.jpg` を Figma から書き出して配置。
- [ ] アバター画像（丸トリミング）を `images/special/avatar-*.png` で用意し、`avatars: number` を `avatarImages: string[]` に拡張するかを検討。

---

## アセット配置の実態

仕様書の初版では `public/assets/` を前提にしていましたが、**実装は `public/images/<page-slug>/` を使っています**。以後ドキュメントもこちらの構成で統一します。

```
public/
├── css/          (build 出力の style.css がここに出る)
├── fonts/        (Web フォント用ディレクトリ)
├── images/
│   ├── common/   ヘッダーロゴ、BottomCTA バナー、全ページ共通のスケルトンペンギン 等
│   ├── top/      トップページの雲、ペンギン、氷キューブ、背景都市、Pioneer アイコン 等
│   ├── message/
│   ├── fact/
│   ├── strategy/
│   ├── job/
│   ├── person/
│   ├── environment/
│   ├── requirement/
│   └── special/
└── favicon.svg / favicon.ico
```

### 命名規則

- 小文字ケバブケース、ハッシュなし。
- 既存実装が使用している主なファイル名：
  - `images/common/bnr_entry.png` / `bnr_internship.png` / `skelton-penguin.png`
  - `images/top/ap_01.png` 〜 `ap_05.png`（飛ぶペンギン）／`cloud01` 〜 `cloud03.png`／`ice_cubes_01` 〜 `04.png`／`bg-city.png`／`pioneer.png`／`top_penguins.png`／`section-bg-environment.jpg`

## 未解決事項（TODO）

- [ ] Header バリアント 2（`361:539`）がパンくず入りかを Figma で目視確認。
- [ ] ハンバーガー展開時のナビ（`425:1440` 他）の正版を特定し実装。
- [ ] Footer サイトマップの SPECIAL CONTENTS 3 本の正式タイトルを確認（M5-4）。
- [ ] BottomCta の Entry 先（`/requirement/` か外部マイページか）をクライアント確認。
- [ ] SpecialStoryCard のコンポーネント化（IceLinkButton は 2026-06-11、PersonCard は 2026-04-25 に完了）。
- [ ] Fonts ディレクトリの読み込み設定（`_base.scss` と `public/fonts/`）。
