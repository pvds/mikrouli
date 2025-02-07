<script>
import { PROSE_CLASSES_LG, PROSE_CLASSES_MD, PROSE_CLASSES_SM } from "$config";
import Section from "./Section.svelte";

/**
 * @typedef {import('svelte').Snippet} Snippet
 * @typedef {Object} Props
 * @property {Snippet} [header]
 * @property {Snippet} [footer]
 * @property {Snippet} children
 * @property {number} [index]
 * @property {string} [classes=""]
 * @property {'odd'|'even'} [wave='odd']
 * @property {'sm'|'md'|'lg'} [size='md']
 * @property {boolean} [prose=false]
 */

/** @type {Props} */
let {
	header,
	footer,
	children,
	index,
	classes = "",
	wave = "odd",
	prose = false,
	size = "md",
} = $props();

/** @param {number|undefined} i */
const hasWave = (i) => {
	if (!i && i !== 0) return false;
	return (wave === "odd" && i % 2 === 1) || (wave === "even" && i % 2 === 0);
};

/** @param {'sm'|'md'|'lg'} size */
const proseSizeClasses = (size) =>
	({
		sm: PROSE_CLASSES_SM,
		md: PROSE_CLASSES_MD,
		lg: PROSE_CLASSES_LG,
	})[size] || PROSE_CLASSES_MD;
</script>

<Section wave={hasWave(index)} {size} {classes}>
	{@render header?.()}
	<div class="{prose ?
	'prose marker:text-accent-dark prose-strong:text-accent-dark prose-strong:font-bold prose-headings:font-bold' : ''} {proseSizeClasses(size)}">
		{@render children?.()}
	</div>
	{@render footer?.()}
</Section>
