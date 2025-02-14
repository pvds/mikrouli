<script>
import { base } from "$app/paths";
import { IMAGE_SIZES } from "$config";
import metadata from "$data/generated/meta/images.json";

/**
 * @typedef {import('$types/content').ImageMeta} ImageMeta
 * @typedef {Record<string, ImageMeta>} Metadata
 * @typedef {Object} Props
 * @property {string} image
 * @property {string} alt
 * @property {string} sizes
 * @property {boolean} [priority]
 * @property {string} [classes]
 * @property {string} [heightClass]
 * @property {string} [widthClass]
 * @property {string} [positionClass]
 * @property {boolean} [isLocal]
 */

/** @type {Props} */
let {
	image,
	alt,
	sizes,
	priority,
	classes,
	isLocal = false,
	heightClass = "h-full",
	widthClass = "w-full",
	positionClass = "object-center",
} = $props();

const IMAGE_DIR = "/images";
const POSITION_CLASSES = "absolute object-cover";

const usePlaceholder = false;

let loadedData = $state(true);
let loadedImage = $state(false);
/** @type {HTMLImageElement|undefined} */
let img = $state();
// /** @type {ImageMeta|undefined} */
// let meta = $state();

const metaCategory = $derived(/** @type Metadata */ (isLocal ? metadata.local : metadata.cms));
const meta = $derived(metaCategory[image]);

const height = $derived(heightClass ? heightClass : "h-full");
const width = $derived(widthClass ? widthClass : "w-full");
const directory = $derived(`${IMAGE_DIR}/${isLocal ? "local" : "cms"}`);

const placeholder = $derived(meta?.placeholder);
const aspectRatio = $derived(meta ? `${meta.width}/${meta.height}` : "1/1");
const hasAlpha = $derived(meta?.hasAlpha);

// const loadMetadata = async () => {
// 	try {
// 		const metadata = await import(
// 			`$data/generated/meta/${isLocal ? "local" : "cms"}/${image}.json`
// 		);
// 		meta = metadata.default;
// 		loadedData = true;
// 	} catch (error) {
// 		console.error("Failed to load image metadata:", error);
// 		loadedData = false;
// 	}
// };

// onMount(() => {
// 	loadMetadata();
// });

const onload = () => {
	img?.classList.remove("opacity-0");
	loadedImage = true;
};

/**
 * Generate a `srcset` string for responsive images
 * @param {number[]} sizes
 * @returns {string}
 */
const srcset = (sizes) =>
	sizes.map((size) => `${base}${directory}/${image}-${size}.webp ${size}w`).join(", ");
</script>
<div class="relative {height} {width} not-prose {loadedImage || hasAlpha ? '' :
'bg-black/10 animate-pulse rounded-md'}" style={`aspect-ratio: ${aspectRatio};`}
>
{#if loadedData}
	{#if usePlaceholder && placeholder && !hasAlpha && !loadedImage}
	<img src={placeholder} {alt}
		 class="{POSITION_CLASSES} {positionClass} {classes} {height} {width} transition-all"
		 loading={priority ? "eager" : "lazy"}
		 fetchpriority={priority ? "high" : null}/>
	<div class="{POSITION_CLASSES} {positionClass} {classes} backdrop-blur-xl transition-all"></div>
	{/if}
	<picture>
		<source srcset={srcset(IMAGE_SIZES)} sizes={sizes} type="image/webp" />
		<img
			bind:this={img}
			{alt}
			class="{POSITION_CLASSES} {positionClass} {classes} {height} {width} transition-all opacity-0"
			src={`${base}${directory}/${image}-1280.webp`}
			loading={priority ? "eager" : "lazy"}
			fetchpriority={priority ? "high" : null}
			{onload}
			onerror={() => loadedImage = false}
		/>
	</picture>
{/if}
</div>
