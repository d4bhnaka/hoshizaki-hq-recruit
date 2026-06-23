# 海外展開マップ アイコン視認性改善 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 海外展開セクションの世界地図上の氷アイコンを拡大し、ラベルを白プレートで常時読めるようにし、「READ MORE」を削除してペンギンの「クリックしてね！」吹き出しに置き換え、スマホではアイコンのみにする。

**Architecture:** 既存の `IceLinkButton` コンポーネントと `_p-strategy.scss` を編集する純粋なフロントエンド（Astro + SCSS）変更。新規画像・新規パーシャルなし。地図の座標・画像・市場カードは不変。

**Tech Stack:** Astro（静的ビルド、`base: "./"`）、SCSS（FLOCSS、CSS カスタムプロパティ）。テストランナーは無い（CLAUDE.md 記載）。検証は「SCSS コンパイル成功 ＋ 出力 HTML/CSS の grep ＋ 3 ブレークポイントの目視」で行う。

## Global Constraints

これらは全タスクに暗黙的に適用される。spec とリポジトリ規約から逐語コピー。

- `.astro` に `<style>` を書かない。スタイルは `src/scss/` のみ（Astro scoped CSS は `data-astro-cid-*` を吐きハンドオフを汚すため禁止）。
- Sass 変数ではなく CSS カスタムプロパティを使う（`var(--name)`）。
- FLOCSS 接頭辞を守る（`c-` コンポーネント、`p-` プロジェクト）。
- ブランドのシアンは 2 系統。吹き出しの縁取りは**基本シアン `var(--color-brand-cyan)`（#00c8ff）**を使う。濃いアクセント #00a0e9 と混同しない。
- ビルド設定（ハッシュなし／無圧縮／相対パス／directory フォーマット）に触れない。
- 変更してはいけないもの: 7 アイコンの座標（`globalMarkets[].map`）、世界地図画像、散らしペンギン（pg01–07）、中央バッジ、地図直下の市場カード、画像アセット。
- 各地図リンク `<a>` は全ブレークポイントで市場名をアクセシブルネームとして保持する（スマホでもラベルは DOM に残し視覚的に隠すだけ）。
- コミットメッセージ末尾に必ず付与: `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`
- 作業ブランチは `feat/strategy-map-legibility`（チェックアウト済み、spec はコミット済み）。

## File Structure

| ファイル | 責務 | 変更タスク |
| --- | --- | --- |
| `src/components/IceLinkButton.astro` | `sublabel` が空なら `__more` span を描画しない | Task 1 |
| `src/pages/strategy.astro` | 地図リンクに `sublabel=""`／吹き出し要素を追加 | Task 1, Task 3 |
| `src/scss/object/project/_p-strategy.scss` | アイコン拡大・プレート型ラベル・吹き出し・レスポンシブ | Task 2, Task 3, Task 4 |

---

## Task 1: 「READ MORE」を地図リンクから消す（コンポーネント＋ページ配線）

**Files:**
- Modify: `src/components/IceLinkButton.astro:46-49`
- Modify: `src/pages/strategy.astro:300-310`（`globalMarkets.map(...)` 内の `IceLinkButton`）

**Interfaces:**
- Consumes: なし
- Produces: `IceLinkButton` は `sublabel` が空文字列のとき `<span class="c-ice-link__more">` を**出力しない**。デフォルト `sublabel="READ MORE"` は維持されるため、`sublabel` を渡さない既存呼び出し（special 系）は従来どおり READ MORE を表示する。

- [ ] **Step 1: コンポーネントを条件描画にする**

`src/components/IceLinkButton.astro` の以下のブロック（46–49 行目）：

```astro
  <span class="c-ice-link__inner">
    <span class="c-ice-link__label">{label}</span>
    <span class="c-ice-link__more">{sublabel}</span>
  </span>
```

を次に置き換える（`sublabel` が truthy のときだけ `__more` を描画）：

```astro
  <span class="c-ice-link__inner">
    <span class="c-ice-link__label">{label}</span>
    {sublabel && <span class="c-ice-link__more">{sublabel}</span>}
  </span>
```

- [ ] **Step 2: 地図リンクに `sublabel=""` を渡す**

`src/pages/strategy.astro` の `globalMarkets.map(...)` 内の `IceLinkButton`（300–310 行目付近）：

```astro
                  globalMarkets.map((market) => (
                    <IceLinkButton
                      class="c-ice-link--map p-strategy-global__map-link"
                      href={`#${market.id}`}
                      label={market.title}
                      basePath={base}
                      lazy
                      style={`left:${market.map.left}%;top:${market.map.top}%`}
                    />
                  ))
```

を次に置き換える（`label` の直後に `sublabel=""` を追加）：

```astro
                  globalMarkets.map((market) => (
                    <IceLinkButton
                      class="c-ice-link--map p-strategy-global__map-link"
                      href={`#${market.id}`}
                      label={market.title}
                      sublabel=""
                      basePath={base}
                      lazy
                      style={`left:${market.map.left}%;top:${market.map.top}%`}
                    />
                  ))
```

- [ ] **Step 3: ビルドして出力 HTML を検証**

Run:
```bash
npm run build
```
Expected: ビルドがエラーなく完了（exit 0）。

- [ ] **Step 4: 地図リンクに READ MORE が無いことを確認**

Run:
```bash
grep -c 'c-ice-link__more' dist/strategy/index.html
```
Expected: `0`（strategy ページの出力に `c-ice-link__more` が一切無い）。

- [ ] **Step 5: special 系ページの READ MORE が残っていることを確認（リグレッション）**

Run:
```bash
grep -rl 'READ MORE' dist/special/ 2>/dev/null | head
```
Expected: 1 つ以上のファイルがヒット（special の `.c-ice-link` は従来どおり READ MORE を表示）。

- [ ] **Step 6: コミット**

```bash
git add src/components/IceLinkButton.astro src/pages/strategy.astro
git commit -m "$(cat <<'EOF'
feat(strategy): 地図の氷リンクからREAD MOREを削除

IceLinkButtonはsublabelが空のとき__moreを描画しない。
地図リンクにsublabel=""を渡す。special系のREAD MOREは不変。

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 2: 氷アイコンを拡大し、ラベルを白プレート化（デスクトップ／タブレット）

**Files:**
- Modify: `src/scss/object/project/_p-strategy.scss:307-335`（`.c-ice-link--map` 系 4 ブロック）

**Interfaces:**
- Consumes: Task 1（`__more` が地図リンクに無いこと。本タスクは dead な `.c-ice-link--map .c-ice-link__more` ルールを削除する）
- Produces: `.c-ice-link.c-ice-link--map` 幅 `clamp(70px, 8.2%, 118px)`、`.c-ice-link--map .c-ice-link__label` は白プレート（背景 `rgba(255,255,255,0.86)`・濃紺太字）。Task 4 はこのラベルを `≤600px` で視覚的に隠す前提。

- [ ] **Step 1: アイコン幅を拡大**

`src/scss/object/project/_p-strategy.scss` の `.c-ice-link.c-ice-link--map` ブロック（307 行目付近）：

```scss
.c-ice-link.c-ice-link--map {
  width: clamp(46px, 5.84%, 84px);
  height: auto;
  aspect-ratio: 82 / 79;
  filter: drop-shadow(0 3px 6px rgba(0, 47, 95, 0.16));

  &:hover {
    transform: translateY(-3px);
  }
}
```

の `width` 行のみを変更：

```scss
  width: clamp(70px, 8.2%, 118px);
```

（他の行・`&:hover` は不変）

- [ ] **Step 2: inner の padding を調整**

同ファイルの `.c-ice-link--map .c-ice-link__inner` ブロック（318 行目付近）：

```scss
.c-ice-link--map .c-ice-link__inner {
  justify-content: center;
  padding: 16% 6% 6%;
  gap: 1px;
}
```

の `padding` を変更（READ MORE が消えた分ラベルを中央寄りに）：

```scss
  padding: 14% 6% 8%;
```

- [ ] **Step 3: ラベルを白プレート型に置換**

同ファイルの `.c-ice-link--map .c-ice-link__label` ブロック（324 行目付近）：

```scss
.c-ice-link--map .c-ice-link__label {
  font-size: clamp(7px, 0.62vw, 10px);
  letter-spacing: 0;
  line-height: 1.15;
  color: var(--color-text-primary);
  text-decoration: underline;
}
```

を次のブロックで丸ごと置き換える：

```scss
.c-ice-link--map .c-ice-link__label {
  font-size: clamp(10px, 0.95vw, 15px);
  font-weight: 700;
  letter-spacing: 0;
  line-height: 1.25;
  text-decoration: none;
  color: var(--color-brand-navy);
  background: rgba(255, 255, 255, 0.86);
  border-radius: 6px;
  padding: 2px 6px;
  box-shadow: 0 1px 3px rgba(0, 47, 95, 0.18);
}
```

- [ ] **Step 4: dead になった `__more` ルールを削除**

同ファイルの `.c-ice-link--map .c-ice-link__more` ブロック（332 行目付近）を**丸ごと削除**する（Task 1 で span を出力しなくなったため）：

```scss
.c-ice-link--map .c-ice-link__more {
  font-size: clamp(5px, 0.42vw, 7px);
  letter-spacing: 0.12em;
  color: var(--color-text-primary);
}
```

- [ ] **Step 5: SCSS をコンパイル**

Run:
```bash
npm run build:scss
```
Expected: エラーなく完了（exit 0）。`public/css/style.css` が更新される。

- [ ] **Step 6: 新ルールがコンパイル結果に入っていることを確認**

Run:
```bash
grep -c 'clamp(70px, 8.2%, 118px)' public/css/style.css
grep -c 'rgba(255, 255, 255, 0.86)' public/css/style.css
```
Expected: 両方 `1` 以上。

- [ ] **Step 7: 目視確認（デスクトップ＋タブレット）**

`npm run dev` を起動し、ブラウザ（または Playwright）で `http://localhost:4321/strategy/` を開き、海外展開マップを次の幅で確認：
- **1440px:** 7 つの市場名が白プレートで明瞭に読める。氷アイコンが以前より大きい。READ MORE が無い。中央バッジ・ペンギンと深刻に重ならない。
- **768px:** ラベルが読め、致命的な衝突が無い（多少のタイトさは可）。

Expected: 上記を満たす。問題があれば `width` の上限（118px）や `font-size` を微調整。

- [ ] **Step 8: コミット**

```bash
git add src/scss/object/project/_p-strategy.scss
git commit -m "$(cat <<'EOF'
feat(strategy): 地図の氷アイコンを拡大しラベルを白プレート化

幅をclamp(70px,8.2%,118px)に拡大、ラベルは半透明白プレート＋濃紺太字で
地図模様に負けず常時読めるように。dead化した__moreルールを削除。

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 3: ペンギンの「クリックしてね！」吹き出しを追加

**Files:**
- Modify: `src/pages/strategy.astro`（`.p-strategy-global__map-wrap` の最後の子として要素を追加）
- Modify: `src/scss/object/project/_p-strategy.scss`（`.c-ice-link--map` ルール群の直後に新ブロックを追加）

**Interfaces:**
- Consumes: Task 1（地図リンクは `sublabel=""` 済み）、Task 2（拡大済みアイコン）
- Produces: `.p-strategy-global__map-cue` 要素（右上・尾は上向き・`pointer-events:none`・reduced-motion 配慮の bob）。Task 4 はこの要素をスマホでも維持する。

- [ ] **Step 1: 吹き出し要素を追加**

`src/pages/strategy.astro` の `.p-strategy-global__map-wrap` 内、`globalMarkets.map(...)` ブロックの直後・`</div>`（map-wrap 閉じ）の直前に要素を追加する。Task 1 適用後の該当箇所：

```astro
                  globalMarkets.map((market) => (
                    <IceLinkButton
                      class="c-ice-link--map p-strategy-global__map-link"
                      href={`#${market.id}`}
                      label={market.title}
                      sublabel=""
                      basePath={base}
                      lazy
                      style={`left:${market.map.left}%;top:${market.map.top}%`}
                    />
                  ))
                }
              </div>
```

を次に置き換える（`}` と `</div>` の間に吹き出しを挿入）：

```astro
                  globalMarkets.map((market) => (
                    <IceLinkButton
                      class="c-ice-link--map p-strategy-global__map-link"
                      href={`#${market.id}`}
                      label={market.title}
                      sublabel=""
                      basePath={base}
                      lazy
                      style={`left:${market.map.left}%;top:${market.map.top}%`}
                    />
                  ))
                }
                <span class="p-strategy-global__map-cue" aria-hidden="true">クリックしてね！</span>
              </div>
```

- [ ] **Step 2: 吹き出しの SCSS を追加**

`src/scss/object/project/_p-strategy.scss` の `.c-ice-link--map .c-ice-link__label` ブロック（Task 2 で置換済み）の直後に、次のブロックを丸ごと追加する：

```scss
// ペンギンの操作ナビ吹き出し（右上の集団から「クリックしてね！」）
.p-strategy-global__map-cue {
  position: absolute;
  right: 19%;
  top: 1%;
  z-index: 4; // 右上の空いた海。アイコン(2)・ペンギン(3)より前面
  padding: 9px 18px;
  background: var(--color-white);
  color: var(--color-brand-navy);
  font-family: var(--font-family-base);
  font-weight: 700;
  font-size: clamp(11px, 1vw, 16px);
  line-height: 1;
  white-space: nowrap;
  border: 2px solid var(--color-brand-cyan);
  border-radius: 999px;
  box-shadow: 0 6px 14px rgba(0, 47, 95, 0.2);
  pointer-events: none;
}

// 吹き出しの尾（上向き＝ペンギン集団を指す）。シアン縁取りの三角に白の三角を重ねる
.p-strategy-global__map-cue::after {
  content: "";
  position: absolute;
  top: -9px;
  right: 26px;
  border: 9px solid transparent;
  border-top: 0;
  border-bottom-color: var(--color-brand-cyan);
}

.p-strategy-global__map-cue::before {
  content: "";
  position: absolute;
  top: -6px;
  right: 28px;
  z-index: 1;
  border: 7px solid transparent;
  border-top: 0;
  border-bottom-color: var(--color-white);
}

// 視線誘導のゆるやかなバウンド（reduced-motion では静止）
@media (prefers-reduced-motion: no-preference) {
  .p-strategy-global__map-cue {
    animation: p-strategy-cue-bob 2.4s ease-in-out infinite;
  }
}

@keyframes p-strategy-cue-bob {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-6px);
  }
}
```

- [ ] **Step 3: ビルド（SCSS ＋ Astro）**

Run:
```bash
npm run build
```
Expected: エラーなく完了（exit 0）。

- [ ] **Step 4: 吹き出しが出力に入っていることを確認**

Run:
```bash
grep -c 'p-strategy-global__map-cue' dist/strategy/index.html
grep -c 'p-strategy-cue-bob' public/css/style.css
```
Expected: 両方 `1` 以上。

- [ ] **Step 5: 目視確認（デスクトップ）**

`http://localhost:4321/strategy/`（dev サーバ）または `dist/` を 1440px で確認：
- 右上のペンギン集団の直下に「クリックしてね！」の白い角丸吹き出しが見える。
- 尾が上向きでペンギンを指している。
- 吹き出しが海の空き領域にあり、アイコン・バッジと重ならない。
- reduced-motion 無効環境ではゆっくり上下に揺れる。

Expected: 上記を満たす。位置がずれる場合は `right` / `top` を微調整。

- [ ] **Step 6: コミット**

```bash
git add src/pages/strategy.astro src/scss/object/project/_p-strategy.scss
git commit -m "$(cat <<'EOF'
feat(strategy): 地図にペンギンの「クリックしてね！」吹き出しを追加

右上のペンギン集団から吹き出しで操作を誘導。READ MOREの代替。
reduced-motion配慮のゆるやかなbobつき。

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 4: スマホ（≤600px）はアイコンのみにする

**Files:**
- Modify: `src/scss/object/project/_p-strategy.scss`（既存の `@media screen and (max-width: 600px)` ブロック内に追記、557 行目付近）

**Interfaces:**
- Consumes: Task 2（`.c-ice-link.c-ice-link--map` の幅とラベルプレート）、Task 3（吹き出し）
- Produces: `≤600px` でラベルを視覚的に隠し（`<a>` のアクセシブルネームは保持）、アイコンを `clamp(44px, 13%, 60px)` に縮小。吹き出しは維持。

- [ ] **Step 1: 600px メディアクエリにスマホ用ルールを追記**

`src/scss/object/project/_p-strategy.scss` の `@media screen and (max-width: 600px) {` ブロックの**末尾（閉じ `}` の直前）**に、次のルールを追加する：

```scss
  // 海外展開マップ：スマホはアイコンのみ（市場名は地図直下のカードが担う）
  // 幅は base の .c-ice-link.c-ice-link--map(0-2-0) と同特異度＋後勝ちで上書き
  .c-ice-link.c-ice-link--map {
    width: clamp(44px, 13%, 60px);
  }

  // ラベルは視覚的に隠すが、<a> のアクセシブルネームとして DOM には残す（sr-only 相当）
  .c-ice-link--map .c-ice-link__label {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
    border: 0;
    background: none;
    box-shadow: none;
  }
```

- [ ] **Step 2: SCSS をコンパイル**

Run:
```bash
npm run build:scss
```
Expected: エラーなく完了（exit 0）。

- [ ] **Step 3: スマホ用ルールがコンパイル結果に入っていることを確認**

Run:
```bash
grep -c 'clamp(44px, 13%, 60px)' public/css/style.css
```
Expected: `1` 以上。

- [ ] **Step 4: 目視確認（スマホ）**

`http://localhost:4321/strategy/` を **390px** で確認：
- 氷アイコンは表示されるが**市場名テキストは見えない**（アイコンのみ）。
- アイコン同士・中央バッジが**衝突していない**。
- 吹き出し「クリックしてね！」は表示されている。
- アイコンをタップすると対応する市場カードへスクロールする（アンカー動作）。

Expected: 上記を満たす。

- [ ] **Step 5: アクセシブルネーム保持の確認**

ブラウザの devtools か Playwright で地図リンクのアクセシブルネームを確認（例：先頭リンクが「アメリカ市場」を保持）。

Run（Playwright を使う場合の例）:
```js
// 390px で評価
() => document.querySelector('.c-ice-link--map')?.textContent.trim()
```
Expected: 市場名（例 `アメリカ市場`）が返る（視覚的に隠れていても DOM に存在）。

- [ ] **Step 6: コミット**

```bash
git add src/scss/object/project/_p-strategy.scss
git commit -m "$(cat <<'EOF'
feat(strategy): スマホの地図をアイコンのみ表示にする

≤600pxではラベルを視覚的に隠し(アクセシブルネームは保持)、
アイコンを縮小して衝突を回避。市場名は直下のカードが担う。

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Final Verification（全タスク後）

- [ ] **本番相当ビルドが通る**

Run:
```bash
npm run build
```
Expected: exit 0。`dist/` が生成される。

- [ ] **3 ブレークポイントの最終目視**
  - 1440px: ラベル可読・アイコン拡大・吹き出し・READ MORE 無し。
  - 768px: ラベル可読・致命的衝突無し。
  - 390px: アイコンのみ・衝突無し・吹き出しあり・タップでカードへ。

- [ ] **リグレッション**: special 系ページの `.c-ice-link` が従来どおり READ MORE を表示する（`grep -rl 'READ MORE' dist/special/`）。

- [ ] **ハンドオフ整合**: `dist/strategy/index.html` に `data-astro-cid-` が増えていない（scoped CSS を入れていない）こと、`c-ice-link__more` が strategy 出力に無いこと。

---

## Notes

- このリポジトリにテストランナーは無い（CLAUDE.md）。各タスクの「テスト」は SCSS コンパイル成功 ＋ 出力 grep ＋ 目視。
- 目視には `npm run dev`（`localhost:4321`）が手軽。`dist/` を直接見る場合は一旦 `npm run build` してから静的サーバ（例 `cd dist && python3 -m http.server <port>`）で配信し、相対パスを解決する。
- 数値（`right: 19%` / `top: 1%` / `width` 上限など）はプロトタイプ実測の目安。最終目視で違和感があれば spec の意図（重ならない・読める・尾がペンギンを指す）を満たす範囲で微調整してよい。
