<script>
import { base } from "$app/paths";
import { onDestroy, onMount } from "svelte";

/** @typedef {{ image: string, alt: string, sizes: string, directory: string }} ImageProps */
let {
	image,
	alt,
	sizes = "(max-width: 768px) 100vw, 50vw",
	directory = "/images/processed/static",
} = $props();

/** @type {HTMLImageElement} */
let imgRef;
/** @type {IntersectionObserver} */
let observer;

/**
 * @param {number[]} sizes
 * @returns {string}
 */
const srcset = (sizes) =>
	sizes.map((size) => `${base}${directory}/${image}-${size}.webp ${size}w`).join(", ");

onMount(() => {
	if (imgRef.getBoundingClientRect().top < window.innerHeight) {
		// imgRef.src = `${base}${directory}/${image}-1920.webp`;
	} else {
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

<picture>
	<source srcset={srcset([640, 1280, 1920])} sizes={sizes} type="image/webp" />
	<img
		bind:this={imgRef}
		src={`${base}${directory}/${image}-1920.webp`}
		alt={alt}
		loading="lazy"
	/>
</picture>
