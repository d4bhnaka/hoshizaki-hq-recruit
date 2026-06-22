# コース詳細タイトルの全幅 sticky バー化 — 設計

- 対象ページ: インターンシップ（[src/pages/internship.astro](../../../src/pages/internship.astro)）
- 作成日: 2026-06-23

## 背景・課題

COURSE セクションのカード（「詳細を見る」）をクリックすると、下部の
`.p-course-details` 内の該当パネルがその場で差し替わる。しかし、

1. 選択中コースを示す `.p-course-detail__pill` の文字が小さく
   （`font-size: clamp(13px, 1.2vw, 16px)`）、左寄せの小さなピルのため、
   詳細を読み下げている最中に「今どのコースを見ているか」が分かりにくい。
2. カードクリック時にスクロールしないため、「選んだ → 詳細が出た」という
   動線が伝わりにくい。

## ゴール

- コースタイトルを大きく見せ、複数行折り返しを許容する。
- タイトルを**全幅バー**として、コース詳細（POINT〜VOICES）をスクロールする
  間だけ上部に sticky 固定する。詳細パネルを抜けたら解除する。
- カードクリック時、選択した詳細の先頭（バー）が見える位置へスムーズスクロール
  し、動線を明確にする。

ユーザー確認済みの決定:
- 固定時の見せ方 = **全幅バー**（左寄せ大きめピルではなく）。
- カードクリック時 = **詳細へ自動スクロールする**。

## 変更方針（3ファイル・HTML マークアップ変更なし）

### 1. 全幅 sticky バー（[src/scss/object/project/_p-internship.scss](../../../src/scss/object/project/_p-internship.scss)）

既存マークアップ（[CourseDetail.astro:48-50](../../../src/components/CourseDetail.astro#L48-L50)）を
そのまま使い、2クラスの役割を入れ替える。

- `.p-course-detail__pillwrap` → **全幅バー本体**
  - `position: sticky;`
  - `top: clamp(72px, 9vw, 100px);`（透過 fixed ヘッダーのロゴ／CTA を避ける高さ。ビルド後に微調整可）
  - `width: 100%;`（`.p-course-detail` 全幅 = ビューポート全幅）
  - 背景 `var(--ip-blue)`（#3e96bc。セクション背景 #82c7e4 に対しコントラストを確保）
  - 上下パディング（例: `clamp(14px, 1.8vw, 22px)`）
  - `z-index`（ヘッダーの `z-index: 20` より小さい値。例: 5）
  - 下方向に軽い影（バーと本文の分離。例: `box-shadow: 0 6px 16px rgba(0,0,0,.12)`）

- `.p-course-detail__pill` → **バー内側の見出しテキスト**
  - `max-width: min(1240px, 100% - var(--ip-gutter) * 2);`（旧 `__pillwrap` の制約を移設）
  - `margin-inline: auto;`（中央寄せ）
  - `padding-inline: var(--ip-gutter);`
  - 色 `var(--color-white)`、`font-weight: 700`
  - `font-size: clamp(16px, 2.2vw, 26px);`
  - `line-height: 1.4;`（長いタイトルは自然に複数行折り返し）
  - ピル背景・`border-radius` は撤去（バー側が背景を持つため）

sticky の封じ込めは各 `.p-course-detail` パネルが担う。よって詳細
（POINT〜VOICES）をスクロールする間だけ上部固定され、パネル末尾で自然に解除
され、MESSAGE 以降では表示されない。「コース詳細の部分では固定」の要件に一致。

### 2. overflow の修正（同 SCSS、`.p-internship`）

[.p-internship](../../../src/scss/object/project/_p-internship.scss#L17) の
`overflow: hidden` を **`overflow-x: clip`** に変更する。

- 理由: `overflow: hidden` 祖先は縦スクロールコンテナを生成し、子孫の
  `position: sticky` がビューポートに対して固定されなくなる（sticky が効かない）。
- `overflow-x: clip` は横方向のはみ出し（penguins／100vw 全幅セクションの負マージン）
  のクリップを維持しつつ、縦スクロールコンテナを作らないため sticky が有効になる。
- 既存コメント（同 SCSS の「負マージンと 100vw のはみ出しは overflow:hidden が
  クリップする」）に合わせ、コメントも更新する。
- 対応ブラウザ: `overflow: clip` は Safari 16+ / 近年の Chrome・Firefox。
  2026 年のハンドオフ要件として問題なし。

### 3. カードクリック時の自動スクロール（[public/js/main.js](../../../public/js/main.js)）

[selectCourse](../../../public/js/main.js#L151) でパネル差し替えが終わった後、
選択された `.p-course-detail` の `__pillwrap`（バー）上端がヘッダー直下に来るよう
`window.scrollTo` でスクロールする。

- スクロール先 = `バー上端の絶対 Y - sticky オフセット`。
  オフセットは `getComputedStyle(pillwrap).top` を読んで CSS と共有し、二重管理を避ける。
- `prefers-reduced-motion: reduce` 時は `behavior: "auto"`（既存
  [initCourseBackToTop](../../../public/js/main.js#L201) と同方針）。
- 既存の「コース一覧へ戻る」フロートボタンとは独立して共存する。
- 既に選択中のカードを再クリックした場合もスクロールする（詳細へのジャンプとして有効）。

## 影響範囲

- 変更ファイル: `_p-internship.scss`、`public/js/main.js`、（overflow 1 行は同 SCSS 内）。
- HTML・Astro コンポーネントのマークアップ変更なし。
- ビルド: `npm run build:scss` で `public/css/style.css` を再生成。

## 確認観点（実装後）

- カードクリックで詳細先頭へスムーズスクロールし、全幅バーが見える。
- 詳細をスクロール中、バーが上部に固定され、現在のコース名が常に見える。
- 詳細パネル末尾（VOICES の後）でバーが解除され、MESSAGE では消える。
- 透過ヘッダーのロゴ／CTA とバーが重ならない。
- penguins・全幅セクションの横はみ出しが従来どおりクリップされている
  （overflow 変更によるレイアウト崩れがない）。
- `prefers-reduced-motion` 環境で瞬間移動スクロールになる。
