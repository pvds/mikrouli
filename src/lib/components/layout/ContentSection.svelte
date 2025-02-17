<script>
import { PROSE_CLASSES_LG, PROSE_CLASSES_MD, PROSE_CLASSES_SM } from "$config";
import { getImageName } from "$lib/helpers/image.js";
import Image from "$ui/image/Image.svelte";
import Section from "./Section.svelte";

/**
 * @typedef {import('svelte').Snippet} Snippet
 * @typedef {import('$types/contentful').ImageField} Image
 * @typedef {import('$types/content').SectionTheme} SectionTheme
 * @typedef {import('$types/content').SectionSize} SectionSize
 * @typedef {Object} Props
 * @property {Snippet} [header]
 * @property {Snippet} [footer]
 * @property {Snippet} children
 * @property {Image} [image]
 * @property {string} [title]
 * @property {number} [index]
 * @property {string} [classes=""]
 * @property {SectionTheme} [theme='default']
 * @property {'odd'|'even'} [wave='odd']
 * @property {SectionSize} [size='md']
 * @property {boolean} [prose=false]
 * @property {boolean} [proseInvert=false]
 * @property {string} [proseClasses]
 */

/** @type {Props} */
let {
	header,
	footer,
	children,
	index,
	image,
	title,
	classes = "",
	theme = "default",
	wave = "odd",
	prose = false,
	proseInvert = false,
	proseClasses,
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

const proseThemeClasses = proseInvert ? "prose-invert" : "";
</script>

<Section wave={hasWave(index)} {size} {classes} {theme}>
	{@render header?.()}
	<div class="flex gap-16">
		<div class="flex-1 {prose ? 'prose marker:text-accent-dark prose-headings:font-bold' : ''}
		 	{proseThemeClasses} {proseSizeClasses(size)} {proseClasses}">
			{#if title}
			<h2 class="mb-[1.25em] text-2xl md:text-3xl font-bold not-prose">{title}</h2>
			{/if}
			{@render children?.()}
		</div>
		<div class="flex-auto max-md-mid:hidden self-center justify-self-center">
			{#if image}
				<Image image={getImageName(image.file.fileName)}
					   sizes="20rem"
					   alt={image.title}
					   widthClass="w-full max-w-[50vw]"
					   heightClass="h-full"
					   maskIndex={index !== undefined ? index + 2 : undefined}
					   classes="translate-z-0" />
			{/if}
		</div>
	</div>
	{@render footer?.()}
</Section>
