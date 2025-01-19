<script>
import { onDestroy, onMount } from "svelte";

let {
	image,
	alt = "",
	sizes = "(max-width: 768px) 100vw, 50vw",
	directory = "/images/processed",
} = $props();

/** @type {HTMLImageElement} */
let imgRef;

/**
 * @param {number[]} sizes
 * @returns {string}
 */
const srcset = (sizes) =>
	sizes.map((size) => `${directory}/${image}-${size}.webp ${size}w`).join(", ");

const observer = new IntersectionObserver(
	(entries) => {
		for (const entry of entries) {
			if (entry.isIntersecting) {
				imgRef.src = `${directory}/${image}-1920.webp`;
				observer.unobserve(imgRef);
			}
		}
	},
	{ rootMargin: "300px" },
);

onMount(() => observer.observe(imgRef));
onDestroy(() => observer.unobserve(imgRef));
</script>

<picture>
	<source srcset={srcset([640, 1280, 1920])} sizes={sizes} type="image/webp" />
	<img
		bind:this={imgRef}
		src={`${directory}/${image}-1920.webp`}
		alt={alt}
		loading="lazy"
	/>
</picture>
