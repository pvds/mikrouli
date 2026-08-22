# Mikrouli Sharp -> Bun.Image Migration

> Research snapshot: 2026-08-22  
> Runtime target: Bun 1.4  
> Current image engine: Sharp `^0.35.3`  
> Current frontend: Svelte 5 / SvelteKit 2 / static generation  
> Audience: GitHub Copilot coding agent or developer implementing the migration  
> Status: implementation-ready migration plan; supersedes the previous `03-sharp-to-bun-image.md`

## Objective

Replace Sharp with Bun 1.4's native `Bun.Image` API while preserving the image
loading behavior that was deliberately optimized in the existing application:

- responsive WebP output;
- source width/height metadata for stable aspect-ratio reservation;
- an **instant CSS pulsating loading background** for normal opaque images;
- **no pulsating background for images whose generated WebP contains
  transparency**, because a rectangular background can look wrong behind
  transparent/cut-out artwork;
- no Base64/LQIP placeholder image in the browser;
- no additional browser image decode or request;
- no runtime transparency detection.

The migration should make the image system smaller and more explicit rather than
recreate all of Sharp's functionality.

The desired end state is:

```text
source image
    |
    v
Bun.Image
    |
    +--> metadata() --------------------> width / height
    |
    +--> responsive WebP variants
                  |
                  +--> build-time WebP transparency inspection
                                  |
                                  v
                         hasTransparency
                                  |
                                  v
                         generated metadata
                    { width, height, hasTransparency }
                                  |
                                  v
                           Image.svelte
                  opaque -> CSS pulse while loading
             transparent -> no pulse while loading
```

No Sharp. No Base64 placeholders. No placeholder image layer. No browser-side
transparency parser.

---

# Final decisions

These decisions are settled for this migration.

| Area | Decision |
| --- | --- |
| Image engine | Replace Sharp with `Bun.Image` |
| Output format | Keep WebP |
| Browser loading indication | Keep the existing instant CSS pulsating background |
| LQIP/Base64 placeholders | Remove them completely from generation, metadata and `Image.svelte` |
| `Bun.Image.placeholder()` | **Do not use it in the main implementation** |
| `hasAlpha` | Replace it with `hasTransparency` |
| Transparency source of truth | Inspect a generated WebP at build time |
| Transparency dependency | Use a small first-party WebP parser; no npm package |
| Browser cost of parser | None; parser exists only under `scripts/` |
| Transparent-image loading UX | A1: show no pulsating background |
| Opaque-image loading UX | Preserve the current pulse until the real image loads |
| Metadata | Keep `width`, `height`, `hasTransparency`; remove `placeholder` and `hasAlpha` |
| Orientation | Explicitly use `autoOrient: false` for Sharp parity |
| Source formats | Narrow to the portable formats Mikrouli actually needs |
| Generic format option | Remove after parity because the frontend is already WebP-specific |
| Sharp fallback | Keep only temporarily for parity comparison; remove after validation |

The key architecture decision is:

> `Image.svelte` does not need to know whether the source file has an alpha
> channel. It needs to know whether putting an opaque loading background behind
> the **generated image the browser will actually render** is visually safe.

`hasTransparency` therefore describes the output presentation requirement
better than Sharp's `hasAlpha`.

---

# Historical loading decisions: preserve the intent

The current code contains disabled Base64-placeholder logic, but repository
history shows this was deliberate rather than unfinished work.

## January 29, 2025 — alpha-aware placeholders

Commit `c0a45a3` introduced image metadata and explicitly documented:

> don't use placeholders when image contains alpha

The same change added `hasAlpha` to generated metadata.

Source:

https://github.com/pvds/mikrouli/commit/c0a45a3b8aeedb8e40b522150d4f9c0ad23b92ea

## February 12, 2025 — pulse loading background

Commit history then added:

> feat: add pulse animation to loading background

This established the CSS skeleton as a deliberate loading treatment.

History:

https://github.com/pvds/mikrouli/commits/main/src/lib/components/ui/image/Image.svelte

## February 14, 2025 — Base64 placeholder intentionally disabled

PR #10 optimized image loading around bundled metadata and the skeleton. One of
its two commits is:

> perf: avoid loading base64, only rely on skeleton until image is loaded

Commit:

https://github.com/pvds/mikrouli/pull/10/commits/716f1daf5a7b31dfb58406d5d6fbd4ca44c7ec8c

The diff added:

```js
const usePlaceholder = false;
```

and gated the Base64 `<img>` behind it.

This history should be retained in this document so a future modernization does
not accidentally reintroduce LQIP placeholders simply because Bun now has a
convenient `Image.placeholder()` API.

---

# Why `Bun.Image.placeholder()` is not the chosen solution

Bun 1.4 provides:

```js
const placeholder = await Bun.file("hero.jpg").image().placeholder();
```

which returns a ThumbHash-derived `data:image/png;base64,...` LQIP.

That API is useful in applications that want image placeholders, but Mikrouli
has already chosen a different loading strategy.

The CSS pulse is preferable here because it:

1. exists as soon as the initial HTML/CSS is painted;
2. does not require another image representation in metadata;
3. does not require a second image element;
4. does not require the browser to decode a placeholder image;
5. avoids maintaining placeholder swap logic;
6. avoids carrying Base64 strings in generated data;
7. is visually simple and predictable for normal photography.

An inline Base64 placeholder is not a second HTTP request, but it is still
additional encoded image data and another image representation for the browser
to parse/decode/render.

Therefore:

- do **not** migrate the current Sharp placeholder generator to
  `Bun.Image.placeholder()`;
- delete the placeholder pipeline instead;
- keep `Bun.Image.placeholder()` only as a documented future option if a real
  UX requirement appears.

---

# Current repository audit

## Current build-time image pipeline

`scripts/assets/helpers/images.js` currently:

1. creates a Sharp instance for every input;
2. generates one responsive output for every configured `IMAGE_SIZES` width;
3. uses `fit: inside`;
4. uses `withoutEnlargement: true`;
5. encodes WebP at configurable quality;
6. reads Sharp metadata;
7. generates a separate Base64 placeholder;
8. stores the following generated metadata:

```js
{
  placeholder: string,
  width: string,
  height: string,
  hasAlpha: boolean,
}
```

The existing resize path is effectively:

```js
image
  .clone()
  .resize({
    width: size,
    fit: sharp.fit.inside,
    withoutEnlargement: true,
  })
  .toFormat(format, { quality })
  .toFile(outputPath);
```

## Current placeholder generator

`scripts/assets/helpers/placeholders.js`:

1. opens the source through Sharp again;
2. resizes to width `16`;
3. applies `blur()`;
4. encodes WebP at quality `50`;
5. converts the encoded output to Base64;
6. supports an unused file-output mode as well.

The normal application path does not display these placeholders because
`Image.svelte` contains:

```js
const usePlaceholder = false;
```

The helper and generated metadata therefore carry complexity that is no longer
part of the intended browser UX.

## Current `Image.svelte`

The current component statically imports:

```js
import metadata from "$data/generated/meta/images.json";
```

and contains:

```js
const usePlaceholder = false;

let loadedData = $state(true);
let loadedImage = $state(false);

const placeholder = $derived(meta?.placeholder);
const hasAlpha = $derived(meta?.hasAlpha);
```

The loading background is:

```svelte
{loadedImage || hasAlpha
  ? ""
  : "bg-black/10 animate-pulse rounded-md"}
```

The important behavior is therefore:

```text
normal opaque image
  -> pulse background while loading
  -> final WebP

hasAlpha image
  -> no pulse background
  -> final WebP
```

The disabled Base64 placeholder branch is dead application behavior but still
exists in the component and generated metadata.

## Current type contract

`src/lib/types/content.d.ts` currently defines:

```ts
export type ImageMeta = {
  placeholder: string;
  width: string;
  height: string;
  hasAlpha: boolean;
};
```

Target:

```ts
export type ImageMeta = {
  width: string;
  height: string;
  hasTransparency: boolean;
};
```

Keep width/height as strings during this migration. Converting them to numbers
is an unrelated data-contract cleanup.

## Current source-format configuration

`src/config.js` currently has a broad Sharp/libvips-derived extension list that
includes formats the application does not actually require.

The same list is also used for:

1. input discovery;
2. generated-output stale-file matching.

Those are different responsibilities and should be separated during the
migration.

---

# Why `hasAlpha` cannot simply be removed

The earlier draft proposed deleting `hasAlpha` without replacement. That would
be a visual regression.

The current condition:

```svelte
loadedImage || hasAlpha
  ? ""
  : "bg-black/10 animate-pulse rounded-md"
```

has an important job:

> prevent a solid rectangular loading background from appearing behind an image
> that is supposed to have transparent/cut-out areas.

That use case remains valid.

For transparent artwork such as a cut-out person, chair or decorative PNG, an
opaque pulsing rectangle can be much more visually distracting than showing no
temporary fill at all.

Therefore the migration must preserve this behavior.

---

# Why `hasTransparency` is better than Sharp `hasAlpha`

Sharp's `metadata().hasAlpha` answers approximately:

> does the decoded source format contain an alpha channel?

The Svelte component actually needs:

> does the generated WebP the browser will display contain transparency?

Those are not the same question.

An image can have an alpha channel while all alpha values are fully opaque. In
that case:

```text
Sharp hasAlpha = true
```

can suppress the skeleton even though the skeleton would have been visually
safe.

The new contract should therefore use:

```js
hasTransparency
```

with the meaning:

> at least one generated WebP used by the responsive image pipeline contains
> transparency information, so do not place the opaque pulse background behind
> it.

This is presentation-oriented metadata rather than codec-oriented metadata.

---

# Bun does not expose alpha metadata

Bun 1.4's documented `Image.Metadata` contains:

```ts
{
  format;
  width;
  height;
}
```

There is no documented equivalent of:

```js
sharp(...).metadata().hasAlpha
```

Do not keep Sharp solely for this boolean.

Do not add another image-processing dependency solely for this boolean.

Instead, inspect the WebP output that Bun itself generates.

Bun's JPEG/PNG/WebP implementation is native and has no npm image dependency.
The transparency inspection described below is plain build-time JavaScript over
the encoded WebP container.

---

# Build-time WebP transparency detection

## Why inspect generated WebP rather than source files

Inspecting source files would require separate handling for at least:

- PNG truecolor alpha;
- PNG palette transparency;
- JPEG;
- WebP;
- any future supported source container.

That would recreate a mini image-metadata library.

Mikrouli already normalizes browser output to **one format: WebP**.

Therefore:

```text
many possible source representations
            |
            v
        Bun.Image
            |
            v
           WebP
            |
            v
 one small transparency parser
```

This keeps the custom code narrow and aligned with what the browser actually
uses.

## WebP transparency signals

WebP is a RIFF container.

For extended WebP, the `VP8X` feature byte has an alpha flag and lossy
transparency uses an `ALPH` chunk.

For lossless WebP (`VP8L`), the lossless image header contains an
`alpha-is-used` bit.

The parser should support both forms even though the current Mikrouli pipeline
uses normal quality-based WebP encoding. Supporting both costs very little and
makes the helper resilient if the output options change later.

Specification:

https://developers.google.com/speed/webp/docs/riff_container

Lossless specification:

https://developers.google.com/speed/webp/docs/webp_lossless_bitstream_specification

## Recommended helper

Add:

```text
scripts/assets/helpers/webp.js
```

with one responsibility:

```js
hasWebpTransparency(bytes)
```

Recommended implementation shape:

```js
/**
 * Checks whether encoded WebP bytes advertise transparency.
 *
 * Supports:
 * - extended WebP via the VP8X alpha feature flag;
 * - lossy WebP via an ALPH chunk;
 * - lossless VP8L via its alpha-is-used bit.
 *
 * @param {Uint8Array} bytes
 * @returns {boolean}
 */
export function hasWebpTransparency(bytes) {
  if (bytes.length < 12) {
    throw new Error("Invalid WebP: file is too small");
  }

  if (readFourCC(bytes, 0) !== "RIFF" || readFourCC(bytes, 8) !== "WEBP") {
    throw new Error("Invalid WebP: missing RIFF/WEBP signature");
  }

  const view = new DataView(
    bytes.buffer,
    bytes.byteOffset,
    bytes.byteLength,
  );

  let offset = 12;

  while (offset + 8 <= bytes.length) {
    const type = readFourCC(bytes, offset);
    const size = view.getUint32(offset + 4, true);
    const dataOffset = offset + 8;
    const chunkEnd = dataOffset + size;

    if (chunkEnd > bytes.length) {
      throw new Error(`Invalid WebP: truncated ${type} chunk`);
    }

    if (type === "VP8X") {
      if (size < 1) {
        throw new Error("Invalid WebP: empty VP8X chunk");
      }

      // VP8X alpha feature flag.
      if ((bytes[dataOffset] & 0x10) !== 0) {
        return true;
      }
    }

    if (type === "ALPH") {
      return true;
    }

    if (type === "VP8L") {
      if (size < 5 || bytes[dataOffset] !== 0x2f) {
        throw new Error("Invalid WebP: malformed VP8L header");
      }

      const header = view.getUint32(dataOffset + 1, true);

      // VP8L packs width (14), height (14), alpha-is-used (1), version (3).
      if ((header & 0x10000000) !== 0) {
        return true;
      }
    }

    // RIFF chunks are padded to an even byte boundary.
    offset = chunkEnd + (size & 1);
  }

  return false;
}

/**
 * @param {Uint8Array} bytes
 * @param {number} offset
 * @returns {string}
 */
function readFourCC(bytes, offset) {
  return String.fromCharCode(
    bytes[offset],
    bytes[offset + 1],
    bytes[offset + 2],
    bytes[offset + 3],
  );
}
```

Treat this as the intended implementation shape, but validate it against the
real Bun-generated fixtures before merging.

## No browser dependency

This helper lives under:

```text
scripts/assets/helpers/
```

and runs only during asset generation.

It must never be imported by:

```text
src/
```

Therefore it has no effect on:

- browser JavaScript bundle size;
- hydration;
- client main-thread time;
- INP;
- LCP;
- CLS;
- image request count;
- browser image decode count.

The only cost is a tiny amount of build-time JavaScript that reads WebP container
metadata.

---

# Which generated WebP should be inspected?

## Recommended initial implementation: inspect the largest generated variant

After responsive output generation succeeds, inspect the largest configured
variant:

```js
const transparencyProbeSize = IMAGE_SIZES.at(-1);
const transparencyProbePath = path.join(
  outDir,
  buildFileName(
    baseName,
    transparencyProbeSize.toString(),
    IMAGE_EXT,
  ),
);

const hasTransparency = hasWebpTransparency(
  await Bun.file(transparencyProbePath).bytes(),
);
```

Why the largest variant:

- it is closest to the source representation;
- it minimizes the chance that very small transparent details disappear during
  aggressive downscaling;
- it always exists because `withoutEnlargement: true` still writes the named
  output without enlarging a smaller source;
- it keeps the implementation to one WebP read per source image.

This read happens at build time only.

## Conservative fallback if testing exposes size-dependent transparency

If testing shows a real case where transparency differs between generated
responsive sizes, change the implementation to inspect all generated variants
and OR the result:

```js
const hasTransparency = (
  await Promise.all(
    IMAGE_SIZES.map(async (size) => {
      const outputPath = /* build generated path */;
      return hasWebpTransparency(await Bun.file(outputPath).bytes());
    }),
  )
).some(Boolean);
```

Do not implement this pre-emptively unless the fixture tests demonstrate that it
is necessary. Prefer the one-probe design for simplicity.

## Cache semantics

The current image pipeline has a known separate issue:

> an input changed under the same filename may not regenerate existing outputs.

The new transparency metadata will initially inherit that same behavior because
it is derived from the generated output.

Do not mix a full content-hashing/cache invalidation redesign into this
migration. Keep that existing TODO separate.

A forced parity run must regenerate all files before validating the new
metadata.

---

# `Bun.Image` migration details

## Bun capabilities used

Bun 1.4 supports the required pipeline directly:

```js
await Bun.file("photo.jpg")
  .image({ autoOrient: false })
  .resize(800, undefined, {
    fit: "inside",
    withoutEnlargement: true,
  })
  .webp({ quality: 80 })
  .write("photo-800.webp");
```

Relevant documented behavior:

- omit height to preserve source aspect ratio;
- `fit: "inside"` is supported;
- `withoutEnlargement: true` is supported;
- WebP quality uses a `1-100` scale;
- image terminals run off the JavaScript thread;
- `metadata()` reads `width`, `height`, and `format`;
- `.bytes()`, `.buffer()`, `.blob()`, and `.write()` are available terminals;
- JPEG/PNG/WebP use Bun's portable codecs on Linux, macOS and Windows;
- input format is sniffed from bytes rather than trusted from file extension.

Documentation:

https://bun.com/docs/runtime/image

---

# Important parity trap: EXIF orientation

Sharp's constructor defaults to:

```text
autoOrient: false
```

Bun.Image defaults to:

```text
autoOrient: true
```

The current Mikrouli Sharp pipeline does not explicitly auto-orient images.

A naive replacement:

```js
Bun.file(inputPath).image()
```

could therefore rotate/flip EXIF-oriented JPEGs and change their reported
dimensions.

For this migration define:

```js
const BUN_IMAGE_OPTIONS = {
  autoOrient: false,
};
```

and use it consistently:

```js
source.image(BUN_IMAGE_OPTIONS)
```

for:

- metadata;
- every responsive resize.

Do not accept automatic orientation as an accidental side effect of changing
libraries.

If Mikrouli later wants automatic EXIF correction, make that a separate,
intentional behavior change.

Sharp reference:

https://sharp.pixelplumbing.com/api-constructor/

---

# Target metadata contract

## Before

```json
{
  "placeholder": "data:image/webp;base64,...",
  "width": "1200",
  "height": "800",
  "hasAlpha": false
}
```

## After

```json
{
  "width": "1200",
  "height": "800",
  "hasTransparency": false
}
```

For a transparent output:

```json
{
  "width": "1200",
  "height": "1200",
  "hasTransparency": true
}
```

This is smaller, clearer and directly aligned with `Image.svelte`.

---

# Remove the placeholder pipeline completely

Delete:

```text
scripts/assets/helpers/placeholders.js
```

Remove:

```js
import { generatePlaceholder } from "./placeholders";
```

Remove all calls to:

```js
generatePlaceholder(...)
```

Remove `placeholder` from:

- generated image metadata;
- JSDoc metadata types;
- `ImageMeta`;
- `Image.svelte`;
- per-image generated JSON;
- combined `images.json`.

Do not replace the helper with a one-line `Bun.Image.placeholder()` wrapper.

The correct modernization is deletion, not translation.

---

# Browser performance consequences

This migration does **not** ship the transparency parser to the browser.

In addition, removing placeholder strings may improve browser payload size.

The component statically imports:

```js
import metadata from "$data/generated/meta/images.json";
```

and the current generated JSON contains a Base64 placeholder for every image,
even though rendering them is disabled.

Removing `placeholder` therefore:

- definitely shrinks generated metadata JSON;
- removes unused Base64 strings from application data;
- is expected to reduce bundled/transferred metadata as well, depending on the
  final Vite/Rolldown optimization;
- removes any chance of a placeholder image decode/render;
- keeps the single real responsive WebP as the only meaningful image load.

Do not assume an exact browser byte saving. Measure the production build before
and after.

Suggested checks:

```bash
wc -c src/data/generated/meta/images.json
```

and after a production build, search generated client assets for old Base64
image strings:

```bash
rg "data:image/(webp|png);base64" build .svelte-kit
```

Use the repository's actual build-output paths if they differ.

---

# Target `Image.svelte`

## Responsibilities after migration

`Image.svelte` should:

1. resolve responsive image URLs;
2. reserve aspect ratio from generated width/height;
3. show the instant CSS pulse for opaque images while the real image is loading;
4. suppress the pulse for transparent images;
5. render the real responsive WebP;
6. preserve existing mask/drop-shadow behavior.

It should not know:

- whether the source file had an alpha channel;
- how WebP transparency is detected;
- anything about placeholder generation;
- anything about a disabled dynamic metadata-loading experiment.

## Remove dead state and placeholder code

Delete:

```js
const usePlaceholder = false;
```

Delete:

```js
let loadedData = $state(true);
```

Delete:

```js
const placeholder = $derived(meta?.placeholder);
```

Delete the commented dynamic metadata import block.

Delete the complete disabled placeholder branch:

```svelte
{#if usePlaceholder && placeholder && !hasAlpha && !loadedImage}
  ...
{/if}
```

Delete its duplicate `<img>` and `backdrop-blur-xl` layer.

The component already has statically available metadata, so `loadedData` is not
a meaningful state.

## Replace `hasAlpha`

Change:

```js
const hasAlpha = $derived(meta?.hasAlpha);
```

to:

```js
const hasTransparency = $derived(meta?.hasTransparency ?? false);
```

Prefer an explicit presentation-oriented derived value:

```js
const showLoadingBackground = $derived(
  !loadedImage && !hasTransparency,
);
```

Then apply the same visual classes currently used for the skeleton when
`showLoadingBackground` is true.

Conceptually:

```svelte
<div
  class="relative {height} {width} not-prose {
    showLoadingBackground
      ? 'bg-black/10 animate-pulse rounded-md'
      : ''
  }"
  style="..."
>
  <picture>
    <source
      srcset={srcset(IMAGE_SIZES)}
      sizes={sizes}
      type="image/webp"
    />

    <img
      src={`${base}${directory}/${image}-1280.webp`}
      {alt}
      class="{POSITION_CLASSES} {positionClass} {classes} {height} {width}"
      class:opacity-0={!loadedImage}
      loading={priority ? "eager" : "lazy"}
      fetchpriority={priority ? "high" : null}
      onload={() => (loadedImage = true)}
      onerror={() => (loadedImage = false)}
      style={maskIndex ? `clip-path: url(#mask${maskIndex});` : ""}
    />
  </picture>
</div>
```

Adapt this to the exact existing markup rather than replacing mask behavior
blindly.

## Loading behavior after migration

Opaque:

```text
SSR HTML/CSS
    |
    v
instant pulse background
    |
    v
responsive WebP loads
    |
    v
loadedImage = true
    |
    v
pulse removed
```

Transparent:

```text
SSR HTML/CSS
    |
    v
no opaque loading background
    |
    v
responsive WebP loads
```

This is the chosen **A + A1** behavior.

Do not add a second transparent-image loading treatment unless visual testing
shows a real problem.

---

# Transparent-image UX: chosen A1 behavior

The absence of a pulse for transparent images is intentional.

Advantages:

- avoids ugly rectangular fill behind cut-out artwork;
- no placeholder image machinery;
- no special transparent-image asset;
- no second decode;
- no extra browser data;
- simple deterministic rule.

The trade-off is that transparent images have no visual loading indicator during
their load window.

That is accepted because transparent images are exceptional and the alternative
would add disproportionate complexity.

If future UX testing shows that a transparent image genuinely needs an
indication, evaluate separately:

1. a very subtle non-filled outline/skeleton;
2. a per-image opt-in LQIP using `Bun.Image.placeholder()`;
3. another presentation-specific treatment.

Do not pre-implement any of these in this migration.

---

# Target Bun image processor

## Shared options

In `scripts/assets/helpers/images.js`:

```js
const BUN_IMAGE_OPTIONS = {
  autoOrient: false,
};
```

## Source

For each input:

```js
const source = Bun.file(inputPath);
```

## Metadata

Replace Sharp:

```js
const { width, height, hasAlpha } = await image.metadata();
```

with Bun:

```js
const { width, height } = await source
  .image(BUN_IMAGE_OPTIONS)
  .metadata();
```

## Responsive generation

Do not search for a Bun equivalent of Sharp `.clone()`.

Create a fresh pipeline for every output:

```js
await source
  .image(BUN_IMAGE_OPTIONS)
  .resize(size, undefined, {
    fit: "inside",
    withoutEnlargement: true,
  })
  .webp({ quality })
  .write(outputPath);
```

Mapping:

```text
Sharp clone()                     -> fresh source.image(...)
Sharp resize({ width })           -> resize(width, undefined, ...)
Sharp fit: inside                 -> fit: "inside"
Sharp withoutEnlargement          -> withoutEnlargement: true
Sharp toFormat("webp", options)   -> webp({ quality })
Sharp toFile(path)                -> write(path)
```

## Transparency metadata

After all outputs for the image exist:

```js
const transparencyProbeSize = IMAGE_SIZES.at(-1);

const transparencyProbePath = path.join(
  outDir,
  buildFileName(
    baseName,
    transparencyProbeSize.toString(),
    IMAGE_EXT,
  ),
);

const hasTransparency = hasWebpTransparency(
  await Bun.file(transparencyProbePath).bytes(),
);

metaData[baseName] = {
  width: width.toString(),
  height: height.toString(),
  hasTransparency,
};
```

The exact function boundaries can differ, but preserve this architecture.

---

# Error handling requirement

The current `generateImages()` catches each per-size Sharp failure internally,
logs it, and does not clearly fail the entire asset command.

That becomes especially dangerous once metadata depends on a valid generated
WebP probe.

During this migration either:

- remove the inner `.catch(...)` and allow the promise to reject; or
- log and then rethrow.

For example:

```js
try {
  await source
    .image(BUN_IMAGE_OPTIONS)
    .resize(...)
    .webp({ quality })
    .write(outputPath);
} catch (error) {
  logError(`Failed to generate image ${outputFileName}:`, error);
  throw error;
}
```

Do not allow image processing to report success and then derive metadata from a
missing or stale probe file.

This is directly related to migration correctness and belongs in the core
cutover.

---

# Source/output format cleanup

## Replace broad Sharp extension list

Current `IMAGE_EXTENSIONS` reflects the old Sharp/libvips capability surface
rather than Mikrouli's actual contract.

Prefer:

```js
export const IMAGE_EXT = "webp";

export const IMAGE_SOURCE_EXTENSIONS = [
  "jpeg",
  "jpg",
  "png",
  "webp",
];
```

Use:

```js
IMAGE_SOURCE_EXTENSIONS
```

only for source discovery.

Use:

```js
IMAGE_EXT
```

for generated-output matching.

This makes input and output semantics explicit.

## Byte sniffing

Bun sniffs image type from the file bytes rather than trusting the extension.

This is useful for the known repository edge case where an asset filename and
its actual encoded image type may not match.

Do not add platform-dependent AVIF/HEIC support to this SSG migration unless
Mikrouli has a concrete content requirement for it.

JPEG, PNG and WebP are the portable target across Linux CI, macOS and Windows.

---

# Remove false genericity from output format

The existing `processImages()` exposes a generic `format` option, but the
frontend hardcodes:

```text
.webp
```

and:

```html
type="image/webp"
```

The application is already WebP-specific end-to-end.

After parity is established, simplify the image processor API to something like:

```js
processImages(category, {
  quality = 80,
  concurrency = CPU_COUNT,
  force = false,
} = {})
```

and encode explicitly:

```js
.webp({ quality })
```

Keep `quality`, `concurrency` and `force`.

Remove Sharp-specific format JSDoc types.

---

# Concurrency

Keep the current outer image-level concurrency model initially.

For each image, creating a fresh Bun pipeline per target width is correct:

```js
source.image(BUN_IMAGE_OPTIONS)
```

Do not share one mutable `Bun.Image` instance between concurrent resize
operations.

The first implementation may preserve:

```js
Promise.all(IMAGE_SIZES.map(...))
```

inside each image task.

After correctness is proven, benchmark rather than speculate:

- current Sharp asset generation time;
- Bun with current concurrency structure;
- Bun with sequential per-size generation inside concurrent image workers.

Only change concurrency strategy if measurements show a meaningful gain in
speed or memory use.

---

# Recommended implementation batches

Each batch should be reviewable independently and keep the repository in a
coherent state.

## Batch 0 — capture baseline

Before code changes:

1. force-regenerate the current Sharp outputs;
2. record current processing time;
3. record current `images.json` byte size;
4. build staging and production;
5. record Lighthouse results;
6. record representative generated WebP byte sizes;
7. identify transparency fixtures;
8. capture screenshots of representative opaque and transparent image loading
   if useful.

Recommended real fixtures:

- `chair` — expected transparent;
- `eleni-papamikrouli` — expected transparent;
- `starting-therapy-1` — currently `hasAlpha: true`; use it to test whether the
  generated output actually needs transparency treatment;
- a normal large JPEG;
- an image smaller than one or more configured target sizes;
- an EXIF-oriented JPEG if one exists.

Do not compare encoded files byte-for-byte across Sharp and Bun.

## Batch 1 — add and validate WebP transparency helper

Add:

```text
scripts/assets/helpers/webp.js
```

with:

```js
hasWebpTransparency(bytes)
```

Validate it against existing Sharp-generated WebPs before replacing Sharp.

Expected minimum cases:

```text
chair generated WebP              -> true
eleni-papamikrouli generated WebP -> true
normal photograph                 -> false
```

Also explicitly inspect `starting-therapy-1`.

If it currently has `hasAlpha: true` but its generated WebP has no transparency,
that demonstrates why `hasTransparency` is a better UI contract.

Recommended focused test:

- opaque generated WebP => `false`;
- transparent lossy WebP => `true`;
- if convenient, a lossless VP8L transparent WebP => `true`;
- invalid input => clear error.

Use Bun's built-in test runner if adding a test file; do not add a testing
dependency solely for this helper.

## Batch 2 — simplify `Image.svelte` and metadata contract while Sharp remains

Goal: establish the final browser contract before changing the encoder.

1. remove `usePlaceholder`;
2. remove `loadedData`;
3. delete the commented dynamic metadata import;
4. remove placeholder rendering and backdrop blur;
5. remove `placeholder` usage;
6. rename `hasAlpha` consumption to `hasTransparency`;
7. add `showLoadingBackground = !loadedImage && !hasTransparency`;
8. keep current pulse classes;
9. keep current `loadedImage`, mask and drop-shadow behavior;
10. update `ImageMeta`.

Because Sharp still only provides `hasAlpha` in this batch, either:

- temporarily map `hasAlpha` to a generated `hasTransparency` key; or preferably
- use the WebP helper on the existing generated output immediately.

Do not introduce an intermediate browser API that will be removed in the next
batch.

Remove `placeholder` from generated metadata in this batch so the browser
payload becomes final before the Bun encoder migration.

## Batch 3 — delete Sharp placeholder generation

Delete:

```text
scripts/assets/helpers/placeholders.js
```

Remove its import and all calls.

Regenerate metadata and verify:

```json
{
  "width": "...",
  "height": "...",
  "hasTransparency": false
}
```

Search first-party code:

```bash
rg "placeholder|usePlaceholder|hasAlpha" scripts src
```

Review matches rather than requiring the word `placeholder` to disappear
globally; unrelated UI/content placeholders may exist.

Specific image-pipeline expectations:

- no image metadata `placeholder`;
- no `usePlaceholder`;
- no image `hasAlpha`;
- no `placeholders.js`.

Build and compare generated client output size against Batch 0.

## Batch 4 — replace Sharp resizing and metadata with Bun.Image

Core cutover:

1. remove `import sharp from "sharp"`;
2. add `BUN_IMAGE_OPTIONS = { autoOrient: false }`;
3. create one `BunFile` per source;
4. use Bun `metadata()` for width/height;
5. create a fresh Bun image pipeline per target size;
6. use `fit: "inside"`;
7. use `withoutEnlargement: true`;
8. use `.webp({ quality })`;
9. use `.write(outputPath)`;
10. let generation failures reject;
11. inspect the generated WebP probe for `hasTransparency`;
12. write final metadata.

Force-regenerate all assets so old Sharp outputs cannot accidentally satisfy the
new checks.

Keep Sharp installed temporarily for direct local comparison if useful, but no
production script should import it after this batch.

## Batch 5 — narrow image formats and simplify WebP-only API

After Bun parity passes:

1. add `IMAGE_SOURCE_EXTENSIONS`;
2. restrict it to JPEG/JPG/PNG/WebP;
3. use `IMAGE_EXT` for generated-output regex;
4. remove generic `format` options;
5. remove Sharp-specific JSDoc types;
6. keep quality/concurrency/force.

## Batch 6 — remove Sharp completely

Run:

```bash
bun remove sharp
```

Then verify `package.json`:

- no `sharp` in `devDependencies`;
- no `sharp` in `trustedDependencies`.

Also verify:

```bash
rg "\bsharp\b" .
```

Review documentation matches before deleting historical references.

## Batch 7 — final regression gate

Force-regenerate all images with Bun, then run the repository's real equivalents
of:

```bash
bun run assets:process --local --cms --force
bun run check:all
bun run build
bun run build:prod
bun run test:axe
bun run test:lighthouse
```

If the CLI flags differ, use the actual supported asset commands.

Do not validate a Bun migration against previously generated Sharp output.

---

# Acceptance criteria

## Image processing

- all current required JPEG/JPG/PNG/WebP inputs process successfully;
- every configured responsive filename is generated;
- output remains WebP;
- aspect ratios match the Sharp baseline;
- smaller inputs are not enlarged;
- visual quality at the current quality value is acceptable;
- transparent images retain transparency;
- EXIF orientation behavior matches Sharp because `autoOrient` is explicitly
  `false`;
- Linux CI and local macOS behavior are equivalent for the supported portable
  formats.

## Transparency metadata

Generated metadata is:

```json
{
  "width": "...",
  "height": "...",
  "hasTransparency": false
}
```

Requirements:

- no `hasAlpha`;
- no `placeholder`;
- `chair` reports `hasTransparency: true`;
- `eleni-papamikrouli` reports `hasTransparency: true`;
- normal photography reports `false`;
- `starting-therapy-1` is determined from actual generated WebP rather than
  source alpha-channel presence;
- transparency detection happens only at build time.

## `Image.svelte`

Opaque image:

- aspect ratio is reserved immediately;
- CSS pulse appears immediately;
- only the real responsive WebP is loaded as image content;
- pulse is removed after load.

Transparent image:

- aspect ratio is reserved;
- no opaque pulse background is shown;
- real transparent WebP renders normally.

General:

- no Base64 placeholder `<img>`;
- no backdrop blur placeholder layer;
- no duplicate alt text;
- no placeholder fetch/loading attributes;
- masks still work;
- drop shadows still work;
- no new layout shift.

## Performance

Runtime expectations:

- no new browser JavaScript dependency;
- no transparency parser in client output;
- no additional HTTP image request;
- no additional image decode;
- no LCP regression;
- no CLS regression;
- no INP regression;
- Lighthouse remains at or above project thresholds.

Expected potential improvement:

- generated metadata becomes smaller because Base64 placeholders are removed;
- client payload may shrink if those JSON values are currently bundled;
- asset generation no longer performs separate tiny placeholder encodes.

Measure rather than assume exact savings.

## Dependency state

Final:

- no Sharp dependency;
- no Sharp trusted dependency entry;
- no image placeholder helper;
- no third-party transparency package;
- only Bun.Image performs image decoding/resizing/encoding.

---

# Performance and UX decision summary

## Compared with the current implementation

Browser behavior should remain effectively the same:

```text
opaque:
pulse -> image

transparent:
nothing -> image
```

The migration does not add browser work.

The new WebP parser is **build-time only**.

## Compared with adopting Bun placeholders

Chosen design:

```text
CSS skeleton
+ one real responsive image
```

Rejected default design:

```text
Base64 placeholder image
+ real responsive image
+ swap logic
```

The CSS design is preferred because it is:

- immediate;
- cheaper;
- simpler;
- consistent with the 2025 performance decision;
- already visually accepted by the application.

---

# Rollback / decision gates

Do not remove Sharp permanently until Bun passes all real repository fixtures.

Keep Sharp only if Bun fails a real processing requirement such as:

- unacceptable WebP quality;
- lost transparency;
- incorrect resize behavior;
- CI platform incompatibility;
- orientation parity that cannot be controlled.

Do **not** keep Sharp merely because Bun metadata lacks `hasAlpha`.

The lack of `hasAlpha` is solved narrowly and dependency-free by inspecting the
generated WebP.

If only transparent-image loading appearance is unsatisfactory, revisit the A1
presentation choice independently. Do not roll back the encoder migration for a
temporary loading-state preference.

---

# Separate follow-ups — do not mix unless required

Repository inspection also exposes unrelated cleanup opportunities.

## Same-filename source changes are not detected

The TODO already records that image synchronization is based on image name, so
replacing an image under the same name may not invalidate generated output.

Keep this as a separate scoped objective.

## Stale deletion double increment

The current stale-image branch contains both:

```js
safeIncrement(counts, "deleted");
counts.deleted++;
```

which appears to increment the same count twice.

Do not silently change it inside the Bun migration unless it interferes with
validation.

## Broader `Image.svelte` progressive enhancement

The component still uses client `onload` state for opacity/loading state.

A future review could ask whether the final image can paint naturally over the
CSS background with less client state, but that changes component behavior and
is not required for Sharp removal.

Keep it out of this migration.

---

# Expected final code shape

## Build-time

```text
scripts/assets/helpers/images.js
  |
  +-- Bun.file(inputPath)
  |
  +-- image({ autoOrient: false }).metadata()
  |
  +-- image({ autoOrient: false })
  |      .resize(...)
  |      .webp(...)
  |      .write(...)
  |        x IMAGE_SIZES
  |
  +-- read largest generated WebP bytes
  |
  +-- hasWebpTransparency(bytes)
  |
  +-- write metadata
       {
         width,
         height,
         hasTransparency
       }

scripts/assets/helpers/webp.js
  |
  +-- tiny RIFF/WebP transparency inspection
```

## Browser

```text
Image.svelte
  |
  +-- metadata width/height
  |
  +-- hasTransparency
  |
  +-- loadedImage
  |
  +-- opaque && !loaded -> CSS pulse
  |
  +-- transparent       -> no pulse
  |
  +-- responsive WebP <picture>
```

## Removed

```text
sharp
placeholders.js
Base64 placeholder metadata
placeholder <img>
backdrop-blur placeholder layer
usePlaceholder
loadedData
hasAlpha
```

That is the desired modernization outcome.

---

# Research sources

## Current Mikrouli repository

Current image processor:

https://github.com/pvds/mikrouli/blob/main/scripts/assets/helpers/images.js

Current placeholder helper:

https://github.com/pvds/mikrouli/blob/main/scripts/assets/helpers/placeholders.js

Current image component:

https://github.com/pvds/mikrouli/blob/main/src/lib/components/ui/image/Image.svelte

Current image metadata type:

https://github.com/pvds/mikrouli/blob/main/src/lib/types/content.d.ts

Current image configuration:

https://github.com/pvds/mikrouli/blob/main/src/config.js

Current generated combined image metadata:

https://github.com/pvds/mikrouli/blob/main/src/data/generated/meta/images.json

Image component history:

https://github.com/pvds/mikrouli/commits/main/src/lib/components/ui/image/Image.svelte

Alpha-aware metadata commit:

https://github.com/pvds/mikrouli/commit/c0a45a3b8aeedb8e40b522150d4f9c0ad23b92ea

Image-loading performance PR:

https://github.com/pvds/mikrouli/pull/10

Base64-placeholder disabling commit:

https://github.com/pvds/mikrouli/pull/10/commits/716f1daf5a7b31dfb58406d5d6fbd4ca44c7ec8c

## Bun 1.4

Bun Image documentation:

https://bun.com/docs/runtime/image

`BunFile.image()`:

https://bun.com/reference/bun/BunFile/image

`Image.resize()`:

https://bun.com/reference/bun/Image/resize

`Image.placeholder()` — researched but intentionally not used:

https://bun.com/reference/bun/Image/placeholder

## WebP

WebP RIFF container specification:

https://developers.google.com/speed/webp/docs/riff_container

WebP lossless bitstream specification:

https://developers.google.com/speed/webp/docs/webp_lossless_bitstream_specification

## Sharp parity reference

Sharp constructor options (`autoOrient` defaults to `false`):

https://sharp.pixelplumbing.com/api-constructor/
