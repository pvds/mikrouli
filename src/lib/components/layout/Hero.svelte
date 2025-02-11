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

let defaultProseClasses = $derived(() =>
	image
		? "prose prose-invert prose-xl md:prose-2xl font-semibold text-balance"
		: "prose prose-xl font-semibold text-balance",
);
</script>

{#if image && imageAlt}
	<!-- HeroImage layout -->
	<div class="hero relative mb-12 -mt-8">
		<div class="absolute inset-0">
			<Image {image} alt={imageAlt} sizes="50vw" priority positionClass={imagePositionClass}/>
		</div>
		<div class="absolute inset-0 bg-[var(--primary-950)]/85"></div>
		<Section classes="z-1" customSpacing="-my-8 {SPACING_X_CLASSES} py-20 md:py-32">
			{#if title}
				<h1 class="text-4xl mb-4 md:mb-6 font-bold text-white">{title}</h1>
			{/if}
			<div class="{proseClasses || defaultProseClasses()}" style="--container-prose: 50ch;">
				{@render children?.()}
			</div>
		</Section>
		<WaveCss height={20} inside color="bg-white"/>
	</div>
{:else}
	<!-- Default Hero layout -->
	<div class="hero relative mb-24">
		<div class="absolute w-full min-w-6xl top-[calc(100%-72px)] left-0 overflow-hidden pointer-events-none">
			<svg class="w-[inherit] h-40"
				 xmlns="http://www.w3.org/2000/svg"
				 viewBox="0 0 1440 390" preserveAspectRatio="none">
				<path class="hidden fill-primary-light"
					  d="M1440 0v250c-125-12-250-24-368-39s-230-32-343-17-226 61-348 76-251-3-381-20V0h1440Z"/>
				<path class="fill-primary-light" d="M1440 0v250c-97-23-193-47-302-34s-229 62-353 73-251-15-382-28-267-12-403-11V0h1440Z"/>
			</svg>
		</div>
		<Section classes="relative z-1 bg-primary-light" customSpacing="-my-8 {SPACING_X_CLASSES} pt-16 md:pt-20 pb-4 md:pb-6">
			{#if title}
				<h1 class="text-4xl mb-4 font-bold">{title}</h1>
			{/if}
			<div class="{proseClasses || defaultProseClasses()}" style="--container-prose: 65ch;">
				{@render children?.()}
			</div>
		</Section>
	</div>
{/if}
