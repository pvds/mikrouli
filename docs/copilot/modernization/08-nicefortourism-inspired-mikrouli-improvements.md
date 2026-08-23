# Mikrouli Improvements Inspired by Nice for Tourism

## Purpose

This document captures improvements from the current Nice for Tourism project that are worth considering for Mikrouli.

The goal is **not** to make Mikrouli structurally resemble Nice for Tourism. The two projects have different requirements:

- **Mikrouli** is a SvelteKit 2 static site using Tailwind CSS 4, Contentful, generated content, and multiple deployment targets.
- **Nice for Tourism** is a smaller publication-style site with a different rendering and styling architecture.

The useful lessons are therefore mostly about:

- validation,
- project instructions,
- documentation structure,
- accessibility resilience,
- responsive component design,
- CSS architecture principles,
- rendering-performance discipline,
- and progressive enhancement.

Each recommendation below should be treated as an independent improvement unless explicitly stated otherwise.

---

# 1. Add Built-HTML Validation

## Recommendation

**Adopt.**

Nice for Tourism validates generated HTML in addition to running accessibility and browser-level tests.

Mikrouli currently has:

- `svelte-check`,
- axe,
- Lighthouse,
- prerender/build validation,

but generated HTML can still contain markup problems that source-level tooling does not necessarily catch.

This is especially relevant because Mikrouli HTML can originate from several layers:

```text
Svelte templates
+
Contentful content
+
Markdown rendering
+
shortcodes/embeds
+
generated routes
```

## Why this is valuable

HTML validation can catch issues such as:

- invalid element nesting,
- duplicate or malformed attributes,
- invalid ARIA relationships,
- malformed markup produced by CMS content,
- incorrect generated embed markup,
- markup that browsers repair silently,
- problems that do not necessarily trigger `svelte-check`.

This complements axe rather than replacing it.

### Responsibility split

```text
svelte-check
→ Svelte, JavaScript and type correctness

HTML validator
→ validity of generated markup

axe
→ accessibility rules in the rendered page

Lighthouse
→ broader performance, accessibility, SEO and best-practice checks
```

## Recommended implementation

Validate the **built output**, not individual `.svelte` files.

For example:

```text
build/staging/**/*.html
build/production/**/*.html
```

Prefer one validation command that can be reused locally and in CI.

Possible project command:

```json
"test:html": "..."
```

Then incorporate it into the relevant verification flow.

## Suggested scope

Start by validating the production build only.

If that proves stable and cheap, validate staging as well.

## Acceptance criteria

- Production-generated HTML can be validated locally.
- Validation failures cause CI to fail.
- CMS-generated and shortcode-generated markup is included.
- Known intentional exceptions are documented rather than silently ignored.

---

# 2. Introduce a Clear Agent Instruction Architecture

## Recommendation

**Adopt.**

Nice for Tourism has a clearer separation between:

- global project instructions,
- scoped instructions,
- project-owned skills,
- externally managed skills,
- and ordinary project documentation.

Mikrouli already has many good architectural decisions documented in modernization documents, but those documents are primarily migration plans rather than permanent operational instructions.

## Problem to solve

Important project invariants are currently spread across:

- README,
- modernization documents,
- workflow documentation,
- project-specific skills,
- configuration files,
- implicit conventions.

An agent working on one component should not need to infer all of these.

## Proposed structure

```text
AGENTS.md

.github/
  copilot-instructions.md
  instructions/
    svelte.instructions.md
    content.instructions.md
    tests.instructions.md
    scripts.instructions.md
  skills/
    ...

.agents/
  skills/
    ...

docs/
  modernization/
    ...
```

## `AGENTS.md`

`AGENTS.md` should contain stable project-wide rules.

Recommended topics:

### Architecture

- SvelteKit static-site generation is intentional.
- Keep strict prerendering.
- Support staging and production deployment targets.
- Preserve GitHub Pages base-path behavior.
- Contentful remains the CMS source.
- Generated CMS data should stay deterministic.

### Engineering principles

- Prefer web standards over custom JavaScript.
- Prefer HTML/CSS-first solutions where practical.
- Minimize client-side JavaScript.
- Keep perceived performance a primary metric.
- Accessibility should remain WCAG AA or better.
- Avoid unnecessary dependencies.
- Prefer small, independently reviewable changes.

### Tooling

- Bun is the runtime and package manager.
- Do not introduce Node-specific tooling unless Bun cannot reasonably support the use case.
- `.agents/skills` is externally managed.
- Project-owned skills belong in the project-specific skills directory.

### Svelte

- Prefer current stable Svelte idioms where they clearly replace older patterns.
- Do not rewrite working code merely to use a newer syntax.
- Preserve SSR/SSG compatibility.
- Avoid unnecessary client-side state.

### Content

- Generated content may come from Contentful and Markdown.
- Never assume CMS content is trusted markup.
- Preserve semantic structure.
- Keep shortcode behavior deterministic.

## Scoped instruction files

Use scoped instructions only when they materially reduce irrelevant context.

### `svelte.instructions.md`

Examples:

- component conventions,
- rune usage,
- accessibility expectations,
- state/lifecycle guidance,
- component responsibility boundaries.

### `content.instructions.md`

Examples:

- Contentful transformations,
- Markdown rules,
- shortcode conventions,
- content safety,
- SEO fields,
- generated data rules.

### `tests.instructions.md`

Examples:

- which checks apply to which change,
- browser-test conventions,
- accessibility regression rules,
- Lighthouse expectations.

### `scripts.instructions.md`

Examples:

- Bun-first scripting,
- filesystem conventions,
- generated assets,
- error handling,
- deterministic output.

## Important constraint

Do not duplicate entire documents across instruction files.

Prefer:

```text
global invariant
→ AGENTS.md

domain-specific rule
→ scoped instruction

migration-specific decision
→ docs/modernization/

human-facing workflow explanation
→ README / CONTRIBUTING
```

## Acceptance criteria

- An agent can understand the project's main architectural constraints from `AGENTS.md`.
- Svelte-specific work does not require loading unrelated CMS instructions.
- Modernization plans are no longer the only source for permanent project rules.
- Generated/external skills remain clearly separated from project-owned instructions.

---

# 3. Improve Documentation Boundaries

## Recommendation

**Adopt.**

Mikrouli documentation currently mixes several concerns that could be separated more cleanly.

The existing brand guide includes:

- identity,
- mission,
- tone,
- copy guidance,
- colors,
- typography,
- imagery,
- motion,
- layout,
- accessibility.

This is useful as one source of truth, but unnecessarily broad when used as implementation context.

## Proposed documentation structure

```text
README.md
CONTRIBUTING.md
CHANGELOG.md

docs/
  architecture.md
  workflow.md
  COPY.md
  STYLEGUIDE.md
  modernization/
    ...
```

## `README.md`

Keep it focused on:

- what Mikrouli is,
- core technology,
- setup,
- primary scripts,
- project structure,
- links to deeper documentation.

Avoid making README the source of truth for every architectural rule.

## `COPY.md`

Move editorial guidance here.

Recommended content:

- brand voice,
- first-person versus second-person usage,
- tone,
- terminology,
- culturally sensitive language,
- therapy-related wording principles,
- CTA language,
- examples.

This is particularly useful for:

- Contentful editing,
- AI-assisted copy changes,
- page-content review.

## `STYLEGUIDE.md`

Move implementation-facing visual guidance here:

- colors,
- semantic color roles,
- typography,
- spacing,
- imagery,
- iconography,
- motion,
- component behavior,
- accessibility considerations.

## `architecture.md`

Document stable technical architecture:

```text
Contentful
  ↓
content fetch
  ↓
content processing
  ↓
generated structured data
  ↓
SvelteKit routes/components
  ↓
static build
  ↓
GitHub Pages / Netlify
```

Also document deliberate constraints:

- why SSG is used,
- why client-side JS is minimized,
- why there are two deployment targets,
- why Contentful content is transformed before rendering,
- asset-generation architecture.

## `workflow.md`

Keep it narrowly focused on:

- branch/deployment behavior,
- CI/CD,
- staging versus production,
- Contentful-triggered deploys,
- verification stages.

Audit it for contradictions whenever pipeline behavior changes.

## `CHANGELOG.md`

Add one when versioned releases become meaningful.

Avoid building elaborate changelog automation before there is a real need.

## Documentation drift audit

As part of this work, verify that documentation matches current dependencies and workflow.

Examples of things worth checking:

- tools mentioned in README but no longer installed,
- outdated package-manager instructions,
- stale deployment behavior,
- old file paths,
- removed scripts,
- renamed workflows.

## Acceptance criteria

- Each document has one clear responsibility.
- Project architecture can be understood without reading migration documents.
- Copy guidance can be loaded independently from visual implementation guidance.
- README accurately represents the current project.
- Workflow documentation matches CI behavior.

---

# 4. Add a Small `CONTRIBUTING.md`

## Recommendation

**Adopt, but keep it concise.**

Even for a mostly personal project, a contribution guide is useful because it defines what "finished" means for both human contributors and coding agents.

## Suggested contents

### General engineering rules

- Preserve semantic HTML.
- Prefer native HTML before ARIA.
- Prefer CSS/platform APIs before JavaScript where practical.
- Do not suppress Svelte/type/accessibility errors without documented reason.
- Avoid unrelated refactors in the same change.
- Preserve staging and production behavior.

### Content changes

- Follow `COPY.md`.
- Preserve calm, human, non-judgmental language.
- Verify links.
- Verify generated Markdown.
- Verify shortcode output.
- Check metadata and SEO where relevant.

### UI changes

- Check keyboard interaction.
- Check focus visibility.
- Check narrow layouts.
- Check zoom/text scaling where relevant.
- Respect reduced motion.
- Preserve meaningful source order.

### Before merge

Suggested baseline:

```text
bun run check
relevant build
HTML validation when generated markup changes
axe when rendered UI changes
Lighthouse when performance-sensitive behavior changes
```

Do not require every expensive test for every documentation-only change.

## Acceptance criteria

- The file remains short enough to scan quickly.
- It defines acceptance criteria instead of repeating the README.
- Agents can determine what verification is appropriate for a change.

---

# 5. Strengthen Accessibility Resilience

## Recommendation

**Adopt selectively.**

Mikrouli already treats accessibility as a core principle and runs axe.

Nice for Tourism adds useful resilience considerations that go beyond automated WCAG checks.

## Areas to audit

### Forced-colors mode

Check:

- buttons,
- links,
- navigation,
- form controls,
- focus indicators,
- dialogs,
- icons.

Avoid important states that rely only on background colors or decorative effects.

### Zoom and text enlargement

Test approximately:

```text
200% zoom
400% zoom where practical
```

Check:

- navigation,
- modal/dialog content,
- cards,
- long headings,
- buttons,
- contact information,
- blog/service detail layouts.

Avoid clipped text or content becoming unreachable.

### Narrow viewport resilience

Use approximately `320px` as a useful minimum stress test.

The page should not require horizontal scrolling except for components where horizontal scrolling is explicitly intentional.

### Interaction target size

For touch-oriented controls, aim for approximately:

```text
44–48px
```

usable target size where practical.

This is particularly important for:

- mobile navigation,
- close buttons,
- icon-only controls,
- carousel controls if introduced later.

### Skip-link behavior

Verify that:

1. the skip link becomes visible on focus;
2. activating it moves focus logically to main content;
3. the target has a visible focus indication where appropriate.

### Reduced motion

Continue respecting:

```css
@media (prefers-reduced-motion: reduce)
```

No information or functionality should depend on animation.

### Semantic source order

Visual rearrangement should not create a reading/focus order that differs meaningfully from the visual presentation.

This is especially relevant if using:

- CSS Grid placement,
- `order`,
- responsive reordering,
- visually reversed layouts.

## Avoid cargo-cult fixes

Do not add accessibility workarounds merely because they exist in another project.

For example, browser-specific list semantics workarounds should only be introduced if the corresponding problem exists in Mikrouli.

## Suggested testing addition

Consider a lightweight manual accessibility checklist for layout-sensitive changes:

```text
keyboard
focus
320px
200% zoom
forced colors
reduced motion
```

This can remain manual until there is enough value to automate specific checks.

---

# 6. Prefer Component-Owned Responsive Behavior

## Recommendation

**Adopt gradually.**

Nice for Tourism increasingly uses intrinsic layout and container-aware behavior rather than relying only on viewport breakpoints.

This is especially useful for reusable Svelte components.

## Principle

A reusable component should ideally respond to the **space available to it**, not unnecessarily depend on the browser viewport.

Instead of:

```text
component
→ knows page viewport
→ changes at global breakpoint
```

prefer where appropriate:

```text
component
→ receives available space
→ intrinsic layout handles most cases
→ container query handles exceptional cases
```

## Candidate Mikrouli components

Audit components such as:

- service cards,
- blog cards,
- card collections,
- contact sections,
- CTA groups,
- image/text blocks,
- reusable detail layouts.

## Use intrinsic layout first

Prefer techniques such as:

```css
grid-template-columns: repeat(auto-fit, minmax(...));
flex-wrap: wrap;
min();
max();
clamp();
```

before adding a breakpoint.

## Container queries

Use container queries when the same component genuinely appears in containers with significantly different widths.

Do not migrate viewport breakpoints just for novelty.

## Tailwind

Keep Tailwind.

This recommendation does **not** require moving to standalone CSS.

Use Tailwind's container-query functionality where it produces clearer component ownership.

## Good migration strategy

Do this opportunistically:

```text
touch component for another reason
↓
inspect responsive rules
↓
simplify if intrinsic/container-based layout is clearly better
```

Avoid a repository-wide breakpoint rewrite.

## Acceptance criteria

A migrated component should:

- have fewer page-specific assumptions,
- work in multiple container sizes,
- use fewer overrides,
- remain readable in its markup,
- not introduce extra CSS complexity merely to remove a media query.

---

# 7. Adopt CSS Architecture Principles, Not Nice's Exact CSS Architecture

## Recommendation

**Adapt.**

Nice for Tourism has a deliberate standalone CSS architecture with explicit cascade layers and BEM-style component naming.

That exact architecture should not be copied into Mikrouli because Svelte component boundaries and Tailwind already solve many of those problems differently.

Several underlying principles are still valuable.

## Semantic design tokens

Prefer naming based on role rather than raw color.

Instead of conceptual usage like:

```text
blue
green
yellow
```

prefer:

```text
background-primary
background-secondary
text-primary
text-muted
action-primary
border-subtle
focus
```

Raw brand colors can still exist as primitive tokens underneath.

This makes future visual changes less invasive.

## Logical properties

Where custom CSS is used, prefer logical properties where practical:

```css
margin-inline
padding-inline
border-inline-start
inset-inline
```

rather than unnecessarily encoding left/right assumptions.

This improves:

- internationalization readiness,
- readability,
- adaptability.

## Specificity management

For generated content and third-party markup, consider tools such as:

```css
:where(...)
```

and deliberate layer placement.

This is particularly useful for:

- Contentful-generated prose,
- Markdown,
- embeds,
- third-party widgets.

Avoid escalating selector specificity to defeat previous selectors.

## Svelte + Tailwind remains the default

Do **not** introduce BEM across existing components.

Prefer:

```text
Svelte component boundary
+
Tailwind utilities
+
small scoped custom CSS where needed
```

Semantic custom classes still make sense for complex selectors or generated content that cannot easily receive utility classes.

## Acceptance criteria

- No repository-wide CSS rewrite.
- New semantic tokens solve a concrete naming problem.
- Specificity becomes simpler rather than more abstract.
- Tailwind remains the primary implementation approach.

---

# 8. Introduce an Explicit Rendering-Performance Budget

## Recommendation

**Adopt as a decision-making principle.**

Nice for Tourism uses rendering optimizations such as `content-visibility` only after content volume made them useful.

That restraint is worth copying.

## Principle

Do not add rendering optimizations merely because the browser supports them.

Use them when:

```text
measured cost
+
meaningful content volume
+
low implementation risk
```

justify the complexity.

## Examples

### Do not optimize prematurely

Probably unnecessary:

```text
4 service cards
4 blog cards
small homepage sections
short service pages
```

### Consider later

Potential candidates:

```text
large blog archive
large FAQ collection
many below-the-fold cards
large generated resource pages
```

## `content-visibility`

For long pages, a future optimization could be:

```css
content-visibility: auto;
contain-intrinsic-size: ...;
```

but only after testing:

- layout stability,
- keyboard/search behavior,
- accessibility,
- browser behavior,
- actual performance improvement.

## Make the performance budget explicit

A useful project principle is:

> Every optimization must pay for its complexity.

For Mikrouli this particularly applies to:

- JavaScript,
- observers,
- lazy-loading systems,
- placeholders,
- client-side state,
- third-party scripts,
- polyfills,
- complex CSS containment.

## Acceptance criteria

- Optimizations have a measurable reason.
- Simple pages stay simple.
- No speculative performance abstraction is introduced.
- Performance-sensitive additions are measured with Lighthouse/browser profiling where appropriate.

---

# 9. Review the Header Using Progressive Enhancement Principles

## Recommendation

**Investigate later; do not automatically migrate.**

Nice for Tourism explored a CSS-first sticky-header architecture based on available viewport height and browser capabilities.

Mikrouli already has a working observer-based header implementation.

There is no strong reason to replace working behavior solely to remove a small amount of JavaScript.

However, several ideas are worth carrying forward.

## Idea 1: Use available height, not device/orientation assumptions

Sticky navigation can consume too much vertical space on short screens.

A useful rule can be:

```text
short viewport
→ normal document-flow header

sufficient viewport height
→ sticky behavior allowed
```

This can be cleaner than checking:

```text
mobile
landscape
tablet
```

because available space is the actual constraint.

## Idea 2: Separate state detection from presentation

If JavaScript detects scroll state, keep it responsible only for something like:

```text
isCompact
isScrolled
data-state
```

CSS should own:

- position,
- transition,
- opacity,
- transform,
- spacing,
- visual treatment.

## Idea 3: Progressive enhancement for newer CSS APIs

Modern scroll-state/container-query capabilities may eventually reduce JavaScript.

Treat them as progressive enhancement until support and behavior are strong enough for Mikrouli's audience.

A valid fallback can simply be:

```text
sticky but always visible
```

rather than reproducing every enhancement with JavaScript.

## Do not optimize the header in isolation

Only revisit this when:

- the header is being changed anyway,
- current JS causes measurable issues,
- UX testing indicates sticky behavior needs improvement,
- browser support makes the CSS version clearly simpler.

## Acceptance criteria for any future migration

- no regression on short mobile landscapes,
- keyboard/focus behavior remains correct,
- reduced-motion remains respected,
- fallback behavior remains usable,
- implementation becomes genuinely simpler.

---

# 10. Things Not to Copy from Nice for Tourism

The comparison is most useful when it also identifies differences that should remain.

## Framework-free rendering

**Do not copy.**

Mikrouli benefits from SvelteKit because it has:

- dynamic route structures,
- reusable UI components,
- CMS integration,
- prerendering,
- richer application-level behavior.

Nice's simpler rendering architecture fits a different problem.

---

## Custom content rendering pipeline

**Do not replace the existing Contentful architecture merely for similarity.**

Mikrouli's:

```text
Contentful
→ fetch
→ transform
→ structured local data
→ Svelte rendering
```

is appropriate.

Continue simplifying that pipeline where possible, but do not replace it with Nice's publication architecture.

---

## Different package manager/runtime

**Do not copy.**

Mikrouli is intentionally Bun-first.

Keep:

```text
Bun runtime
Bun package management
Bun scripting where practical
```

unless a specific unsupported use case appears.

---

## Formatter/linter choices solely because Nice uses them

**Do not copy tooling by association.**

Mikrouli has its own Biome/Oxc evaluation.

Choose tooling based on:

- Svelte compatibility,
- CSS/Markdown coverage,
- maintenance,
- performance,
- rule coverage,
- project simplicity.

Nice using a particular tool is not itself a migration reason.

---

## BEM as a project-wide styling convention

**Do not copy.**

Svelte + Tailwind already provides component scoping and composable styling.

BEM would introduce another naming system without sufficient benefit.

---

## System-font typography

**Do not copy by default.**

Nunito is part of Mikrouli's visual identity.

Only reconsider the webfont if measurements show a meaningful performance or UX problem.

---

## Full standalone CSS cascade architecture

**Do not copy literally.**

Take useful principles such as:

- semantic tokens,
- controlled specificity,
- logical properties,
- progressive enhancement.

Do not introduce an elaborate layer structure where Tailwind/Svelte already provide simpler ownership.

---

## Offline/PWA architecture

**Probably do not copy.**

Nice for Tourism has a stronger offline/publication use case.

For Mikrouli:

- booking flows rely on external services,
- CMS content may change,
- stale therapy/practice information can be undesirable,
- service-worker cache invalidation adds maintenance complexity.

Unless a concrete offline requirement appears, document the absence of an offline service worker as intentional.

---

# Recommended Implementation Order

These changes should remain independent and reviewable.

## Batch 1 — Generated HTML validation

Add built-output validation first.

Why:

- small,
- isolated,
- immediate correctness benefit,
- protects later refactors.

Deliverables:

```text
test:html command
CI integration
documented exceptions if needed
```

---

## Batch 2 — `AGENTS.md`

Extract stable project invariants into one authoritative agent-facing document.

Do not yet refactor every other document.

Deliverable:

```text
AGENTS.md
```

---

## Batch 3 — Scoped agent instructions

Add only the scoped instruction files that clearly reduce context.

Suggested first candidates:

```text
svelte.instructions.md
content.instructions.md
```

Add testing/scripts instructions only if enough rules exist to justify them.

---

## Batch 4 — Documentation cleanup

Audit and update:

```text
README.md
workflow.md
```

Remove stale claims and contradictions.

This should happen before creating more permanent documentation.

---

## Batch 5 — Split brand/copy guidance

Create:

```text
docs/COPY.md
docs/STYLEGUIDE.md
```

Move the appropriate sections from the existing brand guide.

Decide whether the old brand guide becomes:

- a short index,
- a high-level brand summary,
- or is removed after the split.

---

## Batch 6 — `CONTRIBUTING.md`

Create a concise definition of done covering:

- code,
- content,
- accessibility,
- verification.

Keep it intentionally small.

---

## Batch 7 — Accessibility resilience audit

Review:

```text
forced colors
320px width
200%+ zoom
focus
target sizes
reduced motion
source order
```

Fix issues individually.

Avoid turning this into one giant accessibility refactor.

---

## Batch 8 — Component responsiveness audit

When touching reusable layout components, consider:

```text
intrinsic layout
container queries
fewer viewport assumptions
```

Migrate one component at a time.

---

## Batch 9 — Semantic CSS/token improvements

Introduce semantic tokens and specificity improvements only where they simplify existing code.

Avoid a global CSS rewrite.

---

## Batch 10 — Rendering-performance review

Revisit only when page/content volume justifies it.

Potential future candidates:

- blog archives,
- FAQ pages,
- large card collections.

Measure before introducing `content-visibility` or containment.

---

## Batch 11 — Header experiment

Treat this as optional.

Prototype:

- height-based sticky behavior,
- strict state/presentation separation,
- newer CSS APIs as progressive enhancement.

Only adopt if it is clearly simpler and at least as robust as the existing implementation.

---

# Recommended Outcome

The strongest ideas to transfer from Nice for Tourism are not its framework or styling choices.

They are its discipline around:

1. validating the final generated output,
2. making project rules explicit for coding agents,
3. separating documentation by responsibility,
4. defining what a complete change means,
5. testing accessibility beyond automated rule scanners,
6. letting components own their responsive behavior,
7. using CSS architecture deliberately without over-engineering,
8. and requiring performance optimizations to justify their complexity.

Mikrouli should retain its existing strengths:

- SvelteKit,
- static generation,
- Contentful,
- Tailwind,
- Bun,
- strict prerendering,
- accessibility focus,
- low-JavaScript philosophy,
- and small-batch modernization.

The objective is therefore:

> **Bring Nice for Tourism's project discipline into Mikrouli without importing architecture that exists only because Nice for Tourism solves a simpler problem.**
