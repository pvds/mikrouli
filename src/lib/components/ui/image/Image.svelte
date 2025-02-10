<script>
import { base } from "$app/paths";
import { IMAGE_SIZES } from "$config";
import { onMount } from "svelte";

/**
 * @typedef {Object} Props
 * @property {string} image
 * @property {string} alt
 * @property {string} sizes
 * @property {boolean} [priority]
 * @property {string} [classes]
 * @property {string} [heightClass]
 * @property {string} [widthClass]
 * @property {boolean} [isLocal]
 *
 * @typedef {{placeholder: string, width:string, height:string, hasAlpha:boolean}} Metadata
 */

/** @type {Props} */
let {
	image,
	alt,
	sizes,
	priority,
	classes,
	heightClass = "h-full",
	widthClass = "w-full",
	isLocal = false,
} = $props();

const IMAGE_DIR = "/images";
const POSITION_CLASSES = "absolute object-[50%_25%] object-cover";

let loaded = $state(false);
/** @type {HTMLImageElement|undefined} */
let img = $state();
/** @type {Metadata|undefined} */
let meta = $state();

const height = $derived(heightClass ? heightClass : "h-full");
const width = $derived(widthClass ? widthClass : "w-full");
const directory = $derived(`${IMAGE_DIR}/${isLocal ? "local" : "cms"}`);

const placeholder = $derived(meta?.placeholder);
const aspectRatio = $derived(meta ? `${meta.width}/${meta.height}` : "1/1");
const hasAlpha = $derived(meta?.hasAlpha);

const loadMetadata = async () => {
	try {
		const metadata = await import(
			`$data/generated/meta/${isLocal ? "local" : "cms"}/${image}.json`
		);
		meta = metadata.default;
		loaded = true;
	} catch (error) {
		console.error("Failed to load image metadata:", error);
		loaded = false;
	}
};

loadMetadata();
onMount(() => {});

/**
 * Generate a `srcset` string for responsive images
 * @param {number[]} sizes
 * @returns {string}
 */
const srcset = (sizes) =>
	sizes.map((size) => `${base}${directory}/${image}-${size}.webp ${size}w`).join(", ");
</script>
{#if loaded}
<div class="relative {height} {width} not-prose"
	 style={`aspect-ratio: ${aspectRatio};`}
>
	{#if !hasAlpha && placeholder}
	<img src={placeholder} {alt}
		 class="{POSITION_CLASSES} {classes} {height} {width} transition-all"
		 loading={priority ? "eager" : "lazy"}
		 fetchpriority={priority ? "high" : null}/>
	<div class="{POSITION_CLASSES} {classes} backdrop-blur-xl transition-all"></div>
	{/if}
	<picture>
		<source srcset={srcset(IMAGE_SIZES)} sizes={sizes} type="image/webp" />
		<img
			bind:this={img}
			{alt}
			class="{POSITION_CLASSES} {classes} {height} {width} transition-all opacity-0"
			src={`${base}${directory}/${image}-1280.webp`}
			loading={priority ? "eager" : "lazy"}
			fetchpriority={priority ? "high" : null}
			onload={() => img?.classList.remove("opacity-0")}
			onerror={() => loaded = false}
		/>
	</picture>
</div>
{/if}
