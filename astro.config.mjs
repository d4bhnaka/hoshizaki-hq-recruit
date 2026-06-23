// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import { execSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

// 本番ビルド (BUILD_ENV=production) かどうか
// 本番のみ sitemap を生成し、site URL を埋め込む
const isProduction = process.env.BUILD_ENV === "production";
const siteUrl = process.env.SITE_URL;

if (isProduction && !siteUrl) {
  throw new Error(
    "本番ビルドでは SITE_URL 環境変数が必須です（例: SITE_URL=https://recruit.example.com/）"
  );
}

const projectRoot = dirname(fileURLToPath(import.meta.url));

// URL pathname (例 "/job/", "/special/crosstalk/") から
// 対応する src/pages 配下の .astro ファイルを最終コミット日時で取得
/** @param {string} pathname */
function getLastModFromGit(pathname) {
  const route = pathname.replace(/^\/|\/$/g, "");
  const candidates = route
    ? [`src/pages/${route}.astro`, `src/pages/${route}/index.astro`]
    : ["src/pages/index.astro"];

  const filePath = candidates.find((p) => existsSync(resolve(projectRoot, p)));
  if (!filePath) return null;

  try {
    const iso = execSync(`git log -1 --format=%cI -- "${filePath}"`, {
      cwd: projectRoot,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
    return iso || null;
  } catch {
    return null;
  }
}

// @astrojs/sitemap はサイトマップ index（sitemap-index.xml）の子参照を
// site の「ホスト部分」だけから生成するため、サブディレクトリ配置だと
// <loc>https://host/sitemap-0.xml</loc> のように /saiyou/ が欠落して 404 になる。
// serialize() は各 URL 単位（sitemap-0.xml の中身）にしか効かず index には届かないので、
// ビルド後に index 内の子サイトマップ参照を site のフルURL（パス込み）へ書き換える。
/** @param {string} site フルURL（例 https://www.hoshizaki.co.jp/saiyou/） */
function fixSitemapIndex(site) {
  const base = site.replace(/\/$/, "");
  return {
    name: "fix-sitemap-index",
    hooks: {
      /** @param {{ dir: URL, logger: { info: (m: string) => void } }} ctx */
      "astro:build:done"({ dir, logger }) {
        const indexPath = fileURLToPath(new URL("sitemap-index.xml", dir));
        if (!existsSync(indexPath)) return;
        const before = readFileSync(indexPath, "utf8");
        const after = before.replace(
          /<loc>[^<]*?(sitemap-[\w-]+\.xml)<\/loc>/g,
          (_, file) => `<loc>${base}/${file}</loc>`
        );
        if (after !== before) {
          writeFileSync(indexPath, after);
          logger.info(`sitemap-index.xml の子サイトマップ参照を ${base}/ に修正`);
        }
      },
    },
  };
}

// https://astro.build/config
export default defineConfig({
  // 本番ビルド時のみ site を設定（sitemap.xml に絶対URLを埋め込むため）
  ...(isProduction && siteUrl ? { site: siteUrl } : {}),
  // 相対パスで出力（サブディレクトリ配置対応）
  base: "./",
  server: {
    port: 3380,
  },
  integrations:
    isProduction && siteUrl
      ? [
          // @astrojs/sitemap は site のホスト部分しか使わないため、
          // サブディレクトリ配置の場合は serialize で site のフルURL（パス込み）に置換する
          sitemap({
            serialize(item) {
              const pathname = new URL(item.url).pathname;
              const path = pathname.replace(/^\//, "");
              const lastmod = getLastModFromGit(pathname);
              return {
                ...item,
                url: new URL(path, siteUrl).toString(),
                ...(lastmod ? { lastmod } : {}),
              };
            },
          }),
          // sitemap の後に実行し、生成済み sitemap-index.xml を後処理する
          fixSitemapIndex(siteUrl),
        ]
      : [],
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
