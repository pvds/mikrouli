<script>
import { base } from "$app/paths";
import { IMAGE_SIZES } from "$const";
import placeholders from "$data/generated/placeholders.json";

const IMAGE_DIR = "/images";
const POSITION_CLASSES = "absolute w-full h-full object-center object-cover";

/** @type {{ image: string, alt: string, sizes: string, aspectRatio?: string, priority?:
 * boolean, isCMS?:
 * boolean,
 * classes?:
 * string }}
 * ImageProps */
let {
	image,
	alt,
	sizes = "(max-width: 768px) 100vw, 50vw",
	aspectRatio,
	priority,
	isCMS = false,
	classes,
} = $props();

let loaded = $state(true);
/** @type {HTMLImageElement|undefined} */
let img = $state(undefined);

const directory = $derived(isCMS ? `${IMAGE_DIR}/cms` : `${IMAGE_DIR}/local`);
/** @type {Record<string, string>} */
const cmsPlaceholders = placeholders.cms;
/** @type {Record<string, string>} */
const localPlaceholders = placeholders.local;
/** @type {string} */
const placeholder = $derived(isCMS ? cmsPlaceholders[image] || "" : localPlaceholders[image] || "");

/**
 * @param {number[]} sizes
 * @returns {string}
 */
const srcset = (sizes) =>
	sizes.map((size) => `${base}${directory}/${image}-${size}.webp ${size}w`).join(", ");
</script>


{#if loaded}
<div class="relative"
	 style={`aspect-ratio: ${aspectRatio}`}
>
	<img src={placeholder} {alt} class="{POSITION_CLASSES} {classes}"
		 loading={priority ? "eager" : "lazy"}
		 fetchpriority={priority ? "high" : null}/>
	<div class="{POSITION_CLASSES} backdrop-blur-xl {classes}"></div>
	<picture>
		<source srcset={srcset(IMAGE_SIZES)} sizes={sizes} type="image/webp" />
		<img
			class="{POSITION_CLASSES} transition-opacity opacity-0 duration-300 {classes}"
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
