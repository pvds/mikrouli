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

<Section classes="p-8 bg-accent-300 text-accent-950">
	<h1 class="text-4xl mb-4 font-extrabold">{title}</h1>
	<div class="prose-lg italic">
		{@render children?.()}
	</div>
</Section>
