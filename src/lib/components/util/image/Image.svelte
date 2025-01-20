<script>
import { base } from "$app/paths";
import { IMAGE_SIZES } from "$const";
import { onDestroy, onMount } from "svelte";

/** @type {{ image: string, alt: string, sizes: string, aspectRatio?: string, isCMS?: boolean,
 * classes?:
 * string }}
 * ImageProps */
let {
	image,
	alt,
	sizes = "(max-width: 768px) 100vw, 50vw",
	aspectRatio,
	isCMS = false,
	classes,
} = $props();

/** @type {HTMLImageElement} */
let imgRef;
/** @type {IntersectionObserver} */
let observer;
let loaded = $state(true);

const IMAGE_DIR = "/images/processed";
const directory = $derived(isCMS ? `${IMAGE_DIR}/cms` : `${IMAGE_DIR}/static`);

/**
 * @param {number[]} sizes
 * @returns {string}
 */
const srcset = (sizes) =>
	sizes.map((size) => `${base}${directory}/${image}-${size}.webp ${size}w`).join(", ");

onMount(() => {
	if (!(imgRef.getBoundingClientRect().top < window.innerHeight)) {
		observer = new IntersectionObserver(
			(entry) => {
				if (entry[0].isIntersecting) {
					imgRef.src = `${base}${directory}/${image}-1920.webp`;
					observer.unobserve(imgRef);
				}
			},
			{ rootMargin: "300px" },
		);
		observer.observe(imgRef);
	}
});
onDestroy(() => observer?.unobserve(imgRef));
</script>

{#if loaded}
<picture>
	<source srcset={srcset(IMAGE_SIZES)} sizes={sizes} type="image/webp" />
	<img
		style={aspectRatio && `aspect-ratio: ${aspectRatio};`}
		class={classes}
		bind:this={imgRef}
		src={`${base}${directory}/${image}-1920.webp`}
		alt={alt}
		loading="lazy"
		onerror={() => loaded = false}
	/>
</picture>
{/if}
