<script lang="ts">
import { resolve } from "$app/paths";
import { IMAGE_SIZES } from "$config";
import metadata from "$data/generated/meta/images.json";
import type { ImageMeta } from "$types/content";

interface Props {
	image: string;
	alt: string;
	sizes: string;
	priority?: boolean;
	maskIndex?: number;
	classes?: string;
	heightClass?: string;
	widthClass?: string;
	positionClass?: string;
	isLocal?: boolean;
}

let {
	image,
	alt,
	sizes,
	priority,
	classes,
	maskIndex,
	isLocal = false,
	heightClass = "h-full",
	widthClass = "w-full",
	positionClass = "object-center",
}: Props = $props();

const base = resolve("/");
const IMAGE_DIR = "images";
const POSITION_CLASSES = "absolute object-cover";

let loadedImage = $state(false);

type MetadataCollection = Record<string, ImageMeta | undefined>;
const imageMetadata: {
	local: MetadataCollection;
	cms: MetadataCollection;
} = metadata;

const metaCategory = $derived(
	isLocal ? imageMetadata.local : imageMetadata.cms,
);
const meta = $derived(metaCategory[image]);

const height = $derived(heightClass ? heightClass : "h-full");
const width = $derived(widthClass ? widthClass : "w-full");
const directory = $derived(`${IMAGE_DIR}/${isLocal ? "local" : "cms"}`);

const aspectRatio = $derived(meta ? `${meta.width}/${meta.height}` : "1/1");
const hasTransparency = $derived(meta?.hasTransparency);
const showLoadingBackground = $derived(!loadedImage && !hasTransparency);

const srcset = (sizes: number[]): string =>
	sizes
		.map((size) => `${base}${directory}/${image}-${size}.webp ${size}w`)
		.join(", ");
</script>

<div
	class={[
		"relative not-prose",
		height,
		width,
		showLoadingBackground && "bg-black/10 animate-pulse rounded-md",
		loadedImage && maskIndex && "drop-shadow-[0_6px_18px_rgba(0,0,0,0.25)]",
	]}
	style="{`aspect-ratio: ${aspectRatio};`}
{maskIndex && !loadedImage ? `clip-path: url(#mask${maskIndex});`: ''}"
>
	<picture>
		<source srcset={srcset(IMAGE_SIZES)} sizes={sizes} type="image/webp" />
		<img src={`${base}${directory}/${image}-1280.webp`} {alt}
			class={[POSITION_CLASSES, positionClass, classes, height, width, { "opacity-0": !loadedImage }]}
			loading={priority ? "eager" : "lazy"}
			decoding={priority ? "sync" : "async"}
			fetchpriority={priority ? "high" : "auto"}
			onload={() => loadedImage = true}
			onerror={() => loadedImage = false}
			style={maskIndex ? `clip-path: url(#mask${maskIndex});`: ""}
		/>
	</picture>
</div>

<!-- Steps to create a blob:
1. Copy desired blob code on https://www.blobmaker.app/
2. Crop the SVG code on https://svgcrop.com/
3. Optimize the SVG code on https://jakearchibald.github.io/svgomg/
4. Normalize the viewBox attribute to start with "0 0" by adjusting the path coordinates
5. Add the clip-path attribute to the image element
6. Use 1/viewBox width and height as scale values in the clipPath element
-->
{#if maskIndex === 1}
<svg width="0" height="0" viewBox="0 0 99.8 120.1">
	<clipPath id="mask1" clipPathUnits="objectBoundingBox" transform="scale(0.01002, 0.008326)">
		<path d="M98.3 49c5 23-3 44-21 58-17 13-42 18-59 7-16-10-23-38-15-64 7-26 28-51 49-50 21 0 41 25 46 49Z"/>
	</clipPath>
</svg>
{:else if maskIndex === 2}
<svg width="0" height="0" viewBox="0 0 150.9 152.3">
	<clipPath id="mask2" clipPathUnits="objectBoundingBox" transform="scale(0.006626905235,0.006565988181)">
		<path d="M104.6 11.3c12 5 25 10 34 20 10 10 15 24 11 35-5 12-19 21-28 32-8 11-11 25-18 36-8 11-21 20-33 18s-22-15-33-24c-11-10-22-16-28-25s-8-21-9-35c-1-13-2-27 3-38 5-12 15-22 27-27 12-4 25-4 38-2 12 2 24 6 36 10Z"/>
	</clipPath>
</svg>
{:else if maskIndex === 3}
<svg width="0" height="0" viewBox="0 0 398.6 435.4">
	<clipPath id="mask3" clipPathUnits="objectBoundingBox" transform="scale(0.002508, 0.002296)">
		<path d="M332 49c33 18 59 49 65 84 6 34-7 71-16 107-8 35-12 69-26 108-13 39-36 82-68 87-31 5-71-28-117-42s-97-7-124-28-29-69-35-116c-6-46-16-92-8-138C11 66 38 21 78 6s91 0 137 10c45 10 85 15 117 33z"/>
	</clipPath>
</svg>
{:else if maskIndex === 4}
<svg width="0" height="0" viewBox="0 0 478.9 448.2">
	<clipPath id="mask4" clipPathUnits="objectBoundingBox" transform="scale(0.002088, 0.002231)">
		<path d="M361 35c23 31 24 83 46 126s67 79 72 114c4 35-32 70-66 105s-67 68-102 68c-35 1-74-32-106-56-33-23-59-37-99-55-41-18-97-39-105-70s31-71 62-104l82-89c29-29 63-60 104-70 40-10 88 0 112 31z"/>
	</clipPath>
</svg>
{:else if maskIndex === 5}
<svg width="0" height="0" viewBox="0 0 390.3 414.4">
	<clipPath id="mask5" clipPathUnits="objectBoundingBox" transform="scale(0.002562, 0.002413)">
		<path d="M277 57c23 26 34 61 54 95 19 34 49 67 57 105s-5 82-35 102c-31 20-80 16-122 24-42 7-77 27-118 31-41 3-87-10-100-42-12-32 9-83 9-127S1 164 0 123C-1 83 18 39 51 18 85-4 132-3 175 6s78 25 102 51z"/>
	</clipPath>
</svg>
{:else if maskIndex === 6}
<svg width="0" height="0" viewBox="0 0 430.8 463.2">
	<clipPath id="mask6" clipPathUnits="objectBoundingBox" transform="scale(0.002326, 0.002158)">
		<path d="M289 71c42 3 98 6 124 31 26 26 22 75-2 109-23 34-66 54-92 92s-35 96-67 128-86 40-131 24-81-56-101-99C-1 313-5 267 6 230c11-38 36-67 45-112C60 74 52 14 73 2c22-11 73 24 111 44 38 19 64 23 105 25z"/>
	</clipPath>
</svg>
{:else if maskIndex === 7}
<svg width="0" height="0" viewBox="0 0 440.8 443.8">
	<clipPath id="mask7" clipPathUnits="objectBoundingBox"
			  transform="scale(0.002268, 0.002253)">
		<path d="M377 21c37 20 65 58 64 98-1 39-31 80-49 114-18 33-24 60-34 102-9 41-21 96-49 107-27 10-69-24-100-52-31-29-52-52-91-73-39-20-98-38-113-69-16-32 11-76 36-118 24-43 46-83 80-104C155 4 200 1 247 0c46-1 92 1 130 21z"/>
	</clipPath>
</svg>
{/if}
