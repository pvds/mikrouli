<script>
import { base } from "$app/paths";
import { IMAGE_SIZES } from "$config";
import placeholders from "$data/generated/placeholders.json";

/**
 * @typedef {Object} Props
 * @property {string} image
 * @property {string} alt
 * @property {string} sizes
 * @property {string} [aspectRatio]
 * @property {string} [heightClass]
 * @property {string} [widthClass]
 * @property {boolean} [priority]
 * @property {boolean} [isCMS]
 * @property {boolean} [usePlaceholder=true]
 * @property {string} [classes]
 */

/** @type {Props} */
let {
	image,
	alt,
	sizes = "(max-width: 768px) 100vw, 50vw",
	aspectRatio,
	heightClass,
	widthClass,
	priority,
	isCMS = false,
	usePlaceholder = true,
	classes,
} = $props();

let loaded = $state(true);
/** @type {HTMLImageElement|undefined} */
let img = $state(undefined);

const IMAGE_DIR = "/images";
const POSITION_CLASSES = "absolute object-center object-cover";
const height = $derived(heightClass ? heightClass : "h-full");
const width = $derived(widthClass ? widthClass : "w-full");
const directory = $derived(isCMS ? `${IMAGE_DIR}/cms` : `${IMAGE_DIR}/local`);
/** @type {Record<string, string>} */
const cmsPlaceholders = placeholders.cms;
/** @type {Record<string, string>} */
const localPlaceholders = placeholders.local;
/** @type {string|undefined} */
const placeholder = $derived(isCMS ? cmsPlaceholders[image] : localPlaceholders[image]);

/**
 * @param {number[]} sizes
 * @returns {string}
 */
const srcset = (sizes) =>
	sizes.map((size) => `${base}${directory}/${image}-${size}.webp ${size}w`).join(", ");
</script>


{#if loaded}
<div class="relative {height} {width}"
	 style={aspectRatio && `aspect-ratio: ${aspectRatio}`}
>
	{#if usePlaceholder && placeholder}
	<img src={placeholder} {alt}
		 class="{POSITION_CLASSES} {classes} {height} {width}"
		 loading={priority ? "eager" : "lazy"}
		 fetchpriority={priority ? "high" : null}/>
	<div class="{POSITION_CLASSES} backdrop-blur-xl {classes}"></div>
	{/if}
	<picture>
		<source srcset={srcset(IMAGE_SIZES)} sizes={sizes} type="image/webp" />
		<img
			class="{POSITION_CLASSES} {classes} {height} {width} transition-all opacity-0"
			src={`${base}${directory}/${image}-1280.webp`}
			{alt}
			bind:this={img}
			loading={priority ? "eager" : "lazy"}
			fetchpriority={priority ? "high" : null}
			onload={() => img?.classList.remove("opacity-0")}
			onerror={() => loaded = false}
		/>
	</picture>
</div>
{/if}
