# Mikrouli Remaining Dependency Majors

> Research snapshot: 2026-08-22
> Scope: package upgrades that remain after the completed SemVer-compatible update pass
> Audience: local GitHub Copilot coding agent

## Objective

Upgrade remaining independent major-version dependencies without mixing them into the SvelteKit 3, Sharp, Playwright, or full TypeScript-source migrations.

The latest project baseline already contains the semver-safe updates. Do not run a blanket `bun update --latest` and debug all majors at once.

## Current relevant baseline

```text
marked                         ^17.0.6
marked-gfm-heading-id          ^4.1.4
schema-dts                     ^1.1.5
svelte-sitemap                 ^2.8.0
@tailwindcss/language-server   ^0.14.29
vite-plugin-browser-sync       ^6.0.0
```

At the research snapshot:

- Marked latest stable: **18.0.10**.
- `schema-dts` latest stable: **2.0.0**.
- `svelte-sitemap` latest stable: **4.0.4**.
- Tailwind language server latest stable: **0.16.0**.
- `vite-plugin-browser-sync` latest stable: **7.0.0**, explicitly supporting Vite 7 and 8.

Re-check `latest` immediately before implementation.

---

## Batch 1 — Marked 17 -> 18

### Why this is a real major

Marked 18.0.0 changed token whitespace behavior. Its documented breaking change trims trailing blank lines from block tokens. The release also moved Marked's own TypeScript development baseline to TypeScript 6, but that does not itself require Mikrouli source to be TypeScript.

Mikrouli also depends on `marked-gfm-heading-id`, so the migration must verify the extension's behavior rather than only checking that `marked.parse()` still returns HTML.

### Stability decision

Bun 1.4 now includes `Bun.markdown`, including GFM and heading IDs, but the Bun Markdown API is explicitly **unstable** as of this research snapshot. Mikrouli values stability, so do **not** replace Marked with Bun Markdown in this modernization pass.

A Bun Markdown replacement can be a future prototype after the API becomes stable.

### Implementation batch

1. Inventory all `marked` and `marked-gfm-heading-id` imports/usages.
2. Capture representative Markdown fixtures from actual Contentful-generated content, including:
   - headings and generated IDs;
   - multiple blank lines;
   - paragraphs adjacent to headings;
   - lists;
   - links;
   - emphasis;
   - GFM content if currently used;
   - raw HTML/shortcodes if they pass through this parsing stage.
3. Snapshot the current generated HTML for those fixtures.
4. Upgrade only Marked:

```bash
bun add -d marked@latest
```

5. Keep `marked-gfm-heading-id` unchanged unless its peer/API compatibility requires otherwise.
6. Re-run the snapshots and inspect intentional whitespace/token differences.
7. Run the core project validation gate.

### Acceptance criteria

- No changed heading IDs.
- No changed links or HTML structure that affects styling/SEO.
- Contentful-generated pages render equivalently.
- Any whitespace-only differences are understood and harmless.
- No unrelated dependencies are upgraded in this batch.

---

## Batch 2 — `schema-dts` 1 -> 2

### Relevant changes

`schema-dts` 2.0.0 moves the generated vocabulary to newer Schema.org data and introduces type-level changes, including refactoring shared leaf types and `MergeLeafTypes`. This package is primarily compile-time typing, so the main migration risk is type-shape breakage rather than runtime behavior.

### Implementation batch

1. Inventory every `schema-dts` import and every JSON-LD object typed from it.
2. Save current representative rendered JSON-LD from:
   - the homepage;
   - service pages;
   - blog/content pages;
   - any person/organization/local-business schema currently emitted.
3. Upgrade only this package:

```bash
bun add -d schema-dts@latest
```

4. Fix type errors by adapting to the v2 public types. Do not weaken structured-data typing to `any` or broad casts to silence errors.
5. Compare rendered JSON-LD before/after. A type package upgrade should not create unintended runtime JSON changes unless an existing schema shape was invalid and is intentionally corrected.
6. Validate generated pages with the existing build and, when practical, a structured-data validator.

### Acceptance criteria

- `svelte-check` is clean.
- Existing structured-data semantics are preserved or consciously corrected.
- No JSON-LD fields disappear merely to satisfy a new type.
- Runtime output changes are documented if necessary.

---

## Batch 3 — Tailwind language server: remove if unused

Current project dependency:

```text
@tailwindcss/language-server ^0.14.29
```

The package is an LSP server primarily intended for editor/IDE integration. Its own npm documentation shows global/editor-style installation and `tailwindcss-language-server --stdio` usage. No current `package.json` script invokes it.

### Preferred decision

Do not automatically upgrade it just because 0.16.0 exists. First determine whether the repository itself needs it.

### Implementation batch

1. Search the repository for:

```text
@tailwindcss/language-server
tailwindcss-language-server
```

including editor configs, scripts, CI, and documentation.
2. If no repository-owned tooling launches it, remove the dependency:

```bash
bun remove @tailwindcss/language-server
```

3. Confirm Tailwind IntelliSense still works through the developer's IDE/plugin setup where relevant.
4. If repository tooling truly requires the binary, upgrade it independently instead:

```bash
bun add -d @tailwindcss/language-server@latest
```

### Acceptance criteria

- No project script/CI/editor config is broken.
- Tailwind build behavior is unchanged; this package is not the Tailwind compiler.

---

## Deferred major — `svelte-sitemap` 2 -> 4

Do **not** implement this before the SvelteKit 3/Vite 8 migration unless there is a specific reason.

### Why defer it

Mikrouli currently generates the sitemap through a postbuild helper/CLI flow. `svelte-sitemap` 4 recommends migrating to its Vite plugin:

```js
import { svelteSitemap } from 'svelte-sitemap/vite';
```

The CLI/CLI flags are now a legacy/deprecated path. Because SvelteKit 3 itself moves SvelteKit configuration into `vite.config`, doing the sitemap migration first would cause two rounds of Vite configuration churn.

### Required behavior to preserve

Mikrouli has target-specific output:

- staging build directory and staging origin/domain;
- production build directory and `https://mikrouli.org`;
- sitemap generated after static HTML exists.

Version 4 supports both `domain` and `outDir`, so configure them from the same `DEPLOY_TARGET` source used by the rest of the build.

### Later implementation batch

After SvelteKit 3/Vite 8 is green:

1. Upgrade:

```bash
bun add -d svelte-sitemap@latest
```

2. Add `svelteSitemap(...)` to the existing Vite plugin list.
3. Pass target-aware `domain` and `outDir` values.
4. Remove the old `postbuild`/`postbuild:prod` sitemap hooks and sitemap helper **only after** both target outputs match.
5. Compare generated sitemap URLs for staging and production.

### Acceptance criteria

- Sitemap is generated on both build variants.
- Production URLs use `https://mikrouli.org`.
- Staging URLs use the intended GitHub Pages origin/base behavior.
- No duplicate `/mikrouli` segment.
- Old helper and scripts are removed only when unused.

---

## Coupled major — `vite-plugin-browser-sync` 6 -> 7

Do not upgrade this independently. Version 7 explicitly supports Vite 7/8 and belongs to the SvelteKit 3 + Vite 8 cluster.

See: [`02-sveltekit-3-vite-8.md`](./02-sveltekit-3-vite-8.md).

---

## Validation after each independent major

```bash
bun install --frozen-lockfile
bun run check:all
bun run build
bun run build:prod
```

For Marked/schema output changes, also inspect representative generated pages. Do not rely on a successful bundler exit alone.

## Research sources

- Marked releases: https://github.com/markedjs/marked/releases
- Marked npm: https://www.npmjs.com/package/marked
- Bun Markdown (future/unstable alternative): https://bun.com/docs/runtime/markdown
- `schema-dts` releases: https://github.com/google/schema-dts/releases
- `schema-dts` npm: https://www.npmjs.com/package/schema-dts
- `svelte-sitemap` v4 docs: https://www.npmjs.com/package/svelte-sitemap
- Tailwind language server: https://www.npmjs.com/package/@tailwindcss/language-server
- BrowserSync Vite plugin 7: https://www.npmjs.com/package/vite-plugin-browser-sync
