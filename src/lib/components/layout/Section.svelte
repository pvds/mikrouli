<script>
/**
 * @typedef {Object} Props
 * @property {string} [classes]
 * @property {import('../visuals/WaveSvg.type').WaveProps} [wave]
 * @property {import('svelte').Snippet} [children]
 */

import WaveSvg from "../visuals/WaveSvg.svelte";

/** @type {Props} */
let { classes, wave, children } = $props();
</script>

<section class="{classes} relative">
	<div class="max-w-5xl mx-auto">
		{#if wave}
			<WaveSvg {...wave}>
				{@render children?.()}
			</WaveSvg>
	    {:else}
			{@render children?.()}
		{/if}
	</div>
</section>
