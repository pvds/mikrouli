# Mikrouli Modernization Roadmap

> Research snapshot: 2026-08-22
> Audience: local GitHub Copilot coding agent
> Scope: implementation order and routing to objective-specific research files

## Purpose

Use this file as the entry point for modernization work. It intentionally contains only the current baseline, architectural constraints, implementation order, and links to the focused research files. Do not load every research file for every task; read only the file for the current objective.

## Authoritative current baseline

The latest project `package.json` provided for this research is the baseline. It already includes the completed Bun/package-manager and semver-safe dependency work.

Core versions at the research snapshot:

| Package/tool | Current baseline |
| --- | --- |
| Bun | `^1.4` |
| Node | `^26` |
| Svelte | `^5.56.10` |
| SvelteKit | `^2.70.3` |
| `@sveltejs/adapter-static` | `^3.0.10` |
| `@sveltejs/vite-plugin-svelte` | `^6.2.4` |
| Vite | `npm:rolldown-vite@^7.3.1` |
| Tailwind CSS | `^4.3.3` |
| TypeScript | `^5.9.3` |
| `svelte-check` | `^4.7.6` |
| Sharp | `^0.35.3` |
| Playwright | `^1.62.1` |
| `@axe-core/playwright` | `^4.13.0` |
| Biome | `^2.5.10` |
| Contentful | `^11.12.9` |

Do not redo completed semver-safe upgrades unless a later scoped migration requires a coupled version change.

## Already completed

- Bun 1.4 adoption.
- pnpm to Bun package-manager migration.
- SemVer-compatible dependency upgrades.
- Sharp updated to the latest compatible/current baseline before replacement research.
- Svelte and SvelteKit updated to the latest Svelte 5 / SvelteKit 2 baseline used for this research.

These are historical context only. Do not create implementation work for them.

## Project invariants

Every modernization batch must preserve these characteristics unless its scoped research file explicitly says otherwise:

1. **Static SvelteKit architecture.** Mikrouli is an SSG using `adapter-static`; do not introduce server runtime dependencies merely because SvelteKit 3 has new server capabilities.
2. **Two deployment targets.** Staging uses GitHub Pages under `/mikrouli`; production uses the root path at `https://mikrouli.org` and Netlify.
3. **Strict prerendering.** Preserve strict static output and the current custom prerender HTTP-error behavior.
4. **Accessibility.** Existing axe checks remain a regression gate.
5. **Performance.** Existing Lighthouse checks remain a regression gate.
6. **Web standards first.** Prefer HTML/CSS and platform APIs over extra runtime JavaScript.
7. **Bun-first tooling.** Prefer Bun runtime/package-manager/native APIs where they are stable and provide equivalent functionality.
8. **Stability over dependency-count reduction.** Experimental Bun APIs may be prototyped, but must not replace stable production tooling without a later explicit decision.
9. **One conceptual change per batch.** Never combine unrelated dependency majors, framework migration, image-pipeline replacement, browser-test replacement, and source-language refactoring.
10. **Keep `main` deployable.** Each completed batch must leave both staging and production builds usable.

## Recommended implementation order

### Track A — modernization

#### 1. Independent remaining dependency majors

Read: [`01-dependency-majors.md`](./01-dependency-majors.md)

Implement as separate small batches:

- Marked 17 -> 18.
- `schema-dts` 1 -> 2.
- Review/remove the project-local Tailwind language-server dependency if unused.

Do **not** migrate `svelte-sitemap` yet; its v4 migration belongs after the SvelteKit 3/Vite 8 configuration work because v4 prefers a Vite plugin.

#### 2. Sharp -> Bun.Image

Read: [`03-sharp-to-bun-image.md`](./03-sharp-to-bun-image.md)

Implement Bun.Image beside the existing Sharp pipeline, compare outputs, then remove Sharp only after parity gates pass. This is intentionally done while the framework remains stable.

#### 3. SvelteKit 3 + Vite 8 migration cluster

Read: [`02-sveltekit-3-vite-8.md`](./02-sveltekit-3-vite-8.md)

This is the one deliberately coupled framework batch family. It includes:

- latest **published** `@sveltejs/kit@next` at implementation time;
- Kit-3-compatible `@sveltejs/adapter-static@next`;
- Vite 8 (remove the `rolldown-vite` npm alias);
- `@sveltejs/vite-plugin-svelte` 7;
- `vite-plugin-browser-sync` 7;
- TypeScript 6 as tooling/checker dependency because Kit 3 requires it;
- SvelteKit configuration relocation into `sveltekit(...)` in Vite config;
- `prerender.origin` -> `paths.origin`;
- `$lib` and custom `$...` aliases -> standards-based `#...` subpath imports.

The full JSDoc-JavaScript -> TypeScript source conversion is **not** part of this migration.

#### 4. `svelte-sitemap` 4

Read the sitemap section in [`01-dependency-majors.md`](./01-dependency-majors.md).

After Vite/Kit configuration is stable:

- migrate the deprecated CLI/postbuild integration to `svelte-sitemap/vite`;
- preserve target-specific `domain` and `outDir` behavior;
- remove the old helper/postbuild scripts only after sitemap parity is verified.

#### 5. Bun.WebView prototype

Read: [`04-bun-webview-playwright-prototype.md`](./04-bun-webview-playwright-prototype.md)

This is **research/prototype only**. Keep Playwright as the stable production/CI implementation while `Bun.WebView` remains experimental.

### Track B — separate TypeScript project

Read: [`../typescript/typescript-6-migration.md`](../typescript/typescript-6-migration.md)

The full source migration from strict JSDoc JavaScript to TypeScript 6 is a separate project. Recommended timing: after the SvelteKit 3 migration is stable, so the source migration targets the new Kit 3 configuration/type model only once.

TypeScript 7 is documented as the future follow-up, not the current migration target, because Svelte's embedded-language tooling still requires TypeScript 6 for the normal stable path as of this research snapshot.

## Core validation gate

At minimum, after every implementation batch run the relevant existing project commands:

```bash
bun install --frozen-lockfile
bun run check:all
bun run build
bun run build:prod
```

For changes that can affect rendered output, routing, browser behavior, accessibility, or performance also run:

```bash
bun run test:axe
bun run test:lighthouse
```

For framework migration batches additionally verify manually/automatically:

- staging URLs include `/mikrouli` exactly once;
- production URLs do not include the staging base path;
- prerendered links/assets resolve in both targets;
- production CSP still permits only the intended Umami, Setmore, and YouTube resources;
- sitemap output uses the correct domain and output directory;
- GitHub Pages staging and Netlify production build artifacts are structurally unchanged unless an intentional migration requires otherwise.

## Agent routing table

| Current task | Read |
| --- | --- |
| Remaining dependency majors | `01-dependency-majors.md` |
| SvelteKit 3 / Vite 8 / aliases / Kit config | `02-sveltekit-3-vite-8.md` |
| Replace Sharp | `03-sharp-to-bun-image.md` |
| Investigate Bun browser automation | `04-bun-webview-playwright-prototype.md` |
| Convert JSDoc JS source to TypeScript | `../typescript/typescript-6-migration.md` |

## Rules for the coding agent

- Re-check the **published** package version immediately before a prerelease/`next` migration. Do not install an unpublished GitHub branch version merely because this research saw a newer commit there.
- Prefer official migration tooling where available, but inspect every generated change before accepting it.
- Do not opportunistically redesign components, CSS, content models, deployment architecture, or test semantics during these migrations.
- Do not suppress type, accessibility, build, or prerender errors just to complete an upgrade.
- If a parity gate fails, keep the old implementation and stop that scoped migration rather than widening the change.
- Update this roadmap's status when a scoped objective is completed; keep implementation details in the focused file.

## Research sources

- SvelteKit v3 development changelog: https://github.com/sveltejs/kit/blob/version-3/packages/kit/CHANGELOG.md
- SvelteKit v3 configuration validator: https://github.com/sveltejs/kit/blob/version-3/packages/kit/src/core/config/options.js
- Svelte CLI migration changelog: https://github.com/sveltejs/cli/blob/version-1/packages/sv/CHANGELOG.md
- Vite 8 migration guide: https://vite.dev/guide/migration
- Bun Image: https://bun.com/docs/runtime/image
- Bun WebView: https://bun.com/docs/runtime/webview
- TypeScript 6 release notes: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-6-0.html
- TypeScript 7 announcement: https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/
- Svelte TypeScript docs: https://svelte.dev/docs/svelte/typescript
