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
		class="absolute w-full min-w-5xl top-[calc(100%-92px)] right-0 overflow-hidden pointer-events-none">
		<svg class="w-[inherit] h-50"
			 xmlns="http://www.w3.org/2000/svg"
			 viewBox="0 0 1440 690" preserveAspectRatio="none">
			<path class="fill-primary-200"
				  d="M1440 0v394c-45-6-89-12-142 8s-113 67-175 51-126-94-177-111-89 28-141 37-118-18-175-31-106-13-149 8-82 64-133 66-115-38-175-50-117 5-173 22V0h1440Z"/>
		</svg>
	</div>

	<Section
		classes="relative -my-8 px-8 pt-20 pb-10 z-1 bg-primary-200 text-primary-800">
		<h1 class="text-4xl mb-4 font-bold">{title}</h1>
		<div class="prose-xl font-semibold">
			{@render children?.()}
		</div>
	</Section>
</div>
