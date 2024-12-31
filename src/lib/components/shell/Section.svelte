<script>
/**
 * @typedef {Object} Props
 * @property {string} [classes]
 * @property {import('$lib/components/shell/Wave.svelte.type.js').Wave} [wave]
 * @property {import('svelte').Snippet} [children]
 */

import Wave from "./Wave.svelte";

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
