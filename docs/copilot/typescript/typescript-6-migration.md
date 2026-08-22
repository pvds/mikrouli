# Mikrouli JSDoc JavaScript -> TypeScript 6 Migration

> Research snapshot: 2026-08-22
> Project type: separate source-language refactor
> Current source model: JavaScript + strict TypeScript `checkJs` + JSDoc + `.d.ts`
> Current target: TypeScript 6
> Future target: TypeScript 7 after normal stable Svelte-tooling support
> Audience: local GitHub Copilot coding agent

## Objective

Convert Mikrouli's first-party JavaScript/JSDoc typing model to native TypeScript while preserving behavior and the existing type guarantees.

This is a large refactor and must be treated as a **separate project**, not folded into the SvelteKit 3/Vite 8 migration.

The recommended execution target is **TypeScript 6**. Add a later TypeScript 7 upgrade only after Svelte's normal stable embedded-language tooling can use TS7 without requiring an experimental `--tsgo` path or TypeScript 6 compatibility installation.

## Why this is a syntax migration, not a type-system redesign

Mikrouli already uses TypeScript's checker deeply through `jsconfig.json`:

```json
{
  "compilerOptions": {
    "allowJs": true,
    "checkJs": true,
    "strict": true,
    "moduleResolution": "bundler"
  }
}
```

The project also already uses:

- JSDoc imported types (`@typedef {import(...).Type}`);
- object typedefs;
- typed parameters/returns;
- JSDoc generics/overloads where needed;
- real `.d.ts` shared declarations;
- Svelte 5 runes with JSDoc-typed props/state;
- SvelteKit-generated route types.

Therefore do **not** redesign all type models during conversion. Preserve existing boundaries first and translate them into native TypeScript syntax. Improvements can happen after parity.

## Timing relative to SvelteKit 3

Recommended order:

1. SvelteKit 3 migration upgrades the TypeScript **tooling dependency** to TypeScript 6 while source remains JS/JSDoc.
2. Stabilize Kit 3, Vite 8, aliases, and generated config.
3. Start this separate source-language project against that stable target.

Reason: Kit 3 changes generated TypeScript config conventions and module aliases. Converting source before Kit 3 would cause unnecessary config/import churn twice.

## TypeScript 6 research relevant to Mikrouli

TypeScript 6 is intentionally the transition release between the JS TypeScript compiler and TypeScript 7's native implementation.

### Favorable existing configuration

Mikrouli already explicitly has:

- `strict: true` — TS6 now defaults to strict anyway;
- `moduleResolution: "bundler"` — this is a modern recommended resolution mode and fits Vite/Bun;
- `esModuleInterop: true` — compatible with the modern direction;
- no `baseUrl` in the current config.

So several common TS6 migration issues are already avoided.

### TS6 defaults that must still be checked

TypeScript 6 changes several defaults. Important ones for this repository:

- `strict` defaults to `true`;
- `module` defaults to `esnext`;
- `target` defaults to the current-year ECMAScript target;
- `noUncheckedSideEffectImports` defaults to `true`;
- `rootDir` defaults to the directory containing the config rather than inference;
- `types` defaults to `[]` instead of automatically including all `@types` packages.

Because Mikrouli includes both `src/**` and `scripts/**`, do not blindly set `rootDir: "./src"`. Determine whether emit is even used (normally it should not be for this Vite/Bun app) and keep the checker configuration aligned with SvelteKit's generated config.

If Node globals/types are needed through external `@types` packages, list only the required entries rather than using `types: ["*"]` as a permanent workaround.

### Deprecations to avoid carrying forward

TS6 deprecates/removes legacy configuration such as Node10/classic module resolution, `baseUrl` lookup semantics, old module formats, and other legacy emit options. Mikrouli's current `bundler` resolution is already in the preferred direction.

Do not add deprecated compiler options just to recreate TS5 behavior.

## Svelte 5 native TypeScript model

Svelte supports TypeScript in components with:

```svelte
<script lang="ts">
```

For normal type-only TypeScript, Svelte does not require a TypeScript preprocessor. Prefer **erasable/type-only TS syntax** that Svelte/Vite can handle directly.

Recommended component style:

```svelte
<script lang="ts">
  import type { Snippet } from "svelte";

  interface Props {
    title: string;
    children?: Snippet;
  }

  let { title, children }: Props = $props();
</script>
```

Use native typing for runes:

```ts
let count: number = $state(0);
```

Use the Svelte `generics` script attribute for truly generic component props when required.

### Svelte tsconfig requirements

Official Svelte guidance calls for:

- target at least ES2015;
- `verbatimModuleSyntax: true`;
- `isolatedModules: true`.

Prefer these directly or inherit them from the Kit-generated configuration if already present. Do not duplicate config merely for appearance.

### Avoid runtime TypeScript-only transforms without need

Without an added preprocessor, Svelte's native TypeScript path is for syntax that disappears during transpilation. Avoid introducing enums, constructor parameter properties requiring TS runtime transforms, or other non-standard runtime TS syntax merely because the source is now `.ts`.

Mikrouli gains little from those constructs and benefits from staying close to JavaScript semantics.

## Target file policy

### Convert to `.ts`

Eventually convert first-party JavaScript with meaningful logic, including:

- `src/**/*.js` modules;
- Svelte component script blocks -> `<script lang="ts">`;
- SvelteKit route/load/server JS files -> `.ts` where supported;
- `scripts/workspace/**/*.js`;
- `scripts/content/**/*.js`;
- `scripts/assets/**/*.js`;
- `scripts/test/**/*.js`;
- Vite/config files where the framework supports `.ts` cleanly.

### Keep `.d.ts` only when it is genuinely a declaration file

Keep `.d.ts` for:

- ambient/global declarations;
- module augmentation;
- declarations for APIs with no runtime implementation in that module.

Ordinary domain models should generally become normal type modules, for example:

```text
src/lib/types/image.d.ts
->
src/lib/types/image.ts
```

with exported `interface`/`type` declarations.

Do not convert a declaration file to `.ts` blindly if its purpose is ambient augmentation.

## JSDoc translation patterns

### Imported type

Before:

```js
/** @typedef {import("svelte").Snippet} Snippet */
```

After:

```ts
import type { Snippet } from "svelte";
```

### Object typedef

Before:

```js
/**
 * @typedef {Object} Props
 * @property {string} title
 * @property {boolean} [disabled]
 */
```

After:

```ts
interface Props {
  title: string;
  disabled?: boolean;
}
```

### Function

Before:

```js
/**
 * @param {string} value
 * @returns {number}
 */
function length(value) {
  return value.length;
}
```

After:

```ts
function length(value: string): number {
  return value.length;
}
```

### Generic

Before:

```js
/**
 * @template T
 * @param {T[]} items
 * @returns {T | undefined}
 */
function first(items) {
  return items[0];
}
```

After:

```ts
function first<T>(items: T[]): T | undefined {
  return items[0];
}
```

Preserve useful explanatory JSDoc prose where it documents behavior. Remove comments whose only purpose was to encode types.

## Small-batch migration plan

### Phase 0 — baseline and inventory

Before renaming files:

1. Make TS6/tooling + Kit 3 baseline green.
2. Run and record:

```bash
bun run check:all
bun run build
bun run build:prod
bun run test:axe
bun run test:lighthouse
```

3. Inventory:
   - all `.js` files by subsystem;
   - all `.d.ts` files and whether they are domain types vs ambient declarations;
   - JSDoc tags used (`@typedef`, `@template`, `@overload`, etc.);
   - `@ts-ignore`, `@ts-expect-error`, casts, and known checker workarounds;
   - Svelte components with non-trivial props/generics.
4. Do not change runtime behavior in this phase.

### Phase 1 — TypeScript project configuration

Target a `tsconfig.json` appropriate for Kit 3/TS6.

During migration, keep mixed-source support:

```text
allowJs: true
checkJs: true
strict: true
```

so converted and unconverted files coexist safely.

Make the minimum explicit TS6 adjustments needed. Preserve `moduleResolution: "bundler"` unless Kit-generated config supplies the correct value.

Rename/remove `jsconfig.json` only when the project has a working mixed-source `tsconfig.json` replacement.

### Phase 2 — configuration files

Convert the lowest-risk config files first where supported, e.g. `vite.config.js -> vite.config.ts` after Kit 3 is stable.

Keep this separate from the Kit 3 migration itself.

Validation: sync/check/dev/both builds.

### Phase 3 — scripts, one subsystem at a time

Recommended order:

1. `scripts/workspace`;
2. small `scripts/util` helpers;
3. `scripts/content`;
4. `scripts/assets`;
5. `scripts/test`.

Each directory can be multiple batches if large.

Bun executes `.ts` directly, so do not add a compile-to-JS build step for these scripts.

After each subsystem:

- update internal import extensions/paths as required;
- run its direct command(s);
- run project check/build.

### Phase 4 — shared/domain types

Classify every current `.d.ts`:

- ambient/augmentation -> keep declaration form;
- ordinary reusable domain model -> move to exported `.ts` type module.

Then migrate imports from JSDoc `import()` expressions to `import type`.

Do not redesign content types in the same pass.

### Phase 5 — Svelte components by directory

Convert in small coherent groups, for example:

1. simple leaf UI components;
2. visuals;
3. layout components;
4. global/shell components;
5. more complex content components.

For each component:

- add `lang="ts"`;
- translate local `Props` JSDoc to `interface Props`/`type Props`;
- translate `$state`/helpers to native annotations where inference is insufficient;
- use `import type`;
- preserve rendered markup and styling exactly.

Do not "improve" component architecture while changing type syntax.

### Phase 6 — routes and SvelteKit-facing files

Convert route/load/server modules after shared types and components are stable.

Prefer SvelteKit-generated route types rather than manually recreating `PageLoad`, `PageServerLoad`, `RequestHandler`, etc.

Treat route filename/type changes as their own batches because they can affect generated types and prerendering.

### Phase 7 — strict TypeScript-only cleanup

Only when first-party JS has been intentionally exhausted:

- remove `allowJs`;
- remove `checkJs`;
- remove obsolete JS include patterns;
- delete/retire `jsconfig.json` if still present;
- update `check:lint` to point to `tsconfig.json`;
- replace the JSDoc-typing guide with TypeScript guidance;
- remove type-only JSDoc comments that no longer add documentation value.

Do not remove legitimate descriptive JSDoc/TSDoc comments.

### Phase 8 — final parity/refactor freeze

Before doing any post-migration type-design improvements, merge/stabilize a version whose behavior is intentionally unchanged.

This provides a clean boundary between:

- **source-language migration**, and
- later **type/model refactoring**.

## Migration rules for the coding agent

- Never convert large directory trees in one mechanical rename without running checks between groups.
- Do not add `any` to make errors disappear. Preserve or improve the previous `strict checkJs` guarantee.
- Prefer inference where obvious; do not annotate every local variable unnecessarily.
- Prefer `unknown` + narrowing over `any` at external boundaries.
- Use `satisfies` when validating object shapes without unnecessarily widening literals.
- Use `import type` for type-only imports.
- Preserve runtime JavaScript behavior exactly during the migration.
- Do not introduce enums or other TypeScript runtime constructs without a concrete need.
- Keep Contentful/external-data validation assumptions explicit; TypeScript types do not validate runtime data.
- Commit converted subsystems separately so Git history remains reviewable.

## Validation per batch

At minimum:

```bash
bun run sync
bun run check:all
bun run build
bun run build:prod
```

For migrated script subsystems also run their direct workflows. For changes affecting pages/test tooling:

```bash
bun run test:axe
bun run test:lighthouse
```

The migration is not complete merely because TypeScript emits no errors; runtime asset/content/build behavior must remain intact.

---

# Future TypeScript 7 migration

## Why TS7 is not the current source target

TypeScript 7.0 is already stable and is a native Go implementation with major performance improvements. However, the TypeScript team explicitly states that Svelte and other embedded-language workflows still need TypeScript 6 because TS7 does not yet expose a stable programmatic API for those tools.

`svelte-check` has experimental/bridge TS7 support through `--tsgo` or `--tsgo-experimental-api`, currently requiring both TypeScript 7 and TypeScript 6 installations. That is not the stability target for Mikrouli's main checker.

Therefore:

> Migrate source to TypeScript 6 now. Upgrade to TypeScript 7 later when Svelte's normal stable tooling path supports it directly.

## Trigger to start the TS7 follow-up

Re-evaluate TS7 when all of these are true:

1. Current Svelte/SvelteKit officially support TS7 in normal documentation/recommended project templates.
2. `svelte-check` can run TS7 without requiring `--tsgo`/experimental flags for normal use.
3. A TS6 compatibility package/install is no longer required for Svelte diagnostics/editor integration.
4. WebStorm/Svelte language tooling used by the project supports the stable TS7 path.
5. Kit-generated config and package peer ranges accept the target TS7 version.

Do not key this solely to "TypeScript 7.1 exists"; verify actual Svelte-tooling support at implementation time.

## TS6 preparation for a clean TS7 move

During the TS6 migration:

- fix TS6 deprecations instead of permanently using `ignoreDeprecations`;
- avoid deprecated module-resolution/config options;
- stay on `moduleResolution: "bundler"` or the final Kit-recommended equivalent;
- use standards-based `#` package imports;
- avoid compiler behaviors known to disappear in TS7;
- optionally use TS6's `stableTypeOrdering` only if declaration-output ordering actually matters (likely low relevance for this app).

A clean TS6 project should make the later TS7 migration mostly a tooling/compiler upgrade rather than another source rewrite.

## Expected TS7 follow-up batch

When the trigger is met:

1. create a fresh baseline of TS6 diagnostics/build timing;
2. update TypeScript + Svelte checking/tooling together as required;
3. run TS7 project diagnostics;
4. compare diagnostic differences rather than mass-casting them away;
5. run the complete application/build/browser regression suite;
6. measure checker/editor performance benefit;
7. remove any TS6 compatibility dependency only after Svelte tooling no longer requires it.

## Research sources

- Current Mikrouli `jsconfig.json` and JSDoc typing guide (project sources)
- TypeScript 6 release notes: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-6-0.html
- TypeScript 7 announcement: https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/
- Svelte TypeScript docs: https://svelte.dev/docs/svelte/typescript
- `svelte-check` README: https://github.com/sveltejs/language-tools/blob/master/packages/svelte-check/README.md
- `svelte-check` changelog: https://github.com/sveltejs/language-tools/blob/master/packages/svelte-check/CHANGELOG.md
- SvelteKit 3 migration sources: https://github.com/sveltejs/kit/tree/version-3
