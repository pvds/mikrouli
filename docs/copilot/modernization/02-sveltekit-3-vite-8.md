# Mikrouli SvelteKit 3 + Vite 8 Migration

> Research snapshot: 2026-08-22
> Target: latest **published** SvelteKit 3 prerelease (`@next`) plus stable compatible dependencies
> Audience: local GitHub Copilot coding agent

## Objective

Move Mikrouli from the latest SvelteKit 2 baseline to the newest published SvelteKit 3 prerelease while preserving its static-site architecture, staging/production behavior, accessibility checks, and performance checks.

This migration is intentionally a **coupled framework cluster**. Do not mix it with the full JavaScript/JSDoc -> TypeScript source refactor, Sharp replacement, sitemap v4 integration, or Bun.WebView prototype.

## Current baseline

```text
@sveltejs/kit                 ^2.70.3
@sveltejs/adapter-static      ^3.0.10
@sveltejs/vite-plugin-svelte  ^6.2.4
svelte                        ^5.56.10
typescript                    ^5.9.3
svelte-check                  ^4.7.6
vite                          npm:rolldown-vite@^7.3.1
vite-plugin-browser-sync      ^6.0.0
```

Current Vite config contains only BrowserSync, SvelteKit, and Tailwind plugins. Current SvelteKit configuration lives under the `kit` property of `svelte.config.js` and includes adapter-static, paths, prerender behavior, environment prefixes, aliases, service-worker registration, and CSP.

## Target dependency family

At implementation time, resolve the actual published versions rather than copying prerelease numbers from this research snapshot.

Use conceptually:

```bash
bun add -d \
  @sveltejs/kit@next \
  @sveltejs/adapter-static@next \
  @sveltejs/vite-plugin-svelte@latest \
  vite@latest \
  vite-plugin-browser-sync@latest \
  typescript@~6
```

### Important prerelease rule

The SvelteKit `version-3` GitHub branch can be ahead of npm. During this research the branch showed `3.0.0-next.25`, while npm publication lagged behind it. **Install `@sveltejs/kit@next`, not an unpublished GitHub version.**

## Confirmed SvelteKit 3 dependency floor

The current v3 development package/config establishes these relevant requirements:

- Svelte `^5.56.4` or newer — current Mikrouli Svelte already satisfies this.
- `@sveltejs/vite-plugin-svelte` `^7`.
- Vite `^8.0.12` or newer compatible v8.
- TypeScript `^6` when TypeScript is installed.
- modern Node 22+; Mikrouli's Node 26 engine is sufficient.
- Kit-3-compatible `adapter-static` 4 prerelease.

## Highest-impact breaking change: configuration moves into Vite

SvelteKit 3 rejects SvelteKit options nested under a `kit` namespace and instructs users to pass them directly to the `sveltekit(...)` Vite plugin.

Current shape:

```js
// svelte.config.js
export default {
  kit: {
    adapter: ...,
    paths: ...,
    prerender: ...,
    // ...
  }
};

// vite.config.js
sveltekit()
```

Target architectural shape:

```js
// vite.config.js
sveltekit({
  adapter: ...,
  paths: ...,
  prerender: ...,
  // ...
})
```

Do not blindly paste the old `kit` object. Several options changed or disappeared, and aliases need a separate standards-based migration.

Since Mikrouli currently has no non-Kit Svelte compiler/preprocessor configuration in `svelte.config.js`, expect that file may become unnecessary after migration. Verify with `svelte-kit sync`, `svelte-check`, dev, and builds before deleting it.

`svelte-check` 4.6+ can discover Svelte configuration from Vite config, which supports this direction.

## Breaking change: `prerender.origin` -> `paths.origin`

Current Mikrouli behavior:

```js
prerender: {
  origin: production
    ? "https://mikrouli.org"
    : "https://pvds.github.io"
}
```

SvelteKit 3 explicitly removes `prerender.origin` in favor of `paths.origin`.

Target concept:

```js
paths: {
  base: production ? "" : "/mikrouli",
  origin: production
    ? "https://mikrouli.org"
    : "https://pvds.github.io",
  relative: false
}
```

Keep `prerender.handleHttpError` in the prerender section.

## Breaking/deprecation direction: `$lib` -> `#lib`

The Svelte CLI's Kit 3 migration now replaces `$lib` imports with `#lib`, and Kit 3 removes the old configurable `files.lib` model. The Kit 3 configuration validator also deprecates `alias` in favor of subpath imports.

### Mikrouli decision

Migrate the project-specific aliases to standards-based package subpath imports too:

```text
$lib      -> #lib
$config   -> #config
$data     -> #data
$global   -> #global
$layout   -> #layout
$ui       -> #ui
$visuals  -> #visuals
$types    -> #types
$util     -> #util
```

Use `package.json#imports`, not another framework-specific alias layer.

### Implementation caution

Do not invent the final import map from this document. First inventory every current alias use and whether it references:

- a single file (`src/config.js`);
- a directory subtree;
- `.svelte` files;
- JavaScript modules with explicit or omitted extensions;
- scripts outside `src` (`$util`).

Kit 3's prerelease changes around `#lib` include stricter module-resolution behavior and explicit extension requirements. Prefer explicit file extensions in imports where required by the final published migration tooling.

A likely package-import shape is conceptually:

```json
{
  "imports": {
    "#config": "./src/config.js",
    "#data/*": "./src/data/*",
    "#global/*": "./src/lib/components/global/*",
    "#layout/*": "./src/lib/components/layout/*",
    "#ui/*": "./src/lib/components/ui/*",
    "#visuals/*": "./src/lib/components/visuals/*",
    "#types/*": "./src/lib/types/*",
    "#util/*": "./scripts/util/*"
  }
}
```

Treat this as an architectural example only; generate the exact map from real imports and test it through Bun, Vite, SvelteKit, and `svelte-check`.

## TypeScript configuration change for Kit 3

The Svelte CLI's current Kit 3 work generates projects whose ts/js config extends `$app/tsconfig` rather than the old `./.svelte-kit/tsconfig.json` path.

Mikrouli currently uses a strict `jsconfig.json` with:

```text
allowJs: true
checkJs: true
strict: true
moduleResolution: bundler
```

For this framework migration:

1. Upgrade the TypeScript dependency to stable TypeScript 6 because Kit 3 requires it.
2. Keep the source in JavaScript/JSDoc.
3. Adapt `jsconfig.json` to the Kit 3-generated config model.
4. Resolve TypeScript 6 config/default changes explicitly instead of hiding them with broad suppressions.
5. Do **not** start converting `.js` or `<script>` blocks to TypeScript in this project.

The full source migration is documented separately in `../typescript/typescript-6-migration.md`.

## Vite 8: remove the `rolldown-vite` alias

Current Mikrouli already opted into Rolldown through:

```json
"vite": "npm:rolldown-vite@^7.3.1"
```

Vite 8 now uses Rolldown officially. The Vite 8 migration guide specifically treats existing `rolldown-vite` users as a simplified migration path.

Target:

```json
"vite": "^8.x"
```

Do not retain the npm alias.

Current Mikrouli Vite configuration has no custom Rollup/esbuild build options, so most Vite 8 compatibility risk is in plugins rather than build configuration.

## BrowserSync

Upgrade `vite-plugin-browser-sync` from 6 to 7 in this cluster. Version 7 explicitly supports Vite 7 and 8 and retains zero-config development usage.

Verify that dev server proxy/reload behavior remains equivalent; do not reconfigure BrowserSync unless necessary.

## `adapter-static`

The Kit 3 adapter generation is `@sveltejs/adapter-static` 4 prerelease and requires SvelteKit 3.

Preserve current adapter behavior:

- `pages` and `assets` -> `build/${target}`;
- no SPA fallback;
- `precompress: false`;
- `strict: true`.

Do not change to another adapter: GitHub Pages staging and Netlify production both currently consume static artifacts.

## Current configuration that must be revalidated

### Paths

- production base: `""`;
- staging base: `"/mikrouli"`;
- `relative: false`;
- new `paths.origin` target-aware value.

### Prerender error handling

Keep the custom `handleHttpError` behavior that logs path/referrer/message and fails prerendering.

### Environment configuration

Current config sets empty public/private prefixes. Re-check Kit 3's final env option shape during implementation; do not assume removed options can be copied unchanged.

### Service worker

Current config disables automatic service-worker registration. Re-check final Kit 3 option support and preserve effective behavior.

### CSP

Preserve the production/report-only policies and allowlists for:

- Umami script/API;
- YouTube frames/media;
- Setmore frames.

Do not weaken CSP to make migration errors disappear.

## Other Kit 3 breaking APIs to inventory before upgrade

Search the repository for these before changing dependencies:

```text
$app/stores
$service-worker
invalidateAll
RequestEvent
Cookies
Page
ReadonlyURL
ReadonlyURLSearchParams
defineParams
```

Relevant Kit 3 prerelease changes include:

- `$app/stores` removal;
- `$service-worker` removal/rework;
- `invalidateAll` deprecation direction toward `refreshAll`;
- several types moved to `$app/server`, `$app/state`, `@sveltejs/kit/hooks`, `@sveltejs/kit/env`, or `@sveltejs/kit/params` across the prerelease series.

Do not migrate APIs that Mikrouli does not actually use.

## Do not adopt unrelated Kit 3 features

Mikrouli is a build-time Contentful-backed static site. Do not add remote functions, form/server patterns, server adapters, SSR infrastructure, or server deployment features simply because Kit 3 offers them.

The migration goal is compatibility and future support, not architectural novelty.

## Small-batch implementation plan

### Batch 0 — inventory and baseline

Before dependency changes:

- ensure working tree clean;
- record `bun run check:all` output;
- build staging and production;
- run axe/Lighthouse;
- inventory removed/deprecated Kit APIs listed above;
- inventory every `$lib` and custom `$...` alias import;
- save representative generated staging and production URLs/assets.

Commit no functional changes in this batch unless adding migration-only tests/fixtures.

### Batch 1 — prepare standards-based aliases while still on Kit 2 where practical

- Add tested `package.json#imports` mappings for custom project aliases.
- Convert custom `$...` imports to `#...` in small directory groups.
- If `$lib` cannot cleanly move before Kit 3, leave `$lib` for the official Kit migration batch.
- Remove `kit.alias` entries only after all consumers resolve through package imports.

Validation: dev, check, both builds, Bun-run scripts that use `#util`.

### Batch 2 — TypeScript 6 checker/tooling baseline

- Upgrade only TypeScript 5.9 -> stable 6.x if it can be made green on Kit 2 first.
- Keep all JS/JSDoc source unchanged.
- Resolve TS6 config/default changes.
- Keep `svelte-check` on its stable normal path; do not use TS7/`--tsgo` here.

If Kit 2 compatibility blocks this cleanly, combine the dependency bump with Batch 3 but keep source conversion out.

### Batch 3 — framework dependency cluster + official migration tooling

- Run the latest Svelte CLI Kit 3 migration tooling in a clean branch/worktree if available.
- Install the latest published `@sveltejs/kit@next` and compatible adapter/plugin/Vite versions.
- Remove the `rolldown-vite` alias.
- Upgrade BrowserSync 7.
- Review the generated diff; do not accept unrelated formatting/refactors blindly.

### Batch 4 — relocate SvelteKit config into Vite

- Move adapter, paths, prerender, env, service-worker, CSP and other still-valid options into `sveltekit({...})`.
- Move `prerender.origin` -> `paths.origin`.
- Delete or minimize `svelte.config.js` only if no remaining Svelte-specific configuration needs it.

### Batch 5 — finish `#lib` / alias migration

- Apply the official `$lib` -> `#lib` migration.
- Remove remaining deprecated `alias` configuration.
- Fix explicit extensions/resolution issues based on the final published Kit 3 behavior.

### Batch 6 — clean/deprecation pass

- Remove config compatibility remnants.
- Resolve all warnings introduced by Kit 3/Vite 8.
- Do not defer deprecation warnings without a documented reason.

### Batch 7 — deployment regression gate

Run the full checks and inspect both deployment targets before considering the migration complete.

## Required validation

```bash
bun install --frozen-lockfile
bun run sync
bun run check:all
bun run build
bun run build:prod
bun run test:axe
bun run test:lighthouse
```

Also verify:

- `bun start` works and BrowserSync still behaves as intended;
- staging build emits under the intended `build/staging` path;
- production build emits under the intended `build/production` path;
- staging internal URLs/assets correctly include `/mikrouli`;
- production internal URLs/assets do not;
- `paths.origin` yields correct canonical/prerender URLs;
- CSP remains correct;
- Contentful fetch/process workflow remains unchanged;
- no server runtime is required to serve the build.

## Rollback rule

If Kit 3 prerelease regressions affect static prerendering, deployment paths, CSP, or existing tests in ways that cannot be solved narrowly, remain on the clean latest Kit 2 baseline and document the blocking upstream issue. Do not work around a prerelease framework problem with broad architectural changes.

## Research sources

- SvelteKit v3 configuration source: https://github.com/sveltejs/kit/blob/version-3/packages/kit/src/core/config/options.js
- SvelteKit v3 changelog: https://github.com/sveltejs/kit/blob/version-3/packages/kit/CHANGELOG.md
- SvelteKit v3 package metadata: https://github.com/sveltejs/kit/blob/version-3/packages/kit/package.json
- Kit 3 adapter-static changelog: https://github.com/sveltejs/kit/blob/version-3/packages/adapter-static/CHANGELOG.md
- Svelte CLI migration changelog: https://github.com/sveltejs/cli/blob/version-1/packages/sv/CHANGELOG.md
- Vite 8 migration guide: https://vite.dev/guide/migration
- `@sveltejs/vite-plugin-svelte`: https://www.npmjs.com/package/@sveltejs/vite-plugin-svelte
- BrowserSync Vite plugin: https://www.npmjs.com/package/vite-plugin-browser-sync
- TypeScript 6 release notes: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-6-0.html
