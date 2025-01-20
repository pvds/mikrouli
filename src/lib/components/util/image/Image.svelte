<script>
import { base } from "$app/paths";
import { IMAGE_SIZES } from "$const";

/** @type {{ image: string, alt: string, sizes: string, aspectRatio?: string, eager?:
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
	eager,
	isCMS = false,
	classes,
} = $props();

let loaded = $state(true);

const IMAGE_DIR = "/images/processed";
const directory = $derived(isCMS ? `${IMAGE_DIR}/cms` : `${IMAGE_DIR}/static`);

/**
 * @param {number[]} sizes
 * @returns {string}
 */
const srcset = (sizes) =>
	sizes.map((size) => `${base}${directory}/${image}-${size}.webp ${size}w`).join(", ");
</script>

{#if loaded}
<picture>
	<source srcset={srcset(IMAGE_SIZES)} sizes={sizes} type="image/webp" />
	<img
		style={aspectRatio && `aspect-ratio: ${aspectRatio};`}
		class={classes}
		src={`${base}${directory}/${image}-1920.webp`}
		alt={alt}
		loading={eager ? "eager" : "lazy"}
		fetchpriority={eager ? "high" : null}
		onerror={() => loaded = false}
	/>
</picture>
{/if}
