# Mikrouli Biome Modernization

> Research snapshot: 2026-08-22  
> Current Biome: `@biomejs/biome ^2.5.10`  
> Current frontend: Svelte 5 / SvelteKit 2 / Tailwind CSS 4  
> Runtime/package manager: Bun 1.4  
> Audience: GitHub Copilot coding agent or developer implementing the modernization  
> Status: implementation-ready, low-risk tooling modernization  
> Ordering: complete this before any later `Biome -> Oxlint + Oxfmt` migration decision

## Objective

Modernize the existing Biome setup **without committing Mikrouli to Oxc**.

The immediate goals are:

- update deprecated Biome 2.5 configuration syntax;
- preserve the project's existing recommended lint policy;
- preserve automatic import organization;
- preserve Tailwind CSS 4 parsing;
- keep the currently recommended Svelte fallback overrides while Biome full
  Svelte support remains experimental;
- make package scripts accurately reflect what they check;
- ensure failed checks cannot be accidentally hidden by shell backgrounding;
- remove broad parse-error suppression if the current repository no longer needs
  it;
- establish a clean modern Biome baseline that can later be compared fairly with
  Oxlint/Oxfmt.

This objective is intentionally useful even if Mikrouli never migrates to Oxc.

---

# Recommendation after current Oxc research

Do **not** treat an Oxc migration as the default next step.

The preferred sequence is now:

```text
modernize current Biome
        |
        v
use the modernized setup normally
        |
        v
only migrate to Oxc if a concrete benefit remains compelling
```

For Mikrouli today, modernized Biome has a strong architectural advantage:

```text
Biome
├── JavaScript / TypeScript linting
├── CSS linting
├── JSON / JSONC linting
├── Tailwind CSS 4 parser support
├── import organization
└── formatting for its supported/stable languages

svelte-check
└── Svelte + JSDoc/TypeScript semantic checking
```

Oxlint is a mature, fast JS/TS linter, but an Oxc replacement currently trades
that broad coverage for a more fragmented toolchain:

```text
Oxlint
└── JavaScript / TypeScript + Svelte <script> linting

Oxfmt
└── formatting

svelte-check
└── Svelte semantics

lost or separately replaced
├── CSS linting
└── JSON linting
```

Oxfmt is also still officially beta as of this research snapshot, while Oxlint
itself is stable. For a relatively small Svelte site, Oxc's speed advantage is
real but unlikely to create enough day-to-day value by itself to justify losing
Biome's CSS/JSON coverage and changing two tools at once.

Therefore the current recommendation is:

> **Modernize and keep Biome for now. Treat Oxc as an optional later migration,
> not modernization work that must happen.**

Revisit Oxc when one or more of these become true:

1. Oxfmt reaches stable and remains clearly preferable for Mikrouli's formatting
   needs.
2. Oxlint gains materially better Svelte/template integration.
3. Oxc gains first-party CSS/HTML linting that removes the current coverage gap.
4. Biome performance becomes measurable friction in local hooks, CI, or agentic
   workflows.
5. An Oxlint rule/plugin provides important protection that Biome cannot provide.
6. Oxfmt's Tailwind sorting or another Oxc-only capability produces enough
   practical value to justify the split toolchain.

---

# Current configuration assessment

The existing `biome.jsonc` is generally sensible and already follows several
current Biome recommendations.

## Keep unchanged in the baseline modernization

### VCS integration

Keep:

```jsonc
"vcs": {
  "enabled": true,
  "clientKind": "git",
  "defaultBranch": "main",
  "useIgnoreFile": true
}
```

This lets Biome respect Git ignore files and supports staged/changed-file
workflows.

### Generated/source exclusions

Keep the current exclusions:

```jsonc
"files": {
  "includes": ["**", "!src/data/generated", "!.agents/skills"]
}
```

`src/data/generated` should remain excluded from normal formatting/linting while
still being available to other project tooling when needed.

### EditorConfig integration

Keep:

```jsonc
"formatter": {
  "enabled": true,
  "useEditorconfig": true
}
```

Mikrouli already centralizes basic whitespace/line-width conventions in
`.editorconfig`; do not duplicate them in Biome without a concrete reason.

### Import organization

Keep:

```jsonc
"assist": {
  "actions": {
    "source": {
      "organizeImports": "on"
    }
  }
}
```

This is intentional project behavior and should remain enforced by `biome check`
and applied by `biome check --write`.

Do **not** enable `sortBareImports` automatically. Bare imports can have side
effects and their order can be semantically meaningful.

### Tailwind CSS 4 parsing

Keep:

```jsonc
"css": {
  "parser": {
    "tailwindDirectives": true
  }
}
```

This is still the current Biome option for understanding Tailwind 4 syntax such
as `@theme`, `@utility` and `@apply`.

### Svelte fallback overrides

Keep the existing Svelte override for the baseline modernization:

```jsonc
{
  "includes": ["**/*.svelte"],
  "linter": {
    "rules": {
      "style": {
        "useConst": "off",
        "useImportType": "off"
      },
      "correctness": {
        "noUnusedImports": "off",
        "noUnusedVariables": "off"
      }
    }
  }
}
```

These are not arbitrary legacy suppressions. Biome's current documentation
recommends effectively these overrides when
`html.experimentalFullSupportEnabled` is disabled, because partial Svelte
analysis can otherwise create false positives.

Do not remove them merely to make the configuration shorter.

---

# Required modernization

## 1. Migrate deprecated `recommended` syntax

Biome 2.5 deprecated:

```jsonc
"recommended": true
```

in favor of:

```jsonc
"preset": "recommended"
```

First preview Biome's own migration:

```bash
bunx biome migrate
```

Then apply it only after reviewing the diff:

```bash
bunx biome migrate --write
```

The expected linter section is:

```jsonc
"linter": {
  "enabled": true,
  "rules": {
    "preset": "recommended",
    "correctness": {
      "noUnusedImports": {
        "level": "error"
      }
    }
  }
}
```

Do not switch to `preset: "all"` and do not enable the nursery group wholesale.
This objective modernizes the existing policy rather than making the linter more
opinionated.

## 2. Remove redundant `files.ignoreUnknown: false`

`false` is already Biome's default.

Remove:

```jsonc
"ignoreUnknown": false
```

This is a pure configuration simplification and does not change normal project
behavior.

The staged-file hook may still need its CLI equivalent that ignores unsupported
staged file types; that is a separate concern from the project-wide default.

---

# Package-script modernization

The current scripts use shell backgrounding:

```json
"check": "bun run check:format & bun run check:lint",
"check:ci": "biome ci --skip-parse-errors & bun run check:lint",
"check:all": "bun run check & bun run build -l warn"
```

This is unsafe as a quality gate. In a normal POSIX shell, the backgrounded
process does not determine the foreground command's exit status. A Biome/check
failure can therefore occur without reliably making the compound command fail.

Replace parallel `&` with explicit successful sequencing using `&&`.

Also fix the current naming problem: `check:format` runs `biome check`, which is
not format-only, while `check:lint` currently runs `svelte-check`, which is not
the project's Biome linter.

Recommended target:

```json
{
  "scripts": {
    "check": "bun run check:biome && bun run check:svelte",
    "check:ci": "biome ci && bun run check:svelte",
    "check:all": "bun run check && bun run build -l warn",
    "check:biome": "biome check",
    "check:format": "biome format",
    "check:lint": "biome lint",
    "check:svelte": "svelte-kit sync && svelte-check --tsconfig ./jsconfig.json",
    "write": "biome check --write"
  }
}
```

Advantages:

- `check` is the complete local static-analysis gate;
- `check:ci` uses Biome's purpose-built CI command;
- `check:format` actually means formatting only;
- `check:lint` actually means linting only;
- `check:svelte` owns Svelte/JSDoc/type checking;
- `check:biome` remains the useful all-in-one Biome local check;
- every failure propagates reliably.

Do not introduce a task-runner dependency just to recover parallel execution.
For this project, correctness and simple failure semantics are more valuable
than shaving a small amount of local check time.

---

# Remove broad parse-error suppression if possible

The current scripts and pre-commit hook use:

```text
--skip-parse-errors
```

This tells Biome to skip syntax-error diagnostics rather than treating them as a
normal failure. It can be useful as a compatibility workaround, but it also
makes a quality gate weaker.

Treat removal as a deliberate compatibility test:

1. run the current baseline with `--skip-parse-errors`;
2. run the same command without it;
3. classify every newly surfaced parse diagnostic;
4. fix real syntax/configuration problems;
5. if a diagnostic is caused by unsupported-but-valid Svelte syntax, preserve a
   narrow workaround rather than globally weakening all files;
6. remove `--skip-parse-errors` from package scripts and Lefthook only when the
   repository passes cleanly.

Target:

```bash
biome check
biome ci
```

rather than:

```bash
biome check --skip-parse-errors
biome ci --skip-parse-errors
```

If valid current project syntax still requires the flag, keep it and document
which file/language requires it. Do not force removal merely for aesthetic
configuration purity.

---

# Lefthook modernization

The current pre-commit Biome command is roughly:

```yaml
format:
  run: bun run biome check --write --no-errors-on-unmatched
    --files-ignore-unknown=true --skip-parse-errors --colors=off {staged_files}
  stage_fixed: true
```

Preserve the useful staged-file behavior:

- process only staged files;
- safely apply Biome formatting/lint/assist fixes;
- restage modified files;
- ignore unsupported staged file types;
- avoid noisy colors in hook output.

But remove `--skip-parse-errors` if the compatibility gate above proves it is no
longer necessary.

Do not split formatting, lint fixes and import organization into multiple hook
commands merely for conceptual purity. `biome check --write` is designed to do
these operations together and is one of Biome's main benefits.

Also keep the independent `svelte-check`, asset and production-build hook gates
unless a separate workflow objective changes them.

---

# Optional modernization: stable CSS formatting

Biome currently parses/lints CSS, including Tailwind 4 syntax, but its CSS
formatter is disabled by default unless explicitly enabled.

This is different from CSS linting.

A separate, reviewable optional batch may enable:

```jsonc
"css": {
  "parser": {
    "tailwindDirectives": true
  },
  "formatter": {
    "enabled": true
  }
}
```

Recommended procedure:

1. enable it on a clean branch;
2. run `biome format --write` only on representative CSS files first;
3. review Tailwind directives, custom utilities, layers and `@apply` usage;
4. if output is good, format all standalone CSS in one formatting-only commit;
5. run both staging and production builds.

This is a good enhancement **if Biome is retained long-term**, but it is not
required for the baseline config migration.

Do not mix the resulting CSS formatting diff with functional CSS changes.

---

# Optional experiment: full Svelte support

Biome 2.4+ can experimentally parse Svelte markup and embedded CSS rather than
only extracting JavaScript/TypeScript.

The switch is:

```jsonc
"html": {
  "experimentalFullSupportEnabled": true
}
```

Formatting the HTML-ish/Svelte structure additionally uses the experimental HTML
formatter.

Biome still explicitly labels this support experimental. Mikrouli values
stability, so **do not enable it in the required modernization batch**.

Instead, if desired, create a separate experiment:

1. enable `html.experimentalFullSupportEnabled` on a temporary branch;
2. run linting against every `.svelte` file;
3. inventory new template/CSS/a11y diagnostics;
4. specifically check for false positives around Svelte 5 runes, snippets,
   declaration tags and modern class arrays/objects;
5. compare results with `svelte-check`;
6. only then test experimental Svelte formatting;
7. remove the current Svelte overrides only if full-support mode proves they are
   genuinely unnecessary;
8. do not adopt the experiment if it creates noisy or unstable diagnostics.

This is a future capability evaluation, not a prerequisite for keeping Biome.

---

# Optional experiment: Tailwind-specific Biome nursery rules

Biome now contains Tailwind-aware nursery rules such as:

- `useTailwindShorthandClasses`;
- `useSortedClasses`.

Do not enable them by default in this modernization.

Reasons:

- both are nursery/experimental;
- `useSortedClasses` remains only partially implemented and uses unsafe fixes;
- current support has limitations around Svelte class arrays/objects and
  template expressions;
- Mikrouli's upcoming Modern Svelte work intentionally moves more classes toward
  Svelte 5 array/object composition, which is precisely one of the documented
  limitation areas.

If Tailwind class sorting becomes a strong requirement, compare this again with
Oxfmt's Tailwind integration at the future Oxc decision gate.

---

# Do not add Markdown tooling in this objective

Biome does not currently provide Markdown linting, and Markdown is not part of
the reason to keep or replace Biome.

Do not add `markdownlint`, Prettier, Oxfmt, or another Markdown tool as part of
this modernization.

If Markdown quality or wrapping becomes a concrete problem, scope it separately.

---

# Do not enable type-aware/project rules just because they exist

Biome 2.5 significantly expanded cross-file and type-aware analysis. This is
interesting, but adopting new rule domains would change the project's lint
policy rather than modernize the existing one.

Keep the recommended preset as the baseline.

Later, evaluate individual rules only when they solve a real problem. Good
candidates can be tested one at a time, but do not enable `all`, nursery, project
or type-aware domains wholesale.

Mikrouli already has strict JSDoc/TypeScript checking through `svelte-check` and
`jsconfig.json`; avoid redundant complexity without demonstrated value.

---

# Target baseline `biome.jsonc`

After the required modernization, but before optional CSS/Svelte experiments,
the configuration should remain intentionally close to the current one:

```jsonc
{
  "$schema": "./node_modules/@biomejs/biome/configuration_schema.json",
  "vcs": {
    "enabled": true,
    "clientKind": "git",
    "defaultBranch": "main",
    "useIgnoreFile": true
  },
  "files": {
    "includes": ["**", "!src/data/generated", "!.agents/skills"]
  },
  "formatter": {
    "enabled": true,
    "useEditorconfig": true
  },
  "assist": {
    "actions": {
      "source": {
        "organizeImports": "on"
      }
    }
  },
  "linter": {
    "enabled": true,
    "rules": {
      "preset": "recommended",
      "correctness": {
        "noUnusedImports": {
          "level": "error"
        }
      }
    }
  },
  "css": {
    "parser": {
      "tailwindDirectives": true
    }
  },
  "overrides": [
    {
      "includes": ["**/*.svelte"],
      "linter": {
        "rules": {
          "style": {
            "useConst": "off",
            "useImportType": "off"
          },
          "correctness": {
            "noUnusedImports": "off",
            "noUnusedVariables": "off"
          }
        }
      }
    }
  ]
}
```

Do not minimize the file further solely because some values are defaults. The
remaining explicit settings document intentional project policy and make a
future Biome/Oxc comparison easier.

---

# Small-batch implementation plan

## Batch 0 — baseline

No code changes.

1. Ensure the working tree is clean.
2. Record `biome --version`.
3. Run and record current results:

```bash
bun run check
bun run check:ci
bun run check:all
bun run build
bun run build:prod
```

4. Run direct Biome commands and save diagnostics:

```bash
biome check
biome lint
biome format
```

5. Record any diagnostics currently hidden by `--skip-parse-errors`.

## Batch 1 — configuration migration

1. Preview `biome migrate`.
2. Change `recommended: true` to `preset: "recommended"`.
3. Remove redundant `files.ignoreUnknown: false`.
4. Keep Tailwind parsing, import organization and Svelte overrides unchanged.
5. Run `biome check` and compare diagnostics with Batch 0.

Expected behavior change: **none**.

## Batch 2 — make check failures reliable

1. Replace shell `&` quality-gate composition with `&&`.
2. Add clear `check:biome`, `check:lint`, and `check:svelte` ownership.
3. Make `check:format` format-only.
4. Keep `write` as `biome check --write`.
5. Confirm a deliberately introduced Biome error makes `check`, `check:ci` and
   `check:all` exit non-zero.
6. Confirm a deliberately introduced `svelte-check` error does the same.
7. Remove the temporary errors.

This batch is important even if no other Biome changes are adopted.

## Batch 3 — parse-error hardening

1. Run without `--skip-parse-errors`.
2. Fix or classify every newly visible issue.
3. Remove the flag from package scripts if clean.
4. Remove it from Lefthook if staged-file testing is clean.
5. If the flag must remain, document the exact supported syntax that requires
   it.

## Batch 4 — pre-commit parity

Test staged changes for:

- `.js`;
- `.svelte`;
- `.css`;
- `.json`/`.jsonc`;
- `.md`;
- an image or other unsupported file type.

Verify:

- supported files are checked;
- safe fixes/import organization are restaged;
- unsupported files do not break the hook;
- real parse/lint failures do break the hook;
- the production build gate still behaves as before.

## Batch 5 — optional CSS formatter

Do only if desired after the baseline modernization.

Keep this as a formatting-only commit.

## Batch 6 — optional experimental Svelte audit

Do only as a temporary experiment while Biome still labels full support
experimental.

Do not make adoption a completion criterion for this document.

---

# Acceptance criteria

The required modernization is complete when:

1. Biome 2.5 configuration uses current non-deprecated lint preset syntax.
2. Import organization behaves exactly as before.
3. Tailwind CSS 4 directives continue to parse correctly.
4. Existing Svelte fallback overrides remain unless a separate full-support
   experiment proves they are unnecessary.
5. `check:format`, `check:lint`, `check:svelte` and `check:biome` have clear,
   accurate ownership.
6. `check`, `check:ci` and `check:all` reliably fail when any constituent quality
   gate fails.
7. `biome ci` remains the CI-specific Biome command.
8. `--skip-parse-errors` has either been removed or retained with a specific,
   documented compatibility reason.
9. Lefthook still safely fixes/restages staged supported files and ignores
   unsupported staged file types.
10. Staging and production builds remain green.
11. No nursery rules, experimental full Svelte support, Markdown tooling or
    type-aware policy expansion was silently added.
12. The resulting configuration is a clean baseline for a future Oxc comparison.

---

# Future Oxc decision gate

If Oxc is reconsidered later, compare it against **this modernized Biome
baseline**, not the old configuration.

Measure:

- actual local `check` time;
- pre-commit time;
- CI time;
- JS/TS diagnostics unique to each linter;
- CSS/JSON diagnostics that would be lost;
- Svelte behavior;
- Tailwind class-formatting/linting behavior;
- WebStorm integration;
- formatting diff size;
- maintenance/configuration complexity.

Migration should happen only if the result is a net simplification or a
measurable improvement for Mikrouli.

A useful default decision rule is:

```text
Oxc is substantially faster
        +
better developer/agent UX
        +
no important coverage loss
        -> migrate

otherwise
        -> keep Biome
```

Do not migrate because Oxc is newer or because reducing one dependency sounds
modern in isolation.

---

# Research sources

## Biome

- Biome v2.5 release / preset migration / 500+ rules  
  https://biomejs.dev/blog/biome-v2-5/
- Configuration reference  
  https://biomejs.dev/reference/configuration/
- Language support / experimental Svelte support  
  https://biomejs.dev/internals/language-support/
- CLI reference / `check`, `ci`, `--watch`, `--skip-parse-errors`  
  https://biomejs.dev/reference/cli/
- CI guidance (`check` vs `ci`)  
  https://biomejs.dev/recipes/continuous-integration/
- VCS integration  
  https://biomejs.dev/guides/integrate-in-vcs/
- Import organization  
  https://biomejs.dev/assist/actions/organize-imports/
- Tailwind shorthand rule  
  https://biomejs.dev/linter/rules/use-tailwind-shorthand-classes/
- Utility/Tailwind class sorting rule  
  https://biomejs.dev/linter/rules/use-sorted-classes/

## Oxc comparison context

- Oxlint 1.0 stable  
  https://oxc.rs/blog/2025-06-10-oxlint-stable
- Oxlint versioning / experimental feature boundaries  
  https://oxc.rs/docs/guide/usage/linter/versioning
- Oxfmt beta announcement  
  https://oxc.rs/blog/2026-02-24-oxfmt-beta
- Oxfmt language support  
  https://oxc.rs/docs/guide/usage/formatter/language-support

## Mikrouli baseline

Use the latest repository/package/configuration state at implementation time,
not older roadmap snapshots. In particular, this research used the current
uploaded `biome.jsonc` and `package.json` baseline from 2026-08-22.
