<script>
import { SPACING_X_CLASSES } from "$config";
import Image from "$ui/image/Image.svelte";
import WaveCss from "$visuals/WaveCss.svelte";
import Section from "./Section.svelte";

/**
 * @typedef {Object} Props
 * @property {string|undefined} title
 * @property {string} image
 * @property {string} imageAlt
 * @property {string} [transitionName]
 * @property {string|undefined} [proseClasses="prose prose-xl font-semibold"]
 * @property {import('svelte').Snippet} [children]
 */

/** @type {Props} */
let {
	title,
	image,
	imageAlt,
	transitionName,
	proseClasses = "prose prose-invert prose-xl md:prose-2xl font-semibold text-balance",
	children,
} = $props();
</script>

<div class="hero relative mb-12 -mt-8">
	<div class="absolute inset-0">
		<Image {image} alt={imageAlt} sizes="50vw" priority></Image>
	</div>
	<div class="absolute inset-0 bg-[var(--primary-950)]/85"></div>
	<Section
		classes="z-1"
		customSpacing="-my-8 {SPACING_X_CLASSES} py-20 md:py-32">
		<div style={transitionName && `view-transition-name:${transitionName}`}></div>
		{#if title}
			<h1 class="text-4xl mb-4 md:mb-6 font-bold text-white">{title}</h1>
		{/if}
		<div class="{proseClasses}" style="--container-prose: 50ch;">
			{@render children?.()}
		</div>
	</Section>
	<WaveCss height={20} inside color="bg-white"/>
</div>
