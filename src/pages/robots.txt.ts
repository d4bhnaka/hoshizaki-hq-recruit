import type { APIRoute } from "astro";

const isProduction = process.env.BUILD_ENV === "production";
const siteUrl = process.env.SITE_URL ?? "";

export const GET: APIRoute = () => {
  const body = isProduction && siteUrl
    ? `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl.replace(/\/$/, "")}/sitemap-index.xml\n`
    : `User-agent: *\nDisallow: /\n`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
