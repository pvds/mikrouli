<script>
/**
 * @typedef {Object} Props
 * @property {string} title
 * @property {import('svelte').Snippet} [children]
 */

import Section from "./Section.svelte";

/** @type {Props} */
let { title, children } = $props();
</script>

<div class="hero relative mb-20">
	<div
		class="absolute w-full min-w-5xl top-[calc(100%-72px)] right-0 overflow-hidden pointer-events-none">
		<svg class="w-[inherit] h-40"
			 xmlns="http://www.w3.org/2000/svg"
			 viewBox="0 0 1440 390" preserveAspectRatio="none">
			<path class="hidden fill-primary-200"
				  d="M1440 0v250c-125-12-250-24-368-39s-230-32-343-17-226 61-348 76-251-3-381-20V0h1440Z"/>
			<path class="fill-primary-200" d="M1440 0v250c-97-23-193-47-302-34s-229 62-353 73-251-15-382-28-267-12-403-11V0h1440Z"/>
		</svg>
	</div>

	<Section
		classes="relative -my-8 px-10 pt-20 pb-4 z-1 bg-primary-200 text-primary-800">
		<h1 class="text-4xl mb-4 font-bold">{title}</h1>
		<div class="prose-xl font-semibold">
			{@render children?.()}
		</div>
	</Section>
</div>
