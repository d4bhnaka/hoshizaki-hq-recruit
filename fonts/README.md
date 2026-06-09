# fonts/ — セルフホスト Web フォントのソースと再生成

このサイトは Web フォントを **Google Fonts からセルフホストへ移行**済み。配信される
woff2 と `@font-face` 定義（`public/fonts/`・`public/css/fonts.css`）は、このフォルダ
のソースから **自動生成** される。手で編集しないこと。

## 使用フォント

| ファミリー | 用途（CSS変数） | 方式 | 配信先 |
|---|---|---|---|
| **Barlow Condensed** | `--font-family-en` / `--font-family-display` | フルセット 8 ウェイト（100/200/400/500/600/700/800/900） | `public/fonts/barlow-condensed/*.woff2` |
| **Noto Sans JP** | `--font-family-base` | unicode-range 分割 124 チャンク（可変フォント・全ウェイト収録） | `public/fonts/noto-sans-jp/*.woff2` |

Noto Sans JP は CJK で数 MB あるため、丸ごと配信せず Google Fonts と同じ
`unicode-range` 分割方式を自前再現している。ブラウザはページのテキストに必要な
チャンクだけをダウンロードする（全 124 個ではなく、トップページで約 30 個）。

## このフォルダの中身

```
fonts/
├── README.md                 ← これ
├── regenerate.py             ← 再生成スクリプト（下記）
├── noto-sans-jp.google.css   ← unicode-range の定義元（Google css2 の出力。決定性のため固定）
└── src/                      ← ダウンロードしたソースフォント（OFL）
    ├── BarlowCondensed-*.ttf
    └── NotoSansJP[wght].ttf  ← 可変フォント
```

ソース取得元（= Google Fonts の「Download family」と同一実体）:
`https://github.com/google/fonts` の `ofl/barlowcondensed` と `ofl/notosansjp`。

## 再生成

```sh
# リポジトリ直下で
python3 fonts/regenerate.py
```

これで `public/fonts/**` と `public/css/fonts.css` を再生成する。出力はバイト単位で
決定的（再実行しても差分ゼロ）。前提:

- グローバルスキル **webfont-selfhost**（`~/.claude/skills/webfont-selfhost/`）
- `pip install fonttools brotli`

ウェイトを増減したい・別フォントに差し替えたい場合は:
1. `fonts/src/` のソースを差し替え
2. ウェイト構成を変えるなら `fonts/regenerate.py` の `BARLOW` と、
   Layout の参照、`fonts/noto-sans-jp.google.css`（Google から再取得）を更新
3. `python3 fonts/regenerate.py` → `npm run build`

`fonts/noto-sans-jp.google.css` の再取得方法は `regenerate.py` 冒頭コメント参照
（近代的な User-Agent が必須）。

## ライセンス

Barlow Condensed・Noto Sans JP とも **SIL Open Font License 1.1**。OFL は woff2 への
変換・サブセット・セルフホストを許可する。`name` テーブルの著作権表記は変換時に保持
している。
