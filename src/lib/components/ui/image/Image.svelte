<script>
import { base } from "$app/paths";
import { IMAGE_SIZES } from "$config";
import metadata from "$data/generated/metadata.json";

/**
 * @typedef {Object} Props
 * @property {string} image
 * @property {string} alt
 * @property {string} sizes
 * @property {boolean} [priority]
 * @property {string} [classes]
 * @property {string} [heightClass]
 * @property {string} [widthClass]
 * @property {boolean} [isCMS]
 *
 * @typedef {Record<string, {placeholder: string, width:string, height:string, hasAlpha:boolean}>} Metadata
 */

/** @type {Props} */
let {
	image,
	alt,
	sizes = "(max-width: 768px) 100vw, 50vw",
	priority,
	classes,
	heightClass = "h-full",
	widthClass = "w-full",
	isCMS = false,
} = $props();

const IMAGE_DIR = "/images";
const POSITION_CLASSES = "absolute object-center object-cover";

let loaded = $state(true);
/** @type {HTMLImageElement|undefined} */
let img = $state(undefined);

const height = $derived(heightClass ? heightClass : "h-full");
const width = $derived(widthClass ? widthClass : "w-full");
const directory = $derived(`${IMAGE_DIR}/${isCMS ? "cms" : "local"}`);
const metaCategory = $derived(/** @type Metadata */ (isCMS ? metadata.cms : metadata.local));
const meta = $derived(metaCategory[image]);
const placeholder = $derived(meta?.placeholder);
const aspectRatio = $derived(`${meta.width}/${meta.height}`);
const hasAlpha = $derived(meta?.hasAlpha);

/**
 * Generate a `srcset` string for responsive images
 * @param {number[]} sizes
 * @returns {string}
 */
const srcset = (sizes) =>
	sizes.map((size) => `${base}${directory}/${image}-${size}.webp ${size}w`).join(", ");
</script>

{#if loaded}
<div class="relative {height} {width}"
	 style={`aspect-ratio: ${aspectRatio};`}
>
	{#if !hasAlpha && placeholder}
	<img src={placeholder} {alt}
		 class="{POSITION_CLASSES} {classes} {height} {width}"
		 loading={priority ? "eager" : "lazy"}
		 fetchpriority={priority ? "high" : null}/>
	<div class="{POSITION_CLASSES} backdrop-blur-xl {classes}"></div>
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
