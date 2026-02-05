// @ts-check
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  // 相対パスで出力（サブディレクトリ配置対応）
  base: "./",
  build: {
    // アセット名のハッシュ化を無効化
    assets: "assets",
    // インライン化の閾値を0に（すべて外部ファイルとして出力）
    inlineStylesheets: "never",
    // ページをディレクトリ形式で出力（/about/index.html）
    format: "directory",
  },
  vite: {
    build: {
      // JS/CSSの圧縮を無効化
      minify: false,
      cssMinify: false,
      rollupOptions: {
        output: {
          // ハッシュなしのファイル名
          entryFileNames: "assets/[name].js",
          chunkFileNames: "assets/[name].js",
          assetFileNames: "assets/[name][extname]",
        },
      },
    },
  },
  compressHTML: false,
});
