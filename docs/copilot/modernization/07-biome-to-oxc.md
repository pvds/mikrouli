# Mikrouli: Future Biome → Oxc Migration

> Research snapshot: 2026-08-22  
> Current baseline before this objective: complete `06-modernize-biome.md` first  
> Target tools: `oxlint` + `oxfmt`  
> Frontend: Svelte 5 / SvelteKit 2 / Tailwind CSS 4  
> Runtime/package manager: Bun 1.4  
> Current TypeScript baseline: TypeScript 6 with strict JSDoc/checkJs  
> Status: **future optional migration; not currently recommended by default**  
> Audience: GitHub Copilot coding agent or developer evaluating/implementing the migration

## Objective

Provide an implementation-ready reference for replacing Biome with the Oxc
toolchain:

```text
Biome
├── linting
├── formatting
└── import organization

        ↓

Oxlint
└── JavaScript / TypeScript linting

Oxfmt
├── formatting
├── import sorting
└── optional Tailwind class sorting

svelte-check
└── Svelte + JSDoc/TypeScript semantic checking
```

This document intentionally records **all known caveats and decision gates** so
the migration can be reconsidered later without repeating the research.

This is **not** a recommendation to migrate now. The current recommendation is:

> Modernize Biome first, use that setup, and migrate only if Oxc provides a
> concrete net benefit at the time of implementation.

---

# Relationship to `06-modernize-biome.md`

Complete the Biome modernization first.

The Oxc decision should compare against a clean current Biome baseline, not the
older configuration.

Reasons:

- Biome 2.5 modernizes the recommended preset syntax;
- the current scripts have quality-gate issues unrelated to Oxc;
- Biome's Svelte/CSS capabilities continue to improve;
- a fair comparison requires knowing what current Biome actually catches;
- migration should be driven by measurable benefit, not tool novelty.

Do not implement this objective immediately after `06-modernize-biome.md`
unless the decision gate below is satisfied.

---

# Decision gate: should Mikrouli migrate at all?

Before implementation, re-check the current state of both projects.

Migrate only if at least one meaningful benefit exists, for example:

1. Oxfmt has reached stable, or its current stability is acceptable for this
   project.
2. Oxlint/Oxfmt materially improve local hooks, CI, or agentic workflow speed.
3. Oxfmt's formatting/Tailwind/import features are clearly preferable to Biome.
4. Oxlint has gained better Svelte/template support.
5. Oxc has gained CSS/HTML linting or another feature that closes today's
   coverage gaps.
6. A specific Oxlint rule/plugin solves an actual problem Biome does not.
7. Maintaining Biome becomes more costly or limiting than the Oxc split
   toolchain.
8. The project has grown enough that Oxc's performance advantage is materially
   useful.

Do **not** migrate solely because:

- Oxc is newer;
- Oxc benchmarks faster on large repositories;
- Oxlint has a larger raw rule count;
- Oxfmt can sort Tailwind classes;
- other projects are adopting Oxc.

For Mikrouli's current size, both Biome and Oxc are already fast enough that
performance alone is not a strong migration justification.

---

# Research snapshot and stability caveat

As of 2026-08-22:

- Oxlint is stable.
- Oxlint type-aware linting is stable.
- Oxlint JavaScript plugins remain alpha.
- Oxfmt is still officially beta.
- Oxfmt supports Svelte, CSS, Markdown, JSON/JSONC and many other formats.
- Oxlint supports `.svelte` files only by linting their `<script>` blocks.

Re-check these facts immediately before implementation.

Official references:

- Oxlint: <https://oxc.rs/docs/guide/usage/linter.html>
- Oxlint configuration: <https://oxc.rs/docs/guide/usage/linter/config.html>
- Oxlint JS plugins: <https://oxc.rs/docs/guide/usage/linter/js-plugins>
- Oxlint type-aware linting:
  <https://oxc.rs/docs/guide/usage/linter/type-aware>
- Oxfmt: <https://oxc.rs/docs/guide/usage/formatter>
- Oxfmt configuration:
  <https://oxc.rs/docs/guide/usage/formatter/config-file-reference>
- Oxfmt beta announcement:
  <https://oxc.rs/blog/2026-02-24-oxfmt-beta>
- Biome language support:
  <https://biomejs.dev/internals/language-support/>

---

# Migration philosophy

The intended policy is:

> **Prefer Oxc defaults and add project-specific configuration only when a
> concrete Mikrouli requirement justifies it.**

Do not mechanically translate every Biome recommended rule into Oxlint.

Biome's recommended preset and Oxlint's defaults have different philosophies:

```text
Biome recommended
└── broader recommended policy across multiple rule groups

Oxlint default
└── high-confidence correctness rules
```

Therefore migration requires a **differential audit**, not only a config rewrite.

For every useful Biome-only JavaScript diagnostic:

1. determine whether Oxlint already catches the underlying problem differently;
2. determine whether `svelte-check` or TypeScript catches it;
3. determine whether the rule has prevented a real problem in Mikrouli;
4. only then enable an equivalent Oxlint rule explicitly.

Do not enable `style`, `suspicious`, `pedantic`, `restriction`, `perf`, nursery,
or other Oxlint categories wholesale merely to imitate Biome.

---

# Current vs target coverage

The most important migration caveat is that Oxc does **not** provide identical
language coverage.

| Area | Modernized Biome baseline | Oxc target | Caveat |
| --- | --- | --- | --- |
| JavaScript linting | Biome | Oxlint | Policy/rule differences |
| TypeScript linting | Biome | Oxlint | Policy/rule differences |
| Svelte `<script>` linting | Biome partial/full depending config | Oxlint | Oxlint sees script only |
| Svelte template semantics | `svelte-check` | `svelte-check` | Keep unchanged |
| Svelte accessibility | primarily `svelte-check` + axe | same | Keep unchanged |
| CSS linting | Biome | **none in Oxc** | Explicit decision required |
| JSON/JSONC linting | Biome | **none in Oxlint** | Coverage loss |
| Markdown linting | none | none | No regression |
| JS/TS formatting | Biome | Oxfmt | Review one-time diff |
| Svelte formatting | limited/experimental in Biome baseline | Oxfmt | Broader formatting scope |
| CSS formatting | optional in Biome baseline | Oxfmt | May introduce new diffs |
| JSON formatting | Biome | Oxfmt | Oxfmt also sorts `package.json` by default |
| Markdown formatting | not a Biome strength | Oxfmt | New active formatting scope |
| Import organization | Biome assist | Oxfmt `sortImports` | Algorithms differ |
| Tailwind class sorting | not baseline Biome behavior | Oxfmt | New behavior |
| Tailwind class linting | not equivalent to CSS linting | optional plugin/editor | Svelte limitation |

---

# Caveat 1 — Oxlint does not replace Biome's CSS linting

Oxlint is a JavaScript/TypeScript linter.

It does not lint standalone `.css` files.

Biome does.

Biome can detect CSS issues such as unknown properties, malformed values,
invalid constructs and other CSS-specific problems. Oxlint will not inspect
those files.

This is a **real lint-coverage regression** if Biome is removed completely.

## CSS decision A — remove CSS linting

This is the preferred option if the audit shows that Biome's CSS diagnostics
provide little practical value for Mikrouli.

Target stack:

```text
Oxlint
└── JS/TS

Oxfmt
└── formatting

Tailwind/Vite
└── CSS processing/build validation

svelte-check
└── Svelte semantics

axe
└── runtime accessibility
```

Advantages:

- simplest toolchain;
- Biome can be removed completely;
- clear tool ownership;
- less duplicate parsing/configuration.

Disadvantage:

- static standalone CSS linting disappears.

Do not add Stylelint automatically. Only introduce a dedicated CSS linter in a
separate objective if a concrete problem later justifies it.

## CSS decision B — retain Biome as a non-JS linter

If the CSS audit proves useful, retaining Biome is acceptable.

In that case, **do not leave Biome linting all languages**. Restrict it to the
non-JS languages you intentionally want to preserve, preferably CSS and
JSON/JSONC.

For example, create a small dedicated configuration such as
`biome.nonjs.jsonc` with narrow `files.includes` / `linter.includes`, and invoke
Biome with `--config-path`.

Conceptual scope:

```text
Oxlint
└── JS/TS

Biome
├── CSS linting
└── JSON/JSONC linting

Oxfmt
└── formatting
```

If Biome remains installed for CSS, retaining JSON/JSONC linting has little
additional tooling cost and preserves more existing coverage.

However, this hybrid should be chosen deliberately because it weakens one of the
main reasons to migrate:

```text
two Oxc tools
+ Biome
+ svelte-check
```

is more complex than simply modernizing and keeping Biome.

---

# Caveat 2 — Oxlint only sees Svelte `<script>`

Oxlint supports `.svelte`, `.vue` and `.astro` files by linting only their
`<script>` blocks.

It does **not** parse Svelte markup as a Svelte template AST.

Therefore:

```svelte
<script>
	let value = 1; // Oxlint can inspect this
</script>

<div class="...">
	<!-- Oxlint does not lint this as Svelte markup -->
</div>
```

Keep `svelte-check` as a mandatory independent quality gate.

Do not attempt to replace it with Oxlint.

The target responsibility split should remain:

```text
Oxlint
└── JavaScript/TypeScript correctness

svelte-check
├── Svelte compiler semantics
├── template diagnostics
├── accessibility diagnostics
└── JSDoc/TypeScript checking
```

Mikrouli's existing strict `checkJs`/JSDoc setup remains important after the
migration.

---

# Caveat 3 — Oxlint JavaScript plugins do not solve Svelte parsing

Oxlint's ESLint-compatible JavaScript plugin support is promising, but currently
does not support custom file formats/parsers such as Svelte parsers.

Therefore an ESLint plugin that normally gains Svelte support through
`svelte-eslint-parser` cannot automatically gain full Svelte-template support
just because Oxlint can execute the plugin.

This matters particularly for Tailwind lint plugins.

Re-check this limitation at migration time because it is an active development
area.

---

# Caveat 4 — Tailwind is three separate concerns

Do not treat "Tailwind support" as one feature.

There are three different concerns:

## A. Tailwind CSS syntax

Mikrouli uses Tailwind CSS 4.

The actual CSS pipeline remains owned by Tailwind/Vite.

Oxfmt can format CSS, but Oxlint does not lint CSS syntax.

## B. Tailwind class ordering

Oxfmt has built-in Tailwind sorting using the same class-ordering algorithm as
`prettier-plugin-tailwindcss`.

It supports Svelte.

The adopted target policy is to enable it:

```jsonc
"sortTailwindcss": true
```

Because this is **new behavior**, do not combine the resulting repository-wide
class-order diff with functional changes.

Enable it in its own formatting-only batch.

## C. Tailwind class correctness/conflicts

Tools such as `oxlint-tailwindcss` can detect Tailwind-specific issues such as
unknown utilities, conflicts, duplicates and canonicalization opportunities.

As of this research snapshot:

- `oxlint-tailwindcss` targets Tailwind CSS 4;
- its `settings.tailwindcss.entryPoint` is required;
- it offers 23 Tailwind-specific rules;
- it runs through Oxlint;
- Oxlint's current Svelte limitation means it cannot be assumed to fully lint
  Tailwind classes in Svelte markup.

Therefore **do not make `oxlint-tailwindcss` a required migration dependency**.

Treat it as an optional later experiment.

Reference:

- <https://www.npmjs.com/package/oxlint-tailwindcss>

---

# Tailwind editor diagnostics remain useful

Mikrouli already depends on the official Tailwind language server.

Keep it.

The Tailwind language server provides editor diagnostics/completion for Tailwind
markup and CSS and is useful exactly where Oxlint's Svelte-template support is
limited.

This creates a pragmatic split:

```text
Oxfmt
└── Tailwind class ordering

Tailwind language server
└── editor-level Tailwind diagnostics/completion

Tailwind/Vite
└── actual Tailwind compilation

optional oxlint-tailwindcss
└── additional static Tailwind rules where Oxlint can see the source
```

Do not claim that the language server is a CI replacement for a linter. It is
primarily editor tooling.

---

# Caveat 5 — JSON/JSONC linting is lost with pure Oxc

Oxfmt formats JSON and JSONC.

Oxlint does not lint JSON.

Therefore pure Oxc removes Biome's semantic JSON/JSONC lint coverage.

This matters because Mikrouli contains configuration and generated/content JSON.

Decision:

- if Biome is removed completely, explicitly accept this coverage loss;
- if Biome is retained for CSS, strongly consider retaining JSON/JSONC linting
  too.

Do not introduce another JSON-specific linter during this migration.

---

# Caveat 6 — Markdown linting does not regress

Biome does not currently provide meaningful Markdown linting for this project.

Oxlint also does not lint Markdown.

Therefore:

```text
Biome → Oxc
Markdown lint coverage: no meaningful change
```

Do not add `markdownlint` as part of this migration.

If Markdown linting is desired later, scope it separately.

---

# Caveat 7 — Oxfmt makes Markdown formatting active

Although Markdown **linting** does not change, Markdown **formatting** does.

Oxfmt formats Markdown.

The project currently declares:

```json
"prettier": {
	"proseWrap": "always"
}
```

and `.editorconfig` uses an 80-character maximum for Markdown.

The adopted target behavior is:

```jsonc
"proseWrap": "always"
```

Oxfmt will then actively re-wrap Markdown to the applicable print width.

That can create a large one-time documentation diff.

Treat it as formatting-only.

If future maintainers decide that active Markdown reflow is undesirable, use an
Oxfmt override or ignore strategy rather than silently changing the policy.

---

# Caveat 8 — Oxfmt's formatting scope is broader than the current baseline

This is one of the most important migration risks.

Running:

```bash
oxfmt
```

over the entire repository may newly format:

- Svelte markup;
- Svelte `<style>`;
- standalone CSS;
- Markdown;
- YAML/TOML if present;
- other supported formats.

The modernized Biome baseline does not necessarily format all of those.

Therefore an Oxfmt repository-wide diff is **not automatically a parity diff**.

Before writing anything:

```bash
bunx oxfmt --list-different
```

Classify changed files by language and decide whether each language should enter
the formatter's scope.

Do not review a repository-wide Oxfmt diff as one undifferentiated change.

---

# Caveat 9 — Svelte formatting is opt-in

Oxfmt requires:

```jsonc
"svelte": true
```

to format `.svelte` files.

Mikrouli already has Svelte installed, satisfying Oxfmt's runtime requirement.

The target migration should enable Svelte formatting, but review it separately
because it expands formatting beyond the current Biome fallback behavior.

Test representative components containing:

- Svelte 5 runes;
- snippets;
- class arrays/objects;
- complex attribute expressions;
- `<style>` blocks;
- Tailwind classes;
- `<svelte:...>` elements;
- transitions/actions;
- comments and multiline markup.

If Oxfmt is still beta at migration time, require a clean full-project diff
review before adopting Svelte formatting.

---

# Caveat 10 — import sorting must be preserved, but it is not identical

Biome currently uses `organizeImports`.

The migration decision is to preserve automatic import organization/sorting.

Oxfmt provides:

```jsonc
"sortImports": true
```

However, Oxfmt's sorting algorithm is not Biome's import-organizer algorithm.

Expect a one-time import-order diff.

Important defaults:

- imports are grouped and sorted;
- side-effect imports are **not** sorted by default.

Keep:

```jsonc
"sortImports": {
	"sortSideEffects": false
}
```

or simply use `true` if the current Oxfmt default still preserves side-effect
order when implementation happens.

Do not enable side-effect sorting unless separately reviewed.

Side-effect import order can be semantically meaningful.

Run builds/tests after the import-sorting migration even if the diff appears
cosmetic.

---

# Caveat 11 — `package.json` sorting is enabled by Oxfmt by default

Oxfmt currently enables `sortPackageJson` by default.

That is a new behavior relative to the intended migration scope.

To keep the initial migration focused, explicitly disable it:

```jsonc
"sortPackageJson": false
```

After the migration is stable, package sorting can be considered separately.

Do not let an unrelated `package.json` reordering make the primary migration
diff harder to review.

---

# Caveat 12 — JSDoc formatting must remain a separate optional step

Oxfmt's JSDoc formatter is disabled by default.

Keep it disabled during the base migration.

Do **not** add:

```jsonc
"jsdoc": true
```

to the initial configuration.

JSDoc formatting can change more than whitespace:

- normalize aliases;
- capitalize descriptions;
- wrap descriptions;
- collapse comments;
- alter tag presentation;
- change type-brace spacing depending on options.

Mikrouli relies heavily on JSDoc for JavaScript type safety, so this deserves its
own review.

## Optional later step — evaluate JSDoc formatting

1. create a clean branch;
2. enable `jsdoc: true`;
3. format a representative subset of `scripts/`, `src/` and Svelte `<script>`
   blocks;
4. review semantic readability and TypeScript/JSDoc editor inference;
5. run `svelte-check`;
6. only then decide whether to format the entire repository;
7. commit JSDoc formatting separately from all functional changes.

Also keep Oxlint's optional `jsdoc` plugin disabled initially unless a specific
linting need appears.

---

# Caveat 13 — do not enable Oxlint type-aware mode during this migration

Mikrouli currently uses TypeScript 6.

As of this research snapshot, Oxlint's type-aware linting uses
`oxlint-tsgolint`/`typescript-go` and requires TypeScript 7.0+.

Therefore:

> **Do not enable type-aware Oxlint until the separate TypeScript 7 migration
> has happened and the project has been validated against it.**

Do not install `oxlint-tsgolint` during the baseline Oxc migration.

Do not enable:

```jsonc
"options": {
	"typeAware": true
}
```

or:

```bash
oxlint --type-aware
```

during this migration.

Mikrouli already has:

```text
svelte-check
+ TypeScript checkJs
+ strict JSDoc typing
```

which remains the semantic/type-check layer.

After TypeScript 7 migration, type-aware Oxlint can be evaluated as a separate
objective.

---

# Caveat 14 — do not enable Oxlint JS plugins during the baseline migration

Oxlint JavaScript-plugin compatibility remains alpha as of this snapshot.

Do not depend on custom JavaScript plugins for migration parity unless there is
no native alternative.

Prefer:

1. Oxlint built-in rules;
2. Oxlint built-in plugins;
3. existing `svelte-check`;
4. only then JavaScript plugins if a concrete rule gap justifies them.

This particularly applies to Tailwind plugins that rely on framework parsers.

---

# Caveat 15 — default rule severity and CI policy must be deliberate

Oxlint's default correctness rules can include warnings.

A CI command should fail reliably on the policy Mikrouli chooses.

After the baseline differential audit, decide whether CI uses:

```bash
oxlint --deny-warnings
```

or relies only on `error` severity.

Recommended approach:

- during migration comparison: preserve Oxlint defaults and inspect severities;
- after rule policy is settled: make CI fail on all actionable diagnostics.

Do not accidentally create a CI check that prints warnings but exits successfully
when those warnings are intended to block merges.

---

# Caveat 16 — generated files and tool directories must remain excluded

The current Biome setup excludes at least:

```text
src/data/generated
.agents/skills
```

Preserve equivalent exclusions.

Recommended Oxlint baseline:

```jsonc
{
	"$schema": "./node_modules/oxlint/configuration_schema.json",
	"ignorePatterns": [
		"src/data/generated/**",
		".agents/skills/**"
	]
}
```

Recommended Oxfmt baseline:

```jsonc
{
	"$schema": "./node_modules/oxfmt/configuration_schema.json",
	"ignorePatterns": [
		"src/data/generated/**",
		".agents/skills/**"
	]
}
```

Also rely on normal `.gitignore` handling.

Before removing Biome, compare the actual file lists processed by each tool.

For Oxlint:

```bash
oxlint --debug files
```

For Oxfmt:

```bash
oxfmt --list-different
```

Review unexpected generated/static/cache files.

---

# Caveat 17 — keep `.editorconfig` as the shared basic style policy

Mikrouli's current `.editorconfig` contains:

```ini
[*]
end_of_line = lf
indent_size = 4
indent_style = tab
insert_final_newline = true
max_line_length = 100
tab_width = 4

[{*.md,*.mdx}]
max_line_length = 80
```

Oxfmt reads relevant EditorConfig values.

Do not duplicate these values into `.oxfmtrc.json` unless a project-specific
override is necessary.

This keeps the Oxfmt config focused on behavior EditorConfig cannot express:

- Svelte enablement;
- import sorting;
- Tailwind sorting;
- prose wrapping;
- package sorting policy;
- ignores.

---

# Proposed target Oxfmt configuration

Do not blindly copy this file in the future without first running Oxfmt's
migration helper against the then-current Biome config.

First run:

```bash
bunx oxfmt --migrate biome
```

Review the generated configuration.

Then simplify it toward this intentional target:

```jsonc
{
	"$schema": "./node_modules/oxfmt/configuration_schema.json",
	"ignorePatterns": [
		"src/data/generated/**",
		".agents/skills/**"
	],
	"svelte": true,
	"proseWrap": "always",
	"sortImports": {
		"sortSideEffects": false
	},
	"sortTailwindcss": true,
	"sortPackageJson": false
}
```

Important:

- `svelte: true` is required for Svelte formatting;
- `proseWrap: "always"` preserves the intended documentation wrapping policy;
- `sortImports` preserves automatic import ordering;
- side-effect sorting stays disabled;
- `sortTailwindcss` is an intentional new target behavior;
- `sortPackageJson: false` prevents unrelated package-field reordering;
- JSDoc formatting remains disabled because it is omitted.

If Oxfmt defaults have changed by implementation time, re-check every
explicit/implicit behavior.

---

# Proposed target Oxlint configuration

Start minimal.

```jsonc
{
	"$schema": "./node_modules/oxlint/configuration_schema.json",
	"ignorePatterns": [
		"src/data/generated/**",
		".agents/skills/**"
	]
}
```

Oxlint enables correctness rules by default.

Do not initially add categories merely to reproduce Biome's recommended preset.

After the differential audit, add only individual rules whose loss is justified
as a real regression.

Example only:

```jsonc
{
	"$schema": "./node_modules/oxlint/configuration_schema.json",
	"ignorePatterns": [
		"src/data/generated/**",
		".agents/skills/**"
	],
	"rules": {
		"some/useful-rule": "error"
	}
}
```

Do not copy hypothetical rules from this document; use the actual current rule
names at implementation time.

---

# Optional residual Biome configuration

Only use this path if the CSS/JSON audit proves that keeping non-JS linting is
worth the extra dependency.

Conceptual `biome.nonjs.jsonc`:

```jsonc
{
	"$schema": "./node_modules/@biomejs/biome/configuration_schema.json",
	"files": {
		"includes": [
			"**/*.css",
			"**/*.json",
			"**/*.jsonc",
			"!src/data/generated"
		]
	},
	"formatter": {
		"enabled": false
	},
	"assist": {
		"enabled": false
	},
	"linter": {
		"enabled": true,
		"rules": {
			"preset": "recommended"
		}
	},
	"css": {
		"parser": {
			"tailwindDirectives": true
		}
	}
}
```

Run using:

```bash
biome lint --config-path=biome.nonjs.jsonc
```

Verify the exact config schema and CLI flags against the Biome version current at
implementation time.

If this residual setup feels awkward or requires significant configuration,
that is evidence that keeping full modernized Biome may be simpler than
migrating.

---

# Dependency changes

## Pure Oxc target

Install first, while keeping Biome temporarily:

```bash
bun add -d oxlint oxfmt
```

Do not remove Biome yet.

Only after all parity/audit gates pass:

```bash
bun remove @biomejs/biome
```

Also remove Biome from `trustedDependencies` if it is still listed.

Do not add `oxlint-tsgolint` during the baseline migration.

## Hybrid non-JS Biome target

Install:

```bash
bun add -d oxlint oxfmt
```

Keep:

```text
@biomejs/biome
```

but restrict its responsibility to CSS/JSON linting.

---

# Package-script target

Assuming pure Oxc:

```json
{
	"scripts": {
		"check": "bun run check:format && bun run check:lint && bun run check:svelte",
		"check:ci": "bun run check:format && bun run check:lint && bun run check:svelte",
		"check:all": "bun run check && bun run build -l warn",
		"check:format": "oxfmt --check",
		"check:lint": "oxlint --deny-warnings",
		"check:svelte": "svelte-kit sync && svelte-check --tsconfig ./jsconfig.json",
		"write": "oxlint --fix && oxfmt"
	}
}
```

During the migration audit, temporarily omit `--deny-warnings` if necessary to
observe Oxlint's default severity behavior before defining CI policy.

Keep sequential `&&`.

Do not reintroduce shell background `&`, because failure propagation must remain
reliable.

## Hybrid CSS/JSON Biome variant

Conceptually:

```json
{
	"scripts": {
		"check": "bun run check:format && bun run check:lint && bun run check:nonjs && bun run check:svelte",
		"check:ci": "bun run check",
		"check:format": "oxfmt --check",
		"check:lint": "oxlint --deny-warnings",
		"check:nonjs": "biome lint --config-path=biome.nonjs.jsonc",
		"check:svelte": "svelte-kit sync && svelte-check --tsconfig ./jsconfig.json",
		"write": "oxlint --fix && oxfmt"
	}
}
```

Do not make Biome auto-fix non-JS files through `write` unless that behavior is
explicitly desired.

---

# Watch-mode policy

Do not attempt to create one shell command that runs multiple long-lived watch
processes with fragile backgrounding.

Recommended:

- keep `svelte-check --watch` for Svelte/type checking;
- use the Oxlint language server for live lint diagnostics in WebStorm;
- use Oxfmt editor integration/format-on-save if desired.

A simple existing `watch` script may remain dedicated to Svelte:

```json
"watch": "svelte-kit sync && svelte-check --tsconfig ./jsconfig.json --watch"
```

Do not sacrifice reliable exit/failure behavior merely to combine all tools into
one terminal process.

---

# WebStorm / JetBrains migration

Both Oxlint and Oxfmt have current JetBrains/WebStorm integration.

At implementation time:

1. install/enable the official Oxc JetBrains integration;
2. verify Oxlint diagnostics appear for `.js`, `.ts` and Svelte `<script>`;
3. verify Oxfmt formatting works for `.js`, `.svelte`, `.css`, `.json` and
   `.md`;
4. keep Tailwind language-server integration;
5. disable Biome editor formatting/linting only after the new editor workflow
   is proven;
6. ensure only one formatter runs on save per file type.

If Biome remains for CSS/JSON linting, avoid competing formatters. Keep Oxfmt as
the formatter and Biome as lint-only.

---

# Lefthook migration

Do not let Oxfmt and Oxlint write to the same staged files in parallel.

Recommended order:

```text
Oxlint safe fixes
        ↓
Oxfmt formatting/import/Tailwind sorting
        ↓
restage changed files
        ↓
svelte-check / other project gates
```

Conceptual commands:

```bash
oxlint --fix --no-error-on-unmatched-pattern {staged_files}
oxfmt --no-error-on-unmatched-pattern {staged_files}
```

Use the actual Lefthook placeholder syntax already used by Mikrouli.

Keep `stage_fixed: true`.

Do not use:

```bash
oxlint --fix-dangerously
```

in a pre-commit hook.

Do not enable suggestion/dangerous fixes automatically.

If Biome is retained for CSS/JSON, its lint step should be read-only or use only
safe fixes after careful testing.

---

# CI migration

CI should exercise the exact same project policy as local checks.

Pure target:

```bash
bun run check:format
bun run check:lint
bun run check:svelte
```

or simply:

```bash
bun run check
```

if the script is reliable and sequential.

Keep build/accessibility/performance checks independent.

Do not use special CI-only lint rules unless CI has a clear reason.

If GitHub Actions currently excludes `biome.jsonc` from path-trigger behavior,
update those exclusions to cover:

```text
.oxlintrc.json
.oxfmtrc.json
```

and `biome.nonjs.jsonc` if the hybrid option is used.

Update workflow documentation accordingly.

---

# Differential lint audit

This is the central safety step.

Do it **before removing Biome**.

## Step 1 — capture modernized Biome results

On a clean tree:

```bash
bun run check:biome
```

or the modernized equivalent.

Capture all lint diagnostics.

Do not include formatter-only differences in the lint comparison.

## Step 2 — run Oxlint defaults

```bash
bunx oxlint
```

Capture all diagnostics.

## Step 3 — classify JavaScript/Svelte-script diagnostics

Create three groups:

```text
A. caught by both
B. Oxlint-only
C. Biome-only
```

For each `C` diagnostic:

- identify the Biome rule;
- identify whether Oxlint has an equivalent built-in rule;
- identify whether TypeScript/svelte-check already catches it;
- decide whether it represents a meaningful regression;
- enable the Oxlint equivalent only if justified.

For each `B` diagnostic:

- confirm it is correct;
- fix the code if appropriate;
- do not disable rules simply because they are new.

## Step 4 — separately capture CSS diagnostics

Run Biome's CSS linting and record:

- number of diagnostics;
- rule names;
- whether they represent real bugs;
- whether Vite/Tailwind/build tooling catches the same problem;
- whether the rule has practical value.

This determines CSS decision A vs B.

## Step 5 — separately capture JSON/JSONC diagnostics

Record whether Biome currently provides useful diagnostics in config/content
JSON.

If not, accepting the loss is easier.

If yes, consider retaining residual Biome alongside CSS.

---

# Controlled negative tests

Do not rely only on the current clean codebase, because a linter that reports
nothing can still differ significantly in protection.

Create temporary local-only mistakes and verify which tool catches them.

Examples:

## JavaScript

- unused import;
- unreachable code;
- obvious constant-condition bug;
- accidental assignment/comparison pattern;
- promise misuse if relevant to enabled rules.

## Svelte

- unused script variable;
- invalid template construct;
- accessibility error;
- bad JSDoc/type usage.

Confirm which issues belong to Oxlint and which remain `svelte-check`.

## CSS

- unknown CSS property;
- malformed value;
- Tailwind directive syntax issue.

Compare Biome vs build pipeline.

## JSON

- duplicate/invalid structure supported by Biome rules;
- malformed JSON syntax.

Separate parser failures from semantic lint rules.

## Tailwind

- misspelled utility;
- duplicate utility;
- conflicting utility;
- non-canonical utility.

Test:

- Tailwind language server;
- optional `oxlint-tailwindcss`;
- Svelte markup specifically.

This makes Oxlint's Svelte limitations concrete rather than theoretical.

Delete all negative-test changes before continuing.

---

# Formatter migration audit

Formatting must be audited separately from linting.

## Step 1 — generate migration config

```bash
bunx oxfmt --migrate biome
```

Do not trust the generated config blindly.

Use it to discover formatting settings that might otherwise be missed.

## Step 2 — list differences without writing

```bash
bunx oxfmt --list-different
```

Classify by:

- JS/TS;
- Svelte;
- CSS;
- JSON/JSONC;
- Markdown;
- package.json;
- other.

## Step 3 — isolate one-time formatting batches

Recommended order:

1. JS/TS parity formatting;
2. Svelte formatting;
3. import sorting;
4. Tailwind class sorting;
5. CSS formatting;
6. Markdown wrapping;
7. JSON/JSONC formatting.

Do not combine all of these with functional refactors.

## Step 4 — run builds after import/Tailwind sorting

Import order can be semantic when side-effect imports are involved.

Tailwind class sorting should be semantic-preserving, but the resulting diff can
still hide accidental edits.

Always run staging and production builds after those formatting batches.

---

# Small-batch implementation plan

## Batch 0 — re-evaluate the migration

No code changes.

1. read this document;
2. read `06-modernize-biome.md`;
3. check current Biome/Oxlint/Oxfmt release status;
4. check Oxfmt stability status;
5. check current Svelte support;
6. check Oxlint custom-parser support;
7. check `oxlint-tailwindcss` Svelte support;
8. confirm current TypeScript major;
9. decide whether the migration still provides a net benefit.

Stop here if it does not.

---

## Batch 1 — install Oxc beside Biome

```bash
bun add -d oxlint oxfmt
```

Do not remove Biome.

Do not change CI or hooks yet.

Run:

```bash
bunx oxlint --version
bunx oxfmt --version
```

Commit dependency changes separately if desired.

---

## Batch 2 — differential lint audit

Follow the full audit above.

Output should be a short migration note listing:

- useful Biome-only JS rules;
- new Oxlint findings;
- CSS decision;
- JSON decision;
- any Svelte false positives/limitations.

Do not remove tools yet.

---

## Batch 3 — formatter dry run

Run:

```bash
bunx oxfmt --migrate biome
bunx oxfmt --list-different
```

Review all language categories.

Decide whether broad Oxfmt formatting is acceptable.

Do not write all files yet.

---

## Batch 4 — add minimal Oxc configs

Add:

```text
.oxlintrc.json
.oxfmtrc.json
```

Keep config intentionally small.

Do not enable:

- type-aware linting;
- JS plugins;
- JSDoc formatting;
- JSDoc lint plugin;
- dangerous fixes;
- extra Oxlint categories wholesale.

---

## Batch 5 — migrate JS/TS linting

Switch local JS/TS lint script to Oxlint.

Keep Biome installed.

Run both tools in comparison mode for at least one clean migration batch.

Fix genuine new Oxlint diagnostics.

Add only justified rule overrides.

---

## Batch 6 — migrate formatting

Adopt Oxfmt in controlled language batches.

Keep formatting-only commits separate from source refactors.

Review:

- Svelte;
- CSS;
- Markdown;
- import order;
- Tailwind class order.

---

## Batch 7 — decide CSS/JSON fate

Choose exactly one:

### Pure Oxc

Remove CSS/JSON linting.

Document the intentional coverage loss.

### Hybrid

Restrict Biome to CSS/JSON linting only.

Document why the extra dependency is worth retaining.

Do not leave responsibility ambiguous.

---

## Batch 8 — update hooks and CI

Only after local behavior is stable.

Update:

- Lefthook;
- package scripts;
- GitHub Actions;
- CI path exclusions;
- WebStorm integration;
- README/tooling docs;
- workflow docs.

Run all checks.

---

## Batch 9 — remove obsolete Biome configuration

Pure Oxc only:

```bash
bun remove @biomejs/biome
```

Delete:

```text
biome.jsonc
```

Remove Biome from:

- `trustedDependencies`;
- Lefthook;
- CI;
- editor settings;
- README;
- workflow documentation;
- path-ignore configuration;
- agent instructions if present.

Search:

```bash
git grep -n -i biome
```

Every remaining reference must be intentional historical documentation or this
future-reference migration document.

Hybrid path:

- delete the old full-project Biome config;
- keep only the narrow non-JS config;
- update documentation to describe its reduced responsibility.

---

## Batch 10 — full regression gate

Run:

```bash
bun run check
bun run check:all
bun run build
bun run build:prod
bun run test:axe
bun run test:lighthouse
```

Also test:

- pre-commit on JS;
- pre-commit on Svelte;
- pre-commit on CSS;
- pre-commit on Markdown;
- pre-commit on JSON;
- staging deployment;
- production build artifact;
- WebStorm lint/format behavior.

Only then consider the migration complete.

---

# Optional post-migration step — JSDoc formatting

This step is intentionally **outside** the base migration.

Evaluate:

```jsonc
"jsdoc": true
```

in Oxfmt on a separate branch/commit.

Acceptance criteria:

- JSDoc remains readable;
- no type inference changes;
- `svelte-check` stays clean;
- examples remain correctly formatted;
- no undesirable mass churn;
- the resulting style is preferred over the current one.

If not clearly better, leave JSDoc formatting disabled.

---

# Optional post-migration step — `oxlint-tailwindcss`

Only evaluate after the base Oxc migration is stable.

Check the then-current plugin documentation first.

Questions:

1. does it now understand Svelte markup under Oxlint?
2. does it still require an explicit Tailwind entry point?
3. which rules are stable and useful?
4. does it duplicate Tailwind language-server diagnostics?
5. does it work with Mikrouli's Tailwind 4 configuration?
6. does it understand Svelte class arrays/objects?
7. do fixes preserve class semantics?
8. is the maintenance/adoption level acceptable?

If Svelte markup still cannot be linted, its value for Mikrouli remains limited.

Do not add the plugin simply to increase rule count.

---

# Optional post-TypeScript-7 step — type-aware Oxlint

Do this only after the separate TypeScript 7 migration.

Then evaluate:

```bash
bun add -d oxlint-tsgolint
```

and:

```jsonc
{
	"options": {
		"typeAware": true
	}
}
```

Compare with existing `svelte-check`/TypeScript diagnostics.

Do not enable `typeCheck` merely because it can replace `tsc`; Mikrouli uses
Svelte/JSDoc tooling and must preserve Svelte-aware checking.

Only retain type-aware lint rules that add useful signal without duplicate
noise.

---

# Optional post-migration step — package.json sorting

The baseline migration deliberately disables Oxfmt's default package sorting.

Later evaluate:

```jsonc
"sortPackageJson": true
```

in a formatting-only commit.

This is cosmetic and should never block the core migration.

---

# Rollback strategy

The migration should remain easy to reverse until the final Biome removal batch.

Before removing Biome:

```text
Biome stays installed
+ original modernized biome config stays available
+ Oxc is run in parallel
```

If:

- Oxfmt produces unacceptable Svelte formatting;
- Oxlint misses useful diagnostics;
- CSS/JSON coverage loss feels unsafe;
- editor integration regresses;
- hooks become less reliable;
- Oxfmt beta behavior causes churn;

stop and revert the Oxc branch.

Do not force migration completion because significant effort has already been
invested.

---

# Acceptance criteria

The migration is complete only when all of the following are true.

## Tooling

- [ ] Oxlint is the documented JS/TS linter.
- [ ] Oxfmt is the documented formatter.
- [ ] `svelte-check` remains the Svelte/JSDoc/type semantic checker.
- [ ] CSS linting policy is explicit: removed or residual Biome.
- [ ] JSON linting policy is explicit.
- [ ] Markdown linting is explicitly out of scope.
- [ ] Tailwind class-sorting policy is explicit.
- [ ] JSDoc formatting remains disabled unless separately adopted.
- [ ] Type-aware Oxlint remains disabled until TypeScript 7 unless prerequisites
      changed.

## Configuration

- [ ] Oxc configs are minimal.
- [ ] generated data is excluded.
- [ ] `.agents/skills` is excluded.
- [ ] `.editorconfig` remains the basic whitespace/width source.
- [ ] import sorting preserves side-effect order.
- [ ] package.json sorting is not introduced accidentally.
- [ ] no wholesale Oxlint categories were enabled only for Biome parity.

## Coverage

- [ ] Biome vs Oxlint JS diagnostics were compared.
- [ ] meaningful Biome-only diagnostics were explicitly handled.
- [ ] CSS lint coverage was tested before removal.
- [ ] JSON lint coverage was tested before removal.
- [ ] Svelte template diagnostics still work through `svelte-check`.
- [ ] Tailwind editor diagnostics still work.
- [ ] no claim is made that `oxlint-tailwindcss` replaces CSS linting.

## Workflow

- [ ] `bun run check` fails reliably on every failing sub-check.
- [ ] no quality gate uses fragile shell background `&`.
- [ ] Lefthook fixes are sequential.
- [ ] no dangerous Oxlint fixes run automatically.
- [ ] CI uses the same policy as local checks.
- [ ] WebStorm uses one formatter per file type.

## Regression

- [ ] `bun run check` passes.
- [ ] `bun run check:all` passes.
- [ ] staging build passes.
- [ ] production build passes.
- [ ] axe tests pass to the existing project standard.
- [ ] Lighthouse tests pass to the existing project standard.
- [ ] staged-file hooks were manually exercised.
- [ ] formatting-only diffs were separated from functional changes.

---

# Future recommendation heuristic

When this document is revisited, use this simple decision rule:

## Prefer modernized Biome when

- one-tool simplicity is still valuable;
- CSS/JSON linting is useful;
- Biome Svelte support has improved;
- Oxfmt remains beta or causes formatting churn;
- Oxc's speed does not materially improve workflow;
- Oxc requires extra plugins/tools to restore lost coverage.

## Prefer Oxc when

- Oxfmt is stable and clearly preferred;
- Oxlint/Oxfmt materially improve developer/agent/CI feedback;
- Svelte support has improved enough for the project;
- CSS/JSON linting can safely be dropped or replaced cleanly;
- the project values Oxc's dedicated-tool architecture;
- Tailwind/import formatting improvements are valuable;
- Oxlint's rule ecosystem provides concrete useful capabilities.

The migration is justified only when the second list wins on **practical project
value**, not on benchmark numbers or ecosystem momentum alone.

---

# Short reference summary

If Mikrouli eventually migrates:

```text
Required
├── Oxlint for JS/TS
├── Oxfmt for formatting
├── svelte-check stays
├── preserve import sorting
├── preserve Markdown prose wrapping
├── preserve generated-file exclusions
├── explicitly enable Svelte formatting
├── explicitly decide CSS linting
├── explicitly decide JSON linting
└── review all one-time formatter diffs

Recommended target enhancement
└── Oxfmt Tailwind class sorting, in a dedicated formatting batch

Do not enable during baseline migration
├── JSDoc formatting
├── Oxlint type-aware mode
├── oxlint-tsgolint
├── Oxlint JS plugins
├── oxlint-tailwindcss
├── dangerous/suggestion autofixes
├── package.json sorting
└── wholesale non-default lint categories

Optional later
├── JSDoc formatting
├── oxlint-tailwindcss
├── type-aware linting after TypeScript 7
└── package.json sorting
```

The safest long-term sequence remains:

```text
06-modernize-biome.md
        ↓
use modernized Biome
        ↓
re-evaluate Oxc later
        ↓
only then execute this migration plan
```
