<script>
/**
 * @typedef {Object} Props
 * @property {string} [classes]
 * @property {import('$lib/components/visuals/WaveSvg.type').WaveProps} [wave]
 * @property {import('svelte').Snippet} [children]
 */

import WaveSvg from "$lib/components/visuals/WaveSvg.svelte";

/** @type {Props} */
let { classes, wave, children } = $props();
</script>

<section class="{classes ?? 'px-8 py-14'} relative">
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
