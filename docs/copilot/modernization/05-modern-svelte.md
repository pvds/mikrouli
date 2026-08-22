# Mikrouli Modern Svelte Modernization

> Research snapshot: 2026-08-22  
> Current framework baseline: Svelte `^5.56.10`, SvelteKit `^2.70.3`  
> Scope: stable Svelte 5 idioms plus directly related SvelteKit component APIs  
> Audience: local GitHub Copilot coding agent  
> Status: implementation plan

## Objective

Modernize Mikrouli's existing Svelte source to the clearest **current stable
Svelte idioms** while preserving behavior, the static-site architecture,
accessibility, performance and the project's web-standards-first approach.

This is **not** a Svelte 4 -> Svelte 5 migration. The repository is already
substantially written in Svelte 5 runes mode. The goal is to remove remaining
compatibility patterns and older idioms, clarify reactivity intent, and use
newer stable APIs only where they make the implementation materially simpler or
more correct.

Use this policy throughout the work:

> When stable Svelte has a modern replacement for an older idiom, prefer the
> modern idiom. When a newer feature does not replace an older idiom, adopt it
> only when it clearly simplifies the code, strengthens correctness or removes
> meaningful custom machinery.

Do not turn this objective into a general rewrite or a showcase of every Svelte
5 feature.

---

## Final decisions

| Area | Decision |
| --- | --- |
| Svelte mode | Keep runes mode; do not add legacy-mode code |
| Dependency versions | This objective is source modernization, not another package-upgrade pass |
| Values computed from props/state | Prefer `$derived` for local computed values |
| Lazy live references | Keep getter closures when the getter itself must be passed/stored as the live reactive reference |
| Intentional snapshots | Use a normal variable/constant when only the initial value is wanted |
| `$derived` syntax | Use `$derived(expression)` for expressions and `$derived.by(() => ...)` for multi-statement derivations |
| Read-only derived values | Prefer `const value = $derived(...)` unless intentional overriding is required |
| Route component props | Use generated SvelteKit `PageProps` / `LayoutProps` through JSDoc |
| Conditional classes | Prefer clsx-style arrays/objects in `class`; migrate away from `class:` |
| Reusable class-like props | Use Svelte's `ClassValue` where it materially simplifies composition, starting with shared primitives such as `Section.svelte` |
| Template locals | Replace legacy `{@const ...}` with Svelte 5.56 declaration tags `{const ...}` |
| Each blocks | Prefer keyed each blocks when a real stable identity exists; never use the array index as a key |
| Effects | Keep effects for real side effects only; do not use `$effect` to compute ordinary local state |
| DOM behavior | Keep one-off lifecycle behavior simple; use attachments when element behavior is reusable or genuinely clearer |
| `Header.svelte` observer | Co-locate setup/cleanup in `onMount`; do not introduce an attachment merely for novelty |
| `Image.svelte` | Let `03-sharp-to-bun-image.md` own its structural loading/placeholder refactor first; modernize only its post-migration Svelte syntax |
| View Transitions | Keep the currently disabled prototype; do not enable/remove it here |
| Experimental Svelte | Do not enable experimental APIs as part of this objective |
| SvelteKit 3 | Leave framework/config migration to `02-sveltekit-3-vite-8.md` |
| TypeScript source conversion | Leave JS/JSDoc -> TypeScript to the separate TypeScript project |

---

# Current repository audit

## Baseline is already modern

The inspected current source already uses many Svelte 5-era patterns correctly:

- `$props()`;
- `$state`;
- `$derived`;
- `$bindable`;
- snippets with `{#snippet ...}`;
- `{@render ...}`;
- event properties such as `onclick`;
- SvelteKit `resolve()` / `asset()`;
- `$app/state` in `Seo.svelte`;
- native platform features such as `<dialog>` and Popover APIs rather than
  replacing them with framework state abstractions.

Do **not** churn these patterns simply to touch every component.

`Seo.svelte` is especially useful as a local reference for the intended
reactivity style: its SEO values are ordinary local derivations of
`page.data`/`page.url`, and the development-only SEO validation is a genuine
side effect. Preserve that distinction.

## Why the repository has many getter closures

The current pattern is deliberate, not accidental.

Git commit:

```text
7c478955473d676fd913fb1c04386ca00726b022
refactor: ensure state is using a closure to not lose the original reference
```

changed **18 files** and converted a number of plain prop-derived locals into
zero-argument getter functions. Examples from that commit include:

```js
const navPrimary = toNavItems(primary.fields.items);
```

becoming:

```js
const NavPrimary = () => toNavItems(primary.fields.items);
```

and:

```js
const navItemsBase = toNavItems(menu.fields.items);
```

becoming:

```js
const NavItemsBase = () => toNavItems(menu.fields.items);
```

This was a valid response to Svelte's `state_referenced_locally` class of
problems: reading a reactive prop/state value into an ordinary local variable
can capture only the value from component creation and break the live
relationship when the prop is later replaced.

Svelte's compiler documentation still recommends a closure when a **live
reference is passed across a boundary**, for example:

```js
setContext("count", () => count);
```

The modernization is therefore **not** "closures were wrong; remove all
closures." The modernization is to distinguish two cases that the current
repository represents with the same syntax:

1. local computed value -> `$derived`;
2. lazy accessor that is intentionally the API -> getter closure.

That distinction should become a project convention.

## Confirmed current modernization targets

Repository inspection found these concrete targets:

| File/area | Current pattern | Recommended direction |
| --- | --- | --- |
| `src/routes/+layout.svelte` | `const nav = () => data.nav` | local `$derived` |
| `src/routes/+page.svelte` | `page()`, `services()`, `posts()` getters | local `$derived` |
| `Footer.svelte` | getters rerun `toNavItems(...)` on every call | `$derived(...)` |
| `NavPrimary.svelte` | `NavItemsBase()` / `NavItemsWithHome()` | `$derived(...)` |
| `BookingDialog.svelte` | getter for CTA/URL derived from `type` prop | `$derived(...)` |
| `ContentSection.svelte` | `ProseTheme()` getter | `$derived(...)` or inline class condition |
| `WaveSvg.svelte` | getter introduced for prop-derived alignment | `$derived(...)` |
| `Hero.svelte` | `$derived(() => ({ ... }))` then `spacingY()` | fix misuse; derive the object value |
| `Hero.svelte` | `class:` plus conditional class-string interpolation | modern `class` arrays/objects |
| `ContentSection.svelte` | `{@const image_name = ...}` | `{const imageName = ...}` |
| `BlogArticle.svelte` | `{@const image_name = ...}` | `{const imageName = ...}` |
| `TeaserArticle.svelte` | `{@const image_name = ...}` | `{const imageName = ...}` |
| `Header.svelte` | separate `onMount` / `onDestroy` for one observer | return cleanup from `onMount` |
| route components | untyped `$props()` destructuring | generated `PageProps` / `LayoutProps` |
| several lists | unkeyed `{#each}` | add keys where stable identity exists |
| `Section.svelte` | string-only class-like props and manual interpolation | consider `ClassValue` + array composition |

The historical closure commit touched route pages and multiple components, so
the coding agent must inventory the **current** source rather than treating this
table as exhaustive.

---

# Reactivity model

## The core rule

Choose the smallest construct that accurately communicates the lifetime of the
value.

### 1. Plain value: intentional snapshot or non-reactive constant

Use a normal `const`/`let` when:

- none of its inputs are reactive; or
- the initial value is intentionally captured once.

Example:

```js
const bookingCta = {
  text: "Book a Session",
};
```

Do not add `$derived` to ordinary constants.

If a value intentionally snapshots a prop, make that intent obvious in naming
or a short comment. Do not hide `state_referenced_locally` warnings with a
closure if the desired behavior is actually a snapshot.

### 2. `$derived`: local computed value

Use `$derived` when a component-local value is a function of props or state and
should update when those inputs change.

Current:

```js
let { data } = $props();

const page = () => data.page.fields;
const services = () => data.services;
const posts = () => data.posts;
```

Target:

```js
let { data } = $props();

const page = $derived(data.page.fields);
const services = $derived(data.services);
const posts = $derived(data.posts);
```

Template code then becomes normal property/value access:

```svelte
<Hero
  title={page.header}
  image={getImageName(page.heroImage?.file.fileName)}
/>

<TeaserSection items={services} ... />
```

This is more than cosmetic:

- the variable communicates "derived state" directly;
- Svelte tracks the actual dependencies;
- derived values are marked dirty when dependencies change and are recalculated
  when next read;
- if a derived result is referentially unchanged, downstream updates can be
  skipped;
- transformed values such as `toNavItems(...)` are not recalculated on every
  getter call.

For ordinary read-only local derivations, prefer:

```js
const value = $derived(...);
```

rather than `let`, because modern Svelte allows writable derived values and this
project normally does not need that override behavior.

### 3. Getter closure: lazy live-reference boundary

Keep a closure when **the function itself** is the mechanism through which
another API/component receives a live reference.

Canonical example from Svelte's compiler warning guidance:

```js
setContext("count", () => count);
```

A derived variable alone does not replace that:

```js
const derivedCount = $derived(count);

// This passes the current value, not an accessor.
setContext("count", derivedCount);
```

If the consumer needs a getter, pass a getter:

```js
setContext("count", () => derivedCount);
```

Other possible legitimate cases are APIs that explicitly accept a read
function, or helper abstractions whose contract is "call this later to read the
current value."

Do not keep a zero-argument getter merely because its inputs are reactive when
the getter is only called locally in the component's own markup.

---

## `$derived` is not a function wrapper

Current `Hero.svelte` contains:

```js
const spacingY = $derived(() => ({
  padding: image
    ? "pt-14 pb-18 sm:pt-20 sm:pb-24 md:pt-30 md:pb-34"
    : "py-10 sm:py-16 md:py-24",
  bottom: sideAbsolute
    ? image
      ? "-bottom-18 sm:-bottom-24 md:-bottom-34 max-sm:-mt-8 sm:-mt-6"
      : "-bottom-10 sm:-bottom-16 md:-bottom-24 max-sm:-mt-8 sm:-mt-6"
    : "",
}));
```

and later:

```svelte
{spacingY().padding}
```

`$derived` receives an **expression**. In this code the expression is the
function itself, so the derived value is a function. The reactive reads of
`image` and `sideAbsolute` happen later when the function is called.

For this object, prefer the direct expression:

```js
const spacingY = $derived({
  padding: image
    ? "pt-14 pb-18 sm:pt-20 sm:pb-24 md:pt-30 md:pb-34"
    : "py-10 sm:py-16 md:py-24",
  bottom: sideAbsolute
    ? image
      ? "-bottom-18 sm:-bottom-24 md:-bottom-34 max-sm:-mt-8 sm:-mt-6"
      : "-bottom-10 sm:-bottom-16 md:-bottom-24 max-sm:-mt-8 sm:-mt-6"
    : "",
});
```

and:

```svelte
{spacingY.padding}
```

Use `$derived.by` when the derivation requires a real function body, for
example loops or multiple statements:

```js
const items = $derived.by(() => {
  const result = [];

  for (const item of source) {
    if (item.visible) result.push(transform(item));
  }

  return result;
});
```

Do not choose `$derived.by` merely because the old implementation happened to
be a getter function.

---

## `$derived` trade-offs and why they do not justify the current getter pattern

There are real differences worth preserving in the project guidance.

### Dependency tracking and bookkeeping

A derived creates a Svelte reactive dependency node. A trivial getter has less
framework machinery.

That is not a reason to avoid derived values that are semantically reactive.
Svelte's derived reactivity is push-pull: dependency changes mark a derived
dirty, but it is only recalculated when read.

Do not use `$derived` for constants. Do use it for local values whose
correctness depends on changing props/state.

### Objects/arrays are not deep-proxied

Objects and arrays returned from `$derived` are returned as-is rather than
automatically becoming deep `$state` proxies.

This is a good fit for Mikrouli's read-only Contentful/navigation derived data.
Do not mutate prop-derived objects through a local derived alias.

### Derived expressions must be pure

State mutation inside a derived expression is disallowed. Keep network/DOM/
logging/external-library work out of derived expressions.

This is desirable for the targets in this migration, which are value
transformations.

### Getter functions are not cached derivations

A getter like:

```js
const NavPrimary = () => toNavItems(primary.fields.items);
```

runs the transformation whenever it is called. A derived expresses the
dependency once and is recalculated only when needed after an invalidation.

For transformations such as `toNavItems`, `$derived` is both clearer and a
better execution model.

---

# `$effect` policy

Svelte's current guidance describes effects as an escape hatch.

For Mikrouli:

- do not replace getter closures with `$effect`;
- do not mirror props into `$state` through effects;
- do not use effects to compute classes, URLs, transformed navigation data or
  other ordinary values;
- put interaction-driven code in event handlers;
- use an attachment for reusable DOM/external-library element behavior when it
  is genuinely clearer;
- keep actual side effects as effects.

`Seo.svelte` currently has:

```js
if (import.meta.env.MODE === "development") {
  $effect(() => checkSeo(page.data.seo, page.route.id));
}
```

This is a reasonable effect: it runs a development diagnostic in response to
reactive SEO data. Do not rewrite it into a derived value.

---

# SvelteKit component typing

## Use generated `PageProps` and `LayoutProps`

SvelteKit has provided `PageProps` and `LayoutProps` since 2.16. They fit
Mikrouli's current strict JavaScript + JSDoc setup and should be adopted before
the later TypeScript source migration.

Current root layout:

```js
let { children, data } = $props();
```

Target:

```js
/** @type {import('./$types').LayoutProps} */
let { children, data } = $props();
```

Current root page:

```js
let { data } = $props();
```

Target:

```js
/** @type {import('./$types').PageProps} */
let { data } = $props();
```

Apply the same approach to route components under:

```text
src/routes/**/+page.svelte
src/routes/**/+layout.svelte
```

using the route-local generated `./$types`.

Benefits:

- route data types come directly from SvelteKit's generated contract;
- `children` is correctly typed as a `Snippet` for layouts;
- actions/form data are automatically represented where relevant;
- fewer hand-maintained route prop shapes;
- cleaner transition to native TypeScript later.

Do **not** introduce duplicate hand-written `PageData`/`LayoutData` prop
typedefs when `PageProps`/`LayoutProps` already describe the component boundary.

## Keep current modern SvelteKit APIs

The inspected source already uses current Kit 2 APIs such as:

```js
import { page } from "$app/state";
import { asset, resolve } from "$app/paths";
```

Keep them.

As part of Batch 0, search for old component-facing Kit APIs such as:

```text
$app/stores
```

If an actual use exists, migrate it to the stable current Kit 2 replacement in
this objective. Do not pre-implement SvelteKit 3-only API/config changes here;
those remain owned by `02-sveltekit-3-vite-8.md`.

---

# Modern class composition

## Replace `class:` with the modern `class` attribute

Since Svelte 5.16, `class` accepts arrays and objects using clsx semantics.
Svelte's current documentation explicitly recommends considering this instead
of `class:` because it is more powerful and composable.

Prefer:

```svelte
<div
  class={[
    "base classes",
    active && "active",
    inverted && "text-white prose-invert",
  ]}
>
```

or:

```svelte
<div class={{ active, disabled, "text-white": inverted }}>
```

over:

```svelte
<div
  class="base classes"
  class:active
  class:disabled
  class:text-white={inverted}
>
```

This is particularly useful with Tailwind because one condition can control a
complete literal group of utilities.

Do not add a separate `clsx` dependency. Svelte already provides this behavior
for `class`.

## Avoid `condition && "class"` as a primitive top-level class value

Svelte currently documents a historical behavior where falsy primitive
`class={...}` values such as `false` can be stringified. Arrays/objects filter
falsy members using clsx semantics.

Current `Hero.svelte`:

```svelte
<Section classes="{!image && 'bg-primary-light'} overflow-hidden">
```

should therefore not be preserved as the preferred pattern.

Once `Section.svelte` accepts class values, use:

```svelte
<Section classes={[!image && "bg-primary-light", "overflow-hidden"]}>
```

## Modernize reusable class-like props where it pays off

`Section.svelte` is a strong candidate because it currently declares several
class-like props as strings:

```js
@property {string} [classes]
@property {string} [innerClasses]
@property {string} [customSpacing]
```

and combines them with manual template interpolation.

Svelte 5.19 exposes `ClassValue` from `svelte/elements`. A targeted
modernization can use:

```js
/** @typedef {import('svelte/elements').ClassValue} ClassValue */
```

and then:

```js
/**
 * @typedef {Object} Props
 * @property {ClassValue} [classes]
 * @property {ClassValue} [innerClasses]
 * @property {ClassValue} [customSpacing]
 * ...
 */
```

The component can compose its own classes as arrays:

```svelte
<section class={["relative", classes, spacing, themeClasses]}>
  <div class={["max-w-6xl mx-auto", innerClasses]}>
    ...
  </div>
</section>
```

This materially improves callers such as `Hero.svelte`, where conditional class
groups can be passed without string interpolation.

### Scope restraint

Do not mass-change every `*Class`/`classes` prop in the repository just because
`ClassValue` exists.

Expand class-like prop typing when:

- the component already composes caller classes with internal classes;
- callers currently construct awkward conditional strings; or
- the component is a shared styling primitive.

Leave simple string-only APIs alone if changing them does not simplify any real
caller.

---

# `Hero.svelte`: recommended class cleanup

`Hero.svelte` is currently the clearest concentration of older class idioms:

```svelte
<h1
  class="text-3xl md:text-4xl mb-6 font-bold"
  class:[text-shadow:2px_2px_4px_rgba(14,38,39,1)]={image}
  class:text-white={image}
>
```

and:

```svelte
<div
  class="{proseClasses || 'prose sm:prose-lg md:prose-xl font-semibold text-balance'}
    {image ? 'prose-invert prose-p:[text-shadow:2px_2px_0px_rgba(14,38,39,1)]' : ''}"
  class:prose-invert={image}
>
```

The second example also applies `prose-invert` twice.

Target the simpler modern form:

```svelte
<h1
  class={[
    "text-3xl md:text-4xl mb-6 font-bold",
    image && "text-white [text-shadow:2px_2px_4px_rgba(14,38,39,1)]",
  ]}
>
```

and conceptually:

```svelte
<div
  class={[
    proseClasses || "prose sm:prose-lg md:prose-xl font-semibold text-balance",
    image && "prose-invert prose-p:[text-shadow:2px_2px_0px_rgba(14,38,39,1)]",
  ]}
>
```

Preserve the exact resulting class set and visual behavior. Remove duplicated
conditional classes when encountered.

---

# Declaration tags: `{const}`

Svelte 5.56 introduced declaration tags:

```svelte
{const value = expression}
```

and the current documentation explicitly considers:

```svelte
{@const value = expression}
```

legacy syntax.

Confirmed targets include:

```text
src/lib/components/layout/ContentSection.svelte
src/lib/components/ui/BlogArticle.svelte
src/lib/components/ui/TeaserArticle.svelte
```

Current:

```svelte
{@const image_name = getImageName(...)}
```

Target:

```svelte
{const imageName = getImageName(...)}
```

The camelCase rename is appropriate while touching the declaration because it
is a local JavaScript identifier; do not turn this batch into unrelated naming
cleanup elsewhere.

Search the entire repository for `{@const` and replace all live Svelte source
uses.

This is a safe, tiny migration batch and should not be mixed with larger
reactivity changes if isolated review is useful.

---

# Keyed each blocks

Current Svelte guidance prefers keyed each blocks because Svelte can preserve
the identity of existing DOM more precisely.

Use:

```svelte
{#each items as item (item.id)}
```

when the data exposes a true stable identity.

Do **not** use:

```svelte
{#each items as item, i (i)}
```

The array index is not a stable identity and defeats the purpose.

## Current candidates

Audit at least:

- footer navigation lists;
- primary navigation lists;
- homepage section/content-section loops;
- teaser/article/service lists;
- any other repeated Contentful-derived entities.

Possible keys such as `href`, `slug`, Contentful IDs or processed IDs are only
valid when they are actually unique and stable in that specific list.

Do not invent a key from mutable display text merely to satisfy this
modernization objective. If processed data does not expose a sound key, leave
that loop unkeyed and document why.

The homepage currently uses `i` for wave/alternation behavior. Keep the index as
a normal loop value where needed even if a separate stable key is added.

---

# Lifecycle and DOM behavior

## `Header.svelte`

Current code owns an `IntersectionObserver` through separate lifecycle hooks:

```js
import { onDestroy, onMount } from "svelte";

onMount(() => {
  observer = new IntersectionObserver(...);

  if (sentinel) {
    observer.observe(sentinel);
  }
});

onDestroy(() => {
  if (observer && sentinel) {
    observer.unobserve(sentinel);
    observer.disconnect();
  }
});
```

The simplest cleanup is to co-locate ownership:

```js
import { onMount } from "svelte";

onMount(() => {
  const observer = new IntersectionObserver(...);

  if (sentinel) {
    observer.observe(sentinel);
  }

  return () => {
    observer.disconnect();
  };
});
```

Use the smallest cleanup that preserves current behavior. An explicit
`unobserve(sentinel)` is unnecessary before `disconnect()` unless there is a
specific reason to retain it.

This lets `observer` become local to its lifecycle block and removes separate
`onDestroy` state.

## Why not automatically use an attachment here

Attachments are stable since Svelte 5.29 and are the modern replacement for
Svelte actions. They are especially useful for reusable behavior that belongs
to a DOM element.

The current header observer is a one-off implementation in one component. An
attachment would be valid, but it does not clearly reduce complexity enough to
justify introducing another abstraction.

Project rule:

```text
one-off element behavior in one component
  -> simple local lifecycle code is acceptable

reusable/composable element behavior
  -> prefer an attachment over a new `use:` action
```

If the repository contains existing `use:` actions, migrate them to attachments
because a stable modern replacement exists. Do not manufacture attachments
where no action/reuse problem exists.

---

# State audit

Svelte's current guidance is to use `$state` only for values whose changes
actually drive reactive work.

During the final pass:

1. inventory `$state` variables;
2. identify values that never change after initialization;
3. convert only genuine non-state values to ordinary variables;
4. do not redesign working interactive state.

Examples that are clearly real state:

- `Header.svelte` `isCompact`;
- dialog element/iframe state in `BookingDialog.svelte`;
- menu/popover state in navigation components.

## `Image.svelte` ownership boundary

The current `Image.svelte` contains known loading-state and placeholder
complexity, but `03-sharp-to-bun-image.md` already owns a larger intentional
refactor there:

- switch placeholder generation to `Bun.Image.placeholder()`;
- remove `hasAlpha` from the application contract;
- simplify placeholder/pulse behavior;
- remove obsolete loading/dynamic-metadata remnants.

Therefore:

1. complete `03-sharp-to-bun-image.md` first;
2. treat the resulting `Image.svelte` as the baseline for this objective;
3. only then normalize modern Svelte syntax such as class arrays/objects;
4. do not reintroduce image-state mechanisms removed by the Bun.Image plan.

If this objective is run before the Sharp migration for any reason, **skip
`Image.svelte`** and record it as deferred rather than creating conflicting
changes.

---

# View Transitions: keep now, review later

The root layout currently contains a complete `onNavigate` +
`document.startViewTransition` integration guarded by:

```js
const disableViewTransitions = true;
```

Several article/teaser elements also define `view-transition-name`.

Do not enable, remove or redesign this prototype in this objective.

Add a later roadmap review after the core framework modernization is stable.
That review must decide one of three outcomes:

1. enable View Transitions intentionally;
2. retain the prototype with a concrete near-term reason;
3. delete the dormant implementation.

The review should re-check at that future date:

- browser support and progressive-enhancement behavior;
- current SvelteKit navigation guidance/API;
- whether the existing `onNavigate` integration is still the recommended shape;
- whether transition names are unique and stable;
- navigation/back-forward behavior;
- accessibility and `prefers-reduced-motion`;
- whether the perceived UX benefit is large enough for Mikrouli;
- whether the code still earns its maintenance cost.

Do not make that future decision during this source-modernization pass.

---

# Stable modern Svelte features deliberately not adopted

## Experimental async Svelte

Current Svelte documentation still requires `experimental.async` for component
`await`/hydratable async behavior and explicitly says it is not yet fully
stable.

Do not enable it.

Mikrouli already has a static build-time Contentful architecture; there is no
need to introduce an experimental async component model.

## New context/state abstractions without a use case

Do not add context, shared rune modules, stores or classes with `$state` fields
simply because modern Svelte supports them.

There is no identified state-sharing problem that warrants such a change.

## `$state.raw` without real large reactive data

`$state.raw` is useful for large objects that are only reassigned, but the
current audit has not found a problem that needs it. Do not create a migration
batch for it.

## `$props.id()` without ID-generation problems

Do not add `$props.id()` unless a component currently generates IDs that must be
stable/unique across SSR and hydration.

## Attachments without reusable DOM behavior

Use attachments as the modern replacement when `use:` actions or reusable
element behavior are present. Do not convert every `onMount` merely to use a
newer syntax.

---

# Repository-wide inventory before editing

Run a source inventory before the first implementation batch. At minimum search
for:

```text
() => <prop/state expression>
$derived(() =>
{@const
class:
on:
export let
$$props
$$restProps
<slot
<svelte:fragment
<svelte:component
<svelte:self
$:
use:
$app/stores
$effect(
$state(
{#each
```

Use the results to classify code, not to perform blind search/replace.

Important rules:

- `() => ...` is far too broad for automated replacement; many real event/helper
  functions must stay functions.
- `$:` can appear in text/comments or non-Svelte files; only legacy reactive
  statements are relevant.
- `class:` can appear in documentation or generated content; target live Svelte
  markup.
- `on:` migration is only for Svelte event directives, not arbitrary text.
- do not change code solely because a grep pattern matched it.

Before editing, capture a list of remaining live legacy Svelte constructs so
the final batch can prove they were intentionally removed or retained.

---

# Small-batch implementation plan

The roadmap places this objective **after the Sharp -> Bun.Image migration** and
before SvelteKit 3 + Vite 8. Keep batches independently reviewable.

## Batch 0 — baseline and source inventory

No behavior changes.

1. Confirm the Sharp -> Bun.Image objective is complete, especially the final
   shape of `Image.svelte`.
2. Ensure the working tree is clean.
3. Run the full current baseline checks.
4. Inventory current Svelte patterns using the list above.
5. Specifically inventory every zero-argument getter that reads props/state.
6. Classify each getter as:
   - local derived value;
   - intentional lazy-reference API;
   - intentional snapshot should become plain value;
   - ordinary helper function, not part of this migration.
7. Inventory all route component `$props()` declarations.
8. Inventory all unkeyed each blocks and identify whether a true stable key is
   available.
9. Save representative screenshots or visual baselines for:
   - home/hero;
   - navigation/header;
   - footer;
   - service/article teasers;
   - booking dialog;
   - an image-heavy page.

Do not suppress any compiler warning as part of the baseline.

## Batch 1 — generated route prop types

Apply only `PageProps` / `LayoutProps` JSDoc typing to route components.

Example:

```js
/** @type {import('./$types').PageProps} */
let { data } = $props();
```

and:

```js
/** @type {import('./$types').LayoutProps} */
let { data, children } = $props();
```

Do not combine this with reactivity rewrites.

Validation:

```bash
bun run check:lint
bun run build
bun run build:prod
```

Acceptance:

- all route component props are inferred from generated Kit types where
  applicable;
- no hand-written duplicate route data type was added;
- no runtime output changes.

## Batch 2A — route/local getter -> `$derived`

Start with route components because the change is easy to inspect.

Example:

```js
const page = () => data.page.fields;
```

to:

```js
const page = $derived(data.page.fields);
```

Update template calls from `page()` to `page`.

Do this in small route groups rather than all 18 historical files at once.

Validation after each group:

```bash
bun run check:lint
bun run build
bun run build:prod
```

Inspect navigation between pages, including repeated navigation where a layout
is reused.

## Batch 2B — transformed component getters -> `$derived`

Convert local computed values in components such as:

- `Footer.svelte`;
- `NavPrimary.svelte`;
- `BookingDialog.svelte`;
- `ContentSection.svelte`;
- `WaveSvg.svelte`;
- other current matches from the inventory.

Example:

```js
const NavPrimary = () => toNavItems(primary.fields.items);
```

to:

```js
const navPrimary = $derived(toNavItems(primary.fields.items));
```

Use normal camelCase value names now that these are values rather than
function-like pseudo-components.

Do not convert a getter if the inventory proves that the function itself is
intentionally passed/stored as a live-reference API.

## Batch 2C — fix `$derived` misuse

Fix `Hero.svelte`'s function-valued derived and any equivalent patterns:

```js
$derived(() => expression)
```

where the intended derived value is actually `expression`.

Choose:

```js
$derived(expression)
```

or:

```js
$derived.by(() => {
  ...
  return expression;
})
```

based on complexity.

After this batch, no local computed value should require `value()` merely
because `$derived` was wrapped around a getter.

## Batch 3 — declaration tags

Replace live:

```svelte
{@const ...}
```

with:

```svelte
{const ...}
```

Confirmed files include `ContentSection.svelte`, `BlogArticle.svelte` and
`TeaserArticle.svelte`.

This should be a tiny syntax-only batch.

Validation:

```bash
bun run check:lint
bun run build
```

## Batch 4A — shared class composition

Modernize central class-composition primitives first, especially
`Section.svelte`, where `ClassValue` materially simplifies caller composition.

Requirements:

- preserve exact rendered classes;
- preserve Tailwind literal class visibility;
- do not add `clsx`;
- do not broaden unrelated component APIs;
- keep class-related JSDoc accurate.

Validate representative section themes, waves, spacing and responsive layouts.

## Batch 4B — replace `class:` / conditional string patterns

Convert live `class:` directives to class arrays/objects.

Prioritize:

- `Hero.svelte`;
- post-Bun `Image.svelte`;
- any other current source matches.

Also replace fragile top-level primitive patterns such as:

```svelte
class={condition && "foo"}
```

with array/object composition when relevant.

Remove duplicated classes discovered during conversion, but do not redesign the
visual system.

Validation:

```bash
bun run check:lint
bun run build
bun run build:prod
bun run test:axe
bun run test:lighthouse
```

Visually compare the captured baseline routes at relevant breakpoints.

## Batch 5 — keyed each blocks

Add stable keys where the data contract provides them.

Do this list family by list family:

1. navigation;
2. teasers/cards;
3. content sections;
4. any remaining list with real identity.

Do not invent index keys or mutable text keys.

If a list genuinely lacks a stable identity, leave it unkeyed and record that
decision in the implementation notes.

## Batch 6 — lifecycle cleanup and state/effect audit

1. Simplify `Header.svelte` so its observer is created and destroyed in the same
   `onMount` callback.
2. Remove now-unnecessary module/component variables used only to bridge
   `onMount` and `onDestroy`.
3. Inspect `$state` variables and convert only values proven not to be state.
4. Inspect `$effect` usages and verify each is a genuine side effect.
5. If live `use:` actions exist, migrate them to attachments in a separate
   sub-batch.
6. Do not introduce attachments for one-off code unless the resulting code is
   clearly simpler.

## Batch 7 — legacy-pattern and regression gate

Re-run the inventory.

Expected outcome:

- no `{@const}` remains in live Svelte source;
- no `class:` remains unless a specific documented exception exists;
- no old Svelte event directives remain unless a documented external constraint
  requires one;
- no accidental legacy prop/slot patterns remain;
- local prop/state computations use `$derived` rather than defensive getters;
- any remaining reactive getter closures have an explicit reason;
- route components use generated props types;
- each blocks use stable keys where available;
- no new `svelte-ignore state_referenced_locally` comments were added.

Then run the full validation gate.

---

# Validation and rollback

## Required automated checks

At minimum after each meaningful behavior-affecting batch:

```bash
bun install --frozen-lockfile
bun run check:all
bun run build
bun run build:prod
```

For markup/class/list/lifecycle changes also run:

```bash
bun run test:axe
bun run test:lighthouse
```

## Required manual checks

Verify representative staging and production output for:

- homepage hero and sections;
- header compact behavior while scrolling;
- primary navigation and popovers;
- footer navigation;
- service/article teaser cards;
- article/detail pages;
- booking dialog open/close and external link;
- image loading/placeholder behavior after the Bun.Image migration;
- responsive breakpoints where conditional Tailwind groups changed;
- keyboard navigation and focus behavior.

## Reactivity regression checks

Specifically test cases that motivated the original closure migration:

- navigate between pages without a full browser reload;
- verify root layout/nav data remains correct when layout props update;
- verify prop-derived CTA/URL/navigation values update if their props change;
- verify no `state_referenced_locally` warnings return;
- verify no transformed getter is executing repeatedly merely because the
  template references it more than once.

Use `$inspect.trace(...)` temporarily if a derived value behaves unexpectedly;
remove migration-only diagnostics before committing.

## Rollback rule

If a batch changes behavior unexpectedly:

1. revert the scoped batch;
2. identify whether the old getter was actually acting as a lazy-reference API,
   whether a class composition changed emitted classes, or whether list identity
   was chosen incorrectly;
3. fix the classification, not the symptom;
4. do not add warning suppressions or effects merely to make the migration pass.

---

# Acceptance criteria

The objective is complete when all of the following are true:

1. The project remains on stable Svelte 5/SvelteKit 2 for this source
   modernization phase.
2. Current Svelte legacy constructs with stable modern replacements have been
   removed from live source or have a documented exception.
3. `{@const}` is replaced by declaration tags.
4. Conditional classes use modern class composition rather than `class:`.
5. Shared class-like props use `ClassValue` where this produced a concrete
   simplification, without turning the whole component API into an abstraction
   exercise.
6. Local values derived from props/state use `$derived`.
7. Remaining zero-argument reactive getters exist only where lazy access itself
   is semantically required.
8. No `$effect` was added to compute ordinary state.
9. Route component props use generated `PageProps` / `LayoutProps`.
10. Keyed each blocks are used where a stable identity is genuinely available.
11. `Header.svelte` lifecycle ownership is simpler without changing observer
    behavior.
12. The post-Bun `Image.svelte` follows the same modern class/state conventions.
13. View Transitions remain disabled and unchanged except for the roadmap review
    item.
14. Staging and production builds, axe and Lighthouse gates remain green.
15. No TypeScript source migration, Kit 3 configuration work or unrelated
    design refactor leaked into this objective.

---

# Expected end state

The source should read as modern Svelte without looking framework-heavy.

Representative component code should look like:

```js
/** @type {import('./$types').PageProps} */
let { data } = $props();

const page = $derived(data.page.fields);
const services = $derived(data.services);
```

rather than:

```js
let { data } = $props();

const page = () => data.page.fields;
const services = () => data.services;
```

Class composition should look like:

```svelte
<div
  class={[
    "base utilities",
    image && "text-white",
    compact && "md:-top-4",
  ]}
>
```

rather than a mix of interpolated strings and `class:` directives.

A future contributor should be able to infer from syntax alone:

- plain variable -> non-reactive value/snapshot;
- `$state` -> mutable reactive state;
- `$derived` -> local computed reactive value;
- getter closure -> intentionally lazy/live reference crossing a boundary;
- `$effect` -> actual side effect;
- attachment -> reusable DOM-element behavior.

That semantic clarity is the main value of this modernization.

---

# Future Svelte watchlist

These are **not implementation tasks** for this objective.

Revisit only when the relevant API is stable and a real use case exists:

- async Svelte after it leaves `experimental.async`;
- future stable Svelte/SvelteKit changes that supersede current View Transition
  integration;
- `$state.raw` if large reactive API payloads become a measurable problem;
- shared reactive classes/context if the application develops real cross-tree
  client state;
- newer component/DOM APIs when they replace code Mikrouli actually owns.

Do not schedule upgrades solely because an API exists.

---

## Research sources

Official Svelte/SvelteKit documentation:

- Svelte best practices: https://svelte.dev/docs/svelte/best-practices
- `$derived`: https://svelte.dev/docs/svelte/$derived
- Compiler warning `state_referenced_locally`:
  https://svelte.dev/docs/svelte/compiler-warnings#state_referenced_locally
- Class attributes / arrays / objects:
  https://svelte.dev/docs/svelte/class
- Declaration tags `{let/const ...}`:
  https://svelte.dev/docs/svelte/declaration-tags
- Attachments: https://svelte.dev/docs/svelte/@attach
- SvelteKit generated route types:
  https://svelte.dev/docs/kit/types

Repository evidence used for this plan:

- Current repository: https://github.com/pvds/mikrouli
- Historical closure refactor:
  https://github.com/pvds/mikrouli/commit/7c478955473d676fd913fb1c04386ca00726b022
- `src/routes/+layout.svelte`
- `src/routes/+page.svelte`
- `src/lib/components/global/Footer.svelte`
- `src/lib/components/global/Header.svelte`
- `src/lib/components/global/NavPrimary.svelte`
- `src/lib/components/global/seo/Seo.svelte`
- `src/lib/components/layout/ContentSection.svelte`
- `src/lib/components/layout/Hero.svelte`
- `src/lib/components/layout/Section.svelte`
- `src/lib/components/ui/BookingDialog.svelte`
- `src/lib/components/ui/BlogArticle.svelte`
- `src/lib/components/ui/TeaserArticle.svelte`

Related Mikrouli modernization plans:

- `00-roadmap.md`
- `02-sveltekit-3-vite-8.md`
- `03-sharp-to-bun-image.md`
- `04-bun-webview-playwright-prototype.md`
- `../typescript/typescript-6-migration.md`
