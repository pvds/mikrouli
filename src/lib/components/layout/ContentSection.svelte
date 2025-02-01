<script>
import Section from "./Section.svelte";

/**
 * @typedef {import('svelte').Snippet} Snippet
 * @typedef {Object} Props
 * @property {Snippet} [header]
 * @property {Snippet} [footer]
 * @property {Snippet} children
 * @property {number} [index]
 * @property {'odd'|'even'} [wave='odd']
 */

/** @type {Props} */
let { header, footer, children, index, wave = "odd" } = $props();

/** @param {number|undefined} i */
const hasWave = (i) => {
	if (!i && i !== 0) return false;
	return (wave === "odd" && i % 2 === 1) || (wave === "even" && i % 2 === 0);
};
</script>

<Section wave={hasWave(index)}>
	{@render header?.()}
	<div class="prose prose-lg marker:text-accent-dark prose-strong:text-accent-dark
			prose-strong:font-bold prose-headings:text-3xl prose-headings:font-bold">
		{@render children?.()}
	</div>
	{@render footer?.()}
</Section>
