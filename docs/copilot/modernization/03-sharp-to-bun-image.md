# Mikrouli Sharp -> Bun.Image Migration

> Research snapshot: 2026-08-22
> Runtime target: Bun 1.4
> Current oracle: Sharp `^0.35.3`
> Audience: local GitHub Copilot coding agent

## Objective

Replace Sharp with Bun 1.4's native `Bun.Image` pipeline while preserving Mikrouli's current image-processing functionality and output contract. Small implementation/output concessions are acceptable only when they do not reduce site quality, accessibility, or correctness.

This migration should remove a native npm dependency and simplify the Bun-first toolchain, but stability and output parity are more important than dependency count.

## Current image-pipeline responsibilities

Repository inspection during this research found the Sharp pipeline performing these operations:

1. open local/CMS source image;
2. read image metadata;
3. generate configured image widths;
4. resize with aspect ratio preserved using inside-fit behavior;
5. prevent enlargement of smaller source images;
6. encode optimized WebP at configured quality;
7. write generated assets;
8. generate a tiny blurred placeholder data URL;
9. persist image metadata including width, height, placeholder, and `hasAlpha`.

Current project source assets observed during research are JPEG/JPG and PNG, which are portable Bun.Image formats on Linux, macOS, and Windows.

## Bun.Image functionality match

Bun 1.4's Image API is explicitly Sharp-inspired and supports the core operations Mikrouli uses.

| Current Sharp need | Bun.Image |
| --- | --- |
| JPEG/PNG input | Yes |
| WebP output | Yes |
| Metadata width/height | Yes |
| `fit: inside` | Yes |
| `withoutEnlargement` | Yes |
| WebP quality | Yes |
| File writes | Yes |
| Off-main-thread native work | Yes |
| Low-quality placeholder | Yes, `placeholder()` |
| `metadata().hasAlpha` | **No documented equivalent** |
| Arbitrary Sharp blur chain | No direct equivalent needed if adopting native placeholder |

## Recommended placeholder change

Current Sharp placeholder logic effectively does:

```text
resize to tiny width -> blur -> WebP quality 50 -> data URL
```

Bun.Image has a purpose-built terminal:

```js
const placeholder = await Bun.file(inputPath).image().placeholder();
```

It produces a ThumbHash-rendered, <=32px blurred `data:image/png;base64,...` URL of roughly a few hundred bytes.

### Accepted concession

The placeholder MIME/algorithm will change from a custom blurred WebP to Bun's PNG/ThumbHash-derived placeholder. Treat that as acceptable **only if**:

- the consuming component treats the placeholder as an opaque data URL;
- visual behavior remains acceptable;
- no tests/schema assume a WebP prefix.

Do not preserve custom Sharp blur logic merely to retain an implementation detail that Bun now provides natively.

## Main feature gap: `hasAlpha`

`Bun.Image.metadata()` documents only:

```text
width
height
format
```

Sharp currently supplies `hasAlpha`, and Mikrouli persists it in generated metadata.

### Required decision process

Before writing replacement code:

1. Search the entire repository for `hasAlpha` reads.
2. Classify each consumer:
   - correctness-critical;
   - visual optimization only;
   - dead/unused metadata.
3. Prefer the simplest option that preserves actual functionality.

### Option A — remove `hasAlpha` if it is not meaningfully consumed

Preferred if repository search proves the field is dead or no longer affects rendering.

- Remove it from metadata/types/generation together.
- Do not retain fields merely for historical parity.

### Option B — preserve alpha detection with a small focused helper

If `hasAlpha` still affects rendering, preserve it independently from Bun.Image.

Requirements for such a helper:

- support every **accepted input format**, not only one hand-picked PNG case;
- correctly distinguish opaque and transparent PNG, including palette transparency where applicable;
- cover any accepted WebP input if WebP sources are allowed;
- have fixture tests for opaque JPEG, opaque PNG, transparent PNG, and any other supported source type;
- fail loudly for unsupported formats rather than silently reporting false.

Do not implement a partial byte-header hack without tests and then call it equivalent to Sharp metadata.

### Option C — narrow the source-image contract

If Mikrouli intentionally accepts only JPEG/JPG/PNG source assets, encode that as an explicit validated contract and implement alpha behavior only for those formats. This is an acceptable simplification if the repository/content workflow already matches it.

## Input-format contract

Bun.Image portable support across Linux/macOS/Windows includes JPEG, PNG, and WebP. HEIC/AVIF availability differs by platform, so do not expand Mikrouli's accepted source formats merely because a developer Mac can decode them.

The migration should first inspect the actual configured `IMAGE_EXTENSIONS`. If the current list advertises formats that the repository/content workflow never uses, either:

- narrow/document the list to the cross-platform formats Mikrouli truly supports; or
- keep Sharp if those extra formats are a real requirement.

The CI environment is part of the compatibility target.

## Proposed Bun pipeline shape

Use this as a conceptual mapping, not copy-paste implementation:

```js
const source = Bun.file(inputPath);
const image = source.image();
const metadata = await image.metadata();

await Bun.file(inputPath)
  .image()
  .resize(targetWidth, undefined, {
    fit: "inside",
    withoutEnlargement: true,
  })
  .webp({ quality })
  .write(outputPath);

const placeholder = await Bun.file(inputPath).image().placeholder();
```

Do not reuse a mutable pipeline across concurrent output sizes unless Bun's documented semantics make that safe. Favor clear independent pipelines first; optimize only after correctness and profiling.

## Small-batch implementation plan

### Batch 0 — create parity fixtures

Before modifying production image logic, add a small fixture set:

- landscape JPEG larger than the largest target width;
- JPEG smaller than at least one requested width;
- opaque PNG;
- transparent PNG;
- optionally a real representative CMS image with EXIF orientation.

Run current Sharp processing and save measurable baseline data:

- output file names/count;
- width/height per output;
- format;
- file size;
- `hasAlpha` metadata;
- placeholder data-URL validity/size;
- orientation result.

Do not treat exact byte equality as a goal: different encoders will produce different bytes.

### Batch 1 — Bun.Image shadow implementation

Add a Bun implementation beside Sharp without changing the normal production path.

For the fixture set, generate a parallel output directory and compare:

- dimensions;
- aspect ratio;
- no-enlargement behavior;
- WebP decodability;
- metadata contract;
- placeholder behavior;
- orientation.

### Batch 2 — solve `hasAlpha`

Based on the repository-use inventory, either remove the field cleanly or implement/test the narrow preservation helper.

Keep this a distinct batch because it is the only meaningful API gap discovered in the current Sharp usage.

### Batch 3 — switch production processor to Bun.Image

Change only the image helper/processor path. Keep Sharp installed temporarily as a regression oracle if useful.

Run the full real asset generation and compare old/new inventories.

### Batch 4 — remove Sharp

Only after parity passes:

```bash
bun remove sharp
```

Then remove Sharp from `trustedDependencies` and delete any now-unused Sharp-specific helper code.

### Batch 5 — cleanup/document source-format contract

Update README/docs/types to reflect:

- Bun.Image ownership of image processing;
- accepted source formats;
- placeholder format semantics if documented;
- any intentional `hasAlpha` change.

## Parity acceptance criteria

### Functional

- Every current source image processes successfully in local and CI environments.
- Generated width set is unchanged.
- No image is enlarged when the current Sharp pipeline would not enlarge it.
- Aspect ratios match.
- Output format remains WebP where expected.
- Metadata JSON remains valid and all actually consumed fields remain correct.
- Placeholder remains a valid browser-displayable data URL.

### Visual/performance

- No visible quality regression at normal page sizes.
- Generated file sizes are broadly comparable; investigate material regressions rather than requiring exact equality.
- LCP/CLS behavior does not regress.
- Lighthouse remains within existing thresholds.

### Build/tooling

```bash
bun run assets
bun run check:all
bun run build
bun run build:prod
bun run test:lighthouse
```

Also run the image fixture/parity tests added for this migration.

## Rollback rule

If Bun.Image cannot preserve a currently required format, metadata behavior, or output quality without disproportionate custom code, keep Sharp. The goal is simplification, not replacing one mature dependency with a fragile home-grown image library.

## Research sources

- Bun Image docs: https://bun.com/docs/runtime/image
- Bun Image placeholder reference: https://bun.com/reference/bun/Image/placeholder
- Bun 1.4 release information: https://bun.com/
- Sharp: https://sharp.pixelplumbing.com/
