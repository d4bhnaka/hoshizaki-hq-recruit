# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Primary source of truth: `docs/`

**Before starting any implementation work, read [docs/README.md](docs/README.md) and [docs/05-workflow-for-claude.md](docs/05-workflow-for-claude.md).** The `docs/` folder is the canonical source for the project plan, environment rationale, top-page spec, and task progress. Keep docs in sync with code — when requirements change, update the relevant doc *before* the code.

Reading order for a fresh session:
1. This file (CLAUDE.md) — repo-wide guardrails.
2. [docs/README.md](docs/README.md) — docs index.
3. [docs/05-workflow-for-claude.md](docs/05-workflow-for-claude.md) — Claude's work protocol.
4. [docs/02-environment.md](docs/02-environment.md) — non-negotiable build constraints.
5. The relevant spec (currently [docs/03-spec-top-page.md](docs/03-spec-top-page.md)).
6. [docs/04-progress.md](docs/04-progress.md) — pick up the next task and update its status.

## Project

ホシザキ本社採用サイト — static site built with Astro. The build output is intended to be handed to a client who will edit the generated HTML/CSS/JS directly and deploy it via FTP into an arbitrary subdirectory on their server. That handoff constraint drives most of the unusual configuration in this repo.

## Commands

- `npm run dev` — Astro dev server at `localhost:4321`
- `npm run build:scss` — compile `src/scss/style.scss` → `public/css/style.css` (expanded, no source map)
- `npm run watch:scss` — same, with file watching
- `npm run build` — full production build: runs `build:scss`, then `astro build`, then runs `js-beautify` over every `*.html` in `dist/` to re-indent them. SCSS must be compiled before Astro builds because `public/css/style.css` is served as-is.
- `npm run preview` — preview the built `dist/` locally

There is no lint, typecheck, or test setup. `tsconfig.json` extends Astro's strict config but nothing runs it.

## Build-output constraints (non-negotiable)

The client edits the output, so the build is tuned for **human-readable, hash-free, fully-relative** output. Changes that break any of these will break the handoff:

- **Relative paths everywhere** — `astro.config.mjs` sets `base: "./"` so the site works from any subdirectory. The root page references `./css/style.css`; subpages reference `../css/style.css`. `Layout.astro` accepts a `basePath` prop (default `"./"`) — **every page under `src/pages/` that isn't the index must pass `basePath="../"`** (or deeper) to the layout. See [src/pages/about.astro](src/pages/about.astro) and [src/layouts/Layout.astro](src/layouts/Layout.astro).
- **No hashing** — asset/entry/chunk filenames are pinned via `rollupOptions.output` in [astro.config.mjs](astro.config.mjs).
- **No minification, no compression** — `vite.build.minify: false`, `cssMinify: false`, `compressHTML: false`, plus the post-build `js-beautify` pass. JS/CSS/HTML must remain readable in `dist/`.
- **Directory-format pages** — `build.format: "directory"` produces `/about/index.html` (accessible as `/about/`).
- **External stylesheets only** — `build.inlineStylesheets: "never"`.
- **No Astro scoped CSS** — Astro's scoped CSS adds `data-astro-cid-*` attributes to HTML, which would leak into the handoff. Do **not** use `<style>` blocks inside `.astro` components. All styling lives in `src/scss/`.

## CSS architecture (FLOCSS)

All styles live under `src/scss/` and compile to a single `public/css/style.css`. Entry: [src/scss/style.scss](src/scss/style.scss).

- `foundation/` — variables (CSS custom properties only — no Sass variables/mixins), reset, base element styles
- `layout/` — `l-*` classes (`.l-container`, `.l-main`, `.l-background`)
- `object/component/` — reusable `c-*` classes (`.c-box`, `.c-button`)
- `object/project/` — page/section-specific `p-*` classes (`.p-hero`, `.p-news`, `.p-about`, …)
- `object/utility/` — `u-*` classes (currently empty)

**Use CSS custom properties, not Sass variables.** Variables are defined on `:root` in `foundation/_variables.scss` and consumed via `var(--name)`. Keep the class-prefix discipline (`l-`, `c-`, `p-`, `u-`) — it's what tells a future reader which layer something belongs to.

When adding a new SCSS partial, remember to register it with `@use` in `src/scss/style.scss` — it's not auto-discovered.

## Adding a new page

1. Create `src/pages/<name>.astro`.
2. Import the layout and pass the correct `basePath` for the depth (`"../"` for one-level pages).
3. If the page needs new styles, add `src/scss/object/project/_p-<name>.scss` and register it in `style.scss`.

## Image assets

All image assets live under `public/images/` and are served as-is (no hashing, no processing).

- `public/images/common/` — images shared across multiple pages (logo, header/footer artwork, common icons, etc.)
- `public/images/<page-id>/` — images used only on a single page. The directory name matches the page id (e.g. `top/`, `environment/`, `message/`, `person/`, `job/`, `fact/`, `requirement/`, `special/`, `strategy/`).

When adding a new page-specific image, place it in the matching page-id directory; create a new `<page-id>/` folder if one doesn't exist yet. Reference images with relative paths consistent with the page's depth (e.g. `./images/common/logo.svg` from the index, `../images/common/logo.svg` from a subpage).
