<script>
/**
 * @typedef {Object} Props
 * @property {string} [classes]
 * @property {import('$lib/components/visuals/Wave.svelte.type').Wave} [wave]
 * @property {import('svelte').Snippet} [children]
 */

import Wave from "../visuals/Wave.svelte";

/** @type {Props} */
let { classes, wave, children } = $props();
</script>

<section class="{classes} relative">
	<div class="max-w-5xl mx-auto">
		{#if wave}
			<Wave {...wave}>
				{@render children?.()}
			</Wave>
	    {:else}
			{@render children?.()}
		{/if}
	</div>
</section>
