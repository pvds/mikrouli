<script>
import { SPACING_X_CLASSES } from "$config";
import Section from "./Section.svelte";

/**
 * @typedef {Object} Props
 * @property {string|undefined} title
 * @property {string} [transitionName]
 * @property {string|undefined} [proseClasses="prose prose-xl font-semibold"]
 * @property {import('svelte').Snippet} [children]
 */

/** @type {Props} */
let {
	title,
	transitionName,
	proseClasses = "prose prose-xl md:prose-2xl font-semibold text-balance",
	children,
} = $props();
</script>

<div class="hero relative mb-24">
	<div
		class="absolute w-full min-w-6xl top-[calc(100%-72px)] left-0 overflow-hidden pointer-events-none">
		<svg class="w-[inherit] h-40"
			 xmlns="http://www.w3.org/2000/svg"
			 viewBox="0 0 1440 390" preserveAspectRatio="none">
			<path class="hidden fill-primary-light"
				  d="M1440 0v250c-125-12-250-24-368-39s-230-32-343-17-226 61-348 76-251-3-381-20V0h1440Z"/>
			<path class="fill-primary-light" d="M1440 0v250c-97-23-193-47-302-34s-229 62-353 73-251-15-382-28-267-12-403-11V0h1440Z"/>
		</svg>
	</div>

	<Section
		classes="relative z-1 bg-primary-light"
		customSpacing="-my-8 {SPACING_X_CLASSES} pt-16 md:pt-24 pb-4 md:pb-6">
		<div style={transitionName && `view-transition-name:${transitionName}`}></div>
		{#if title}
			<h1 class="text-4xl mb-4 font-bold">{title}</h1>
		{/if}
		<div class="{proseClasses}" style="--container-prose: 65ch;">
			{@render children?.()}
		</div>
	</Section>
</div>
