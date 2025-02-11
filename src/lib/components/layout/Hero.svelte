<script>
import { SPACING_X_CLASSES } from "$config";
import Image from "$ui/image/Image.svelte";
import WaveCss from "$visuals/WaveCss.svelte";
import Section from "./Section.svelte";

/**
 * @typedef {Object} Props
 * @property {string|undefined} title
 * @property {string|undefined} [proseClasses]
 * @property {import('svelte').Snippet} [children]
 * @property {string} [image]
 * @property {string} [imageAlt]
 * @property {string} [imagePositionClass]
 */

/** @type {Props} */
let { title, proseClasses, children, image, imageAlt, imagePositionClass } = $props();
</script>

<div class="hero relative mb-12 -mt-8">
	{#if image && imageAlt}
	<div class="absolute inset-0">
		<Image {image} alt={imageAlt} sizes="50vw" priority positionClass={imagePositionClass}/>
	</div>
	<div class="absolute inset-0 bg-[var(--primary-950)]/85"></div>
	{/if}
	<Section classes="relative {!image && 'bg-primary-light'}"
			 customSpacing="{SPACING_X_CLASSES} {image ? 'py-20 md:py-30' : 'py-16 md:py-24'}">
		{#if title}
			<h1 class="text-4xl mb-6 font-bold" class:text-white={image}>{title}</h1>
		{/if}
		<div class="{proseClasses || 'prose prose-xl font-semibold text-balance'}"
			 class:prose-invert={image} style="--container-prose: {image ? '50ch' : '65ch'}">
			{@render children?.()}
		</div>
	</Section>
	<WaveCss height={25} inside/>
</div>
