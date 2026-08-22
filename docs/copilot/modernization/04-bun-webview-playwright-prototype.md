# Mikrouli Bun.WebView / Playwright Prototype

> Research snapshot: 2026-08-22
> Decision: prototype only; retain Playwright for stable CI/production checks
> Audience: local GitHub Copilot coding agent

## Objective

Evaluate whether Bun 1.4's native browser automation can eventually replace the browser-control portions of Mikrouli's Playwright-based accessibility and Lighthouse tooling.

This is **not an approved Playwright-removal project**.

Bun's documentation explicitly marks `Bun.WebView` as experimental and subject to change. Mikrouli values stability, so Playwright remains the reference implementation and CI default until a later decision after the API stabilizes.

## What Mikrouli actually uses Playwright for

The repository research found Playwright serving mainly as browser automation infrastructure rather than a conventional Playwright test suite.

Current responsibilities include:

1. install/find Chromium headless shell;
2. launch Chromium with remote-debugging support;
3. create contexts/pages;
4. navigate local static output / preview pages;
5. capture page errors, failed requests, and console errors;
6. run axe through `@axe-core/playwright`;
7. run Lighthouse through `playwright-lighthouse`;
8. enforce/report existing accessibility and Lighthouse thresholds.

Therefore `bun:test` is **not** the relevant replacement. The relevant native API is `Bun.WebView`, plus possibly `Bun.spawn`/official Lighthouse APIs for Lighthouse orchestration.

## Bun.WebView fit

Bun.WebView supports:

- headless navigation;
- JavaScript evaluation;
- click/type/press/scroll;
- screenshots;
- console capture;
- Chrome DevTools Protocol on the Chrome backend;
- `file://` navigation;
- connecting to or spawning Chrome-family browsers.

### Critical cross-platform choice

On macOS, Bun.WebView defaults to WebKit. On Linux/Windows it defaults to Chrome.

Mikrouli's current oracle is Chromium, so **force the Chrome backend in the prototype on every platform**:

```js
new Bun.WebView({ backend: "chrome" })
```

Otherwise local macOS results and CI browser results would use different engines and accessibility/browser parity comparisons would be misleading.

## Prototype A — axe accessibility scan

### Current reference behavior

Keep the existing `@axe-core/playwright` implementation untouched and use its violations as the oracle.

Important behaviors to preserve include:

- current WCAG/best-practice tag set;
- scanning all intended generated HTML pages;
- current `main` scoping behavior where used;
- meaningful iframe behavior;
- exit code when violations exist;
- existing summary/report formatting where useful.

### Candidate Bun architecture

Conceptually:

```text
Bun.WebView (Chrome)
  -> navigate file:// or preview URL
  -> inject/load axe-core
  -> evaluate axe.run(...)
  -> normalize result
  -> compare with Playwright oracle
```

Do not assume `@axe-core/playwright` can simply be imported without Playwright. The prototype should use `axe-core` directly if necessary.

### Required parity comparison

For a representative route set compare:

- violation IDs;
- impact;
- affected node count;
- target selectors;
- frame coverage;
- exceptions/errors;
- exit behavior.

Exact object serialization does not need to match, but meaningful findings must.

### Browser diagnostics parity

Current helper also reports browser problems. Prototype equivalents must be demonstrated for:

- console errors;
- uncaught page exceptions;
- failed network requests.

Bun.WebView provides console capture and raw CDP. Use CDP events such as runtime exception/network failure only if needed; keep this prototype small and prove each feature before declaring parity.

## Prototype B — Lighthouse without Playwright wrapper

Do not force Lighthouse through Bun.WebView merely to say everything uses one abstraction.

Lighthouse fundamentally needs a Chromium debugging endpoint. Bun.WebView's spawned Chrome uses `--remote-debugging-pipe`, while Lighthouse integrations commonly work with an explicit debugging port/process.

A cleaner future architecture is:

```text
Bun orchestration
  -> Bun.spawn Chrome/Chromium with explicit debugging port
  -> official Lighthouse API/CLI
  -> existing thresholds/report files
```

This can potentially remove `playwright-lighthouse` even if Playwright remains for axe/browser automation, but **that is also prototype work** for now.

Compare the prototype against the current reports for:

- performance;
- accessibility;
- best-practices;
- SEO;
- report generation;
- threshold exit behavior.

## Do not remove browser installation support prematurely

Bun.WebView's Chrome backend still needs a Chrome-family executable. Its discovery can even use Playwright's cached `chrome-headless-shell`.

If a future implementation removes Playwright packages, CI must explicitly provision a compatible browser. Do not assume Bun.WebView means "no browser dependency" on Linux CI.

## Small-batch prototype plan

### Batch P0 — freeze current oracle outputs

Run the existing tests against a known production build and retain machine-readable summaries for a representative set of pages.

No production code changes.

### Batch P1 — one-page Bun.WebView smoke test

Create a standalone prototype script that:

- forces Chrome backend;
- opens one built page;
- evaluates `document.title` and a DOM query;
- captures console output;
- exits cleanly.

Do not wire it into CI.

### Batch P2 — axe parity on one page

Inject `axe-core`, use the same rules/tags/scope as the current implementation, and compare normalized violations.

### Batch P3 — axe parity across representative route types

Include homepage, content/detail page, embedded-content page, and another structurally different page.

Investigate frames and file-vs-preview navigation behavior.

### Batch P4 — browser error/network parity

Only after basic axe parity, reproduce current console/page/request diagnostics with WebView/CDP.

### Batch P5 — standalone Lighthouse orchestration experiment

Separately prototype Bun-spawned Chromium + official Lighthouse. Do not make WebView a dependency of this experiment unless there is a concrete benefit.

### Batch P6 — document outcome

Record:

- parity gaps;
- WebView API friction;
- CI browser provisioning implications;
- performance/startup differences;
- whether the experiment should be revisited.

Then delete or retain prototype code according to its usefulness. Do not silently turn it into the main test path.

## Current decision gate for any future replacement

Playwright may only be reconsidered for removal when **all** of the following are true:

1. `Bun.WebView` is no longer documented as experimental, or the user explicitly accepts its stability risk later.
2. Accessibility findings are equivalent on the real Mikrouli route set.
3. Browser diagnostics are equivalent enough to retain current failure visibility.
4. Lighthouse thresholds/reports are preserved through a stable alternative path.
5. CI browser provisioning is simpler or at least not more fragile.
6. The dependency reduction has a meaningful maintenance benefit.

Until then, Playwright is the stable oracle.

## Validation for prototype work

The existing production path must remain green throughout:

```bash
bun run test:axe
bun run test:lighthouse
bun run check:all
bun run build:prod
```

Prototype commands should be additive and clearly named, for example `prototype:*`; do not replace existing scripts.

## Research sources

- Bun WebView docs: https://bun.com/docs/runtime/webview
- Bun 1.4 release information: https://bun.com/
- axe-core: https://github.com/dequelabs/axe-core
- Playwright: https://playwright.dev/
- Lighthouse: https://github.com/GoogleChrome/lighthouse
