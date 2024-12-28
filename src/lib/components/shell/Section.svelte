<script>
/**
 * @typedef {Object} Props
 * @property {string} [classes]
 * @property {import('svelte').Snippet} [children]
 */

/** @type {Props} */
let { classes, children } = $props();
</script>

<section class="{classes}">
	<div class="max-w-5xl mx-auto">
		{@render children?.()}
	</div>
</section>
