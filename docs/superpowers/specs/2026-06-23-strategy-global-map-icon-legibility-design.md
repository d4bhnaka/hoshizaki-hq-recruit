# 海外展開マップ アイコン視認性改善 — 設計

- **対象ページ:** `/strategy/`（海外展開セクション `.p-strategy-global`）
- **日付:** 2026-06-23
- **ステータス:** 設計確定（実装計画待ち）

## 背景と課題

海外展開セクションの世界地図 `.p-strategy-global__map` には、市場ごとの氷塊アイコン（`.c-ice-link--map`、7個）が散らしてある。各アイコンは市場カードへのアンカーリンク（`#market-*`）で、ホバーすると浮き上がり＋シマーでクリック可能と分かる仕様になっている。

クライアントから次の指摘があった。

1. 氷のアイコンが小さく見づらい。
2. アイコン上の文字が小さく読みづらい（現状 7〜10px ＋「READ MORE」7px）。
3. ホバーでクリック可能と分かる作りにはなっているので、各アイコンの「READ MORE」は不要。代わりに、どれかのペンギンから「クリックしてね」のような操作ナビゲーションを 1 つ入れるだけでよい。

## 方針（確定事項）

ユーザー確認により、次の方向で確定。

- **アイコンと文字を拡大**し、地図上でも常に 7 つの市場名が読める状態にする（ホバー依存にしない）。
- ラベルは**半透明白プレート＋濃紺太字**で表示（実プロトタイプ「V3」を採用）。地図のトライアングル模様に負けず最もくっきり読めるため。
- 各アイコンの**「READ MORE」は削除**。
- 右上のペンギン集団から**「クリックしてね！」の吹き出し**を 1 つ追加して操作を誘導。
- **スマホ（≤600px）はアイコンのみ**（文字は視覚的に隠す）。市場名は地図直下のカードが担う。

## 変更対象ファイル

| ファイル | 変更内容 |
| --- | --- |
| `src/scss/object/project/_p-strategy.scss` | アイコン拡大・プレート型ラベル・吹き出し・レスポンシブ |
| `src/components/IceLinkButton.astro` | `sublabel` が空のとき `__more` span を描画しない |
| `src/pages/strategy.astro` | 地図リンクに `sublabel=""` を渡す／吹き出し要素を追加 |

**変更しないもの:** 7 アイコンの配置座標（`globalMarkets[].map`）、世界地図画像、散らしペンギン（pg01–07）、中央バッジ、地図直下の市場カード、画像アセット（新規追加なし）。

## 詳細設計

### 1. アイコン拡大（デスクトップ／タブレット）

`.c-ice-link.c-ice-link--map` の幅を拡大する。

- 現状: `width: clamp(46px, 5.84%, 84px)`
- 変更後: `width: clamp(70px, 8.2%, 118px)`（約 1.4〜1.5 倍）
- `aspect-ratio: 82 / 79`、ホバーの `translateY(-3px)` は維持。

### 2. プレート型ラベル（「V3」）

`.c-ice-link--map .c-ice-link__label` を次のように変更。

```scss
.c-ice-link--map .c-ice-link__label {
  font-size: clamp(10px, 0.95vw, 15px);
  font-weight: 700;
  line-height: 1.25;
  text-decoration: none;            // 下線は廃止（プレートとホバーで可読性・操作性を担保）
  color: var(--color-brand-navy);   // #002f5f
  background: rgba(255, 255, 255, 0.86);
  border-radius: 6px;
  padding: 2px 6px;
  box-shadow: 0 1px 3px rgba(0, 47, 95, 0.18);
}
```

ラベル位置の微調整として `.c-ice-link--map .c-ice-link__inner` の `padding` を `16% 6% 6%` → `14% 6% 8%` に変更（READ MORE が消えた分、ラベルを中央寄りに）。

### 3. 「READ MORE」の削除（コンポーネント側で安全に）

`.c-ice-link--map` の `__more` を CSS で `display:none` にすると、出力 HTML にデッドな「READ MORE」テキストが残る。クライアントが HTML を直接編集する前提のため、**マークアップ自体に出さない**方式にする。

`src/components/IceLinkButton.astro`:

- `__more` span を **`sublabel` が空文字列でないときだけ描画**する（`{sublabel && <span class="c-ice-link__more">{sublabel}</span>}`）。
- デフォルト値 `"READ MORE"` は維持。special 系ページなど既存の呼び出しは影響を受けない。

`src/pages/strategy.astro` の地図リンク（`globalMarkets.map(...)` 内の `IceLinkButton`）に **`sublabel=""`** を渡す。

### 4. ペンギンの吹き出し「クリックしてね！」

`.p-strategy-global__map-wrap` 内に装飾要素を 1 つ追加する（FLOCSS の `p-` 命名）。

- マークアップ例: `<span class="p-strategy-global__map-cue">クリックしてね！</span>`
- 位置: 右上、ペンギン集団（`penguins5.png`）の直下。吹き出しの尾（tail）は上向きでペンギンを指す。空いた海の領域に置き、アイコンと重ならない。プロトタイプ実測値の目安は `right: 19%; top: 1%`。
- スタイル: 白の角丸ピル、`2px solid var(--color-brand-cyan)`（#00c8ff）、濃紺太字（`var(--color-brand-navy)`）、ソフトシャドウ。尾は `::before`/`::after` の三角形で白＋シアン縁取り。`z-index` はアイコン（2）より上、ペンギン（3）と同等以上。`pointer-events: none`。
- アニメーション: ゆっくりした上下のバウンド（bob）を `@media (prefers-reduced-motion: no-preference)` 内に限定して付与し、視線を誘導する。reduced-motion 環境では静止。
- 色は既存ブランド規定に準拠（基本シアン #00c8ff を使用。濃いアクセント #00a0e9 とは使い分ける）。

### 5. レスポンシブ

- **601px–960px（タブレット）:** ラベルを維持。768px で可読・非衝突を実機（プロトタイプ）で確認済み。
- **≤600px（スマホ）:** アイコンのみ表示にする。
  - `.c-ice-link--map .c-ice-link__label` を**視覚的に隠す**（`sr-only` 相当: 例 `position:absolute; width:1px; height:1px; overflow:hidden; clip-path: inset(50%); white-space:nowrap;`）。DOM には残し、`<a>` のアクセシブルネーム（市場名）を全ブレークポイントで保持する。
  - アイコンを快適なタップサイズに縮小: `width: clamp(44px, 13%, 60px)` 目安。
  - 吹き出しは維持（「タップしてね」的な誘導として有効）。文言は「クリックしてね！」のままとする。
  - 市場名は地図直下の市場カード（既に大きなバッジで全市場名を表示）が担う。

## アクセシビリティ・ハンドオフ整合

- 各地図リンク `<a>` は全ブレークポイントで市場名をアクセシブルネームとして保持（スマホでも読み上げ・リンク名が有効）。
- 吹き出しは装飾的な誘導テキスト。`pointer-events: none` でクリックを妨げない。
- ビルド制約（ハッシュなし／スコープド CSS 不使用／無圧縮／相対パス）に影響する変更はなし。スタイルは `src/scss/` のみ、`.astro` に `<style>` は追加しない。

## スコープ外

- アイコン配置座標・中央バッジ・ペンギン・地図画像の変更。
- 地図直下の市場カードの変更。
- 新規画像アセットの追加。

## 検証

- `npm run build:scss` でコンパイルが通ること。
- デスクトップ（1440px）・タブレット（768px）・スマホ（390px）で、ラベル可読性・アイコンの非衝突・吹き出し位置・READ MORE が出力 HTML に残っていないことを確認。
- special 系ページの `.c-ice-link`（READ MORE あり）が従来どおり表示されること（リグレッション確認）。
