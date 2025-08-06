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
 * @property {Snippet} children
 * @property {Snippet} [contentFooter]
 * @property {Snippet} [header]
 * @property {Snippet} [footer]
 * @property {Image} [image]
 * @property {'start'|'end'} [imagePosition]
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
	contentFooter,
	index,
	image,
	imagePosition,
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
const isOdd = (i) => typeof i === "number" && i % 2 === 1;

/** @param {number|undefined} i */
const hasWave = (i) =>
	wave === "odd" ? isOdd(i) : wave === "even" ? !isOdd(i) : false;

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
		{#if imagePosition === 'start' || !imagePosition && isOdd(index)}
			{@render imageSection()}
		{/if}
		<div class="flex-1 content-center">
			{#if title}
			<h2 class="mb-[1.25em] text-2xl md:text-3xl font-bold">{title}</h2>
			{/if}
			<div class="{prose ? 'prose marker:text-accent-dark prose-headings:font-bold' : ''}
		 	{proseThemeClasses} {proseSizeClasses(size)} {proseClasses}"
				 style={!image ? "--container-prose: 65ch" : ""}>
				{@render children?.()}
			</div>
			{@render contentFooter?.()}
		</div>
		{#if imagePosition === 'end' || !imagePosition && !isOdd(index)}
		{@render imageSection()}
		{/if}
	</div>
	{@render footer?.()}
</Section>

{#snippet imageSection()}
	{#if image}
	<div class="flex-auto max-md-mid:hidden self-center justify-self-center">
		<Image image={getImageName(image.file.fileName)}
			   sizes="20rem"
			   alt={image.title}
			   widthClass="w-full max-w-[calc(45vw)]"
			   heightClass="h-full max-h-[75vh]"
			   maskIndex={index !== undefined ? index + 2 : undefined}
			   classes="translate-z-0" />
	</div>
	{/if}
{/snippet}
