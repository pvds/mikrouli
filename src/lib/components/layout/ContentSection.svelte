<script lang="ts">
import type { Snippet } from "svelte";
import { PROSE_CLASSES_LG, PROSE_CLASSES_MD, PROSE_CLASSES_SM } from "$config";
import { getImageName } from "$lib/helpers/image.js";
import type { SectionSize, SectionTheme } from "$types/content";
import type { ImageField } from "$types/contentful";
import Image from "$ui/image/Image.svelte";
import Section from "./Section.svelte";

interface Props {
	children: Snippet;
	contentFooter?: Snippet;
	header?: Snippet;
	footer?: Snippet;
	image?: ImageField;
	imagePosition?: "start" | "end";
	title?: string;
	index?: number;
	classes?: string;
	theme?: SectionTheme;
	wave?: "odd" | "even";
	size?: SectionSize;
	prose?: boolean;
	proseInvert?: boolean;
	proseClasses?: string;
}

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
}: Props = $props();

const isOdd = (i: number | undefined): i is number =>
	typeof i === "number" && i % 2 === 1;

const hasWave = (i: number | undefined): boolean =>
	wave === "odd" ? isOdd(i) : wave === "even" ? !isOdd(i) : false;

const proseSizeClasses = (size: SectionSize): string =>
	({
		sm: PROSE_CLASSES_SM,
		md: PROSE_CLASSES_MD,
		lg: PROSE_CLASSES_LG,
	})[size] || PROSE_CLASSES_MD;

const proseTheme = $derived(proseInvert ? "prose-invert" : "");
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
		 	{proseTheme} {proseSizeClasses(size)} {proseClasses}"
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
	{const imageName = getImageName(image?.file.fileName)}
	{#if imageName}
		<div class="flex-auto max-md-mid:hidden self-center justify-self-center">
			<Image image={imageName}
			   sizes="20rem"
			   alt={image?.title ?? ""}
			   widthClass="w-full max-w-[calc(45vw)]"
			   heightClass="h-full max-h-[75vh]"
			   maskIndex={index !== undefined ? index + 2 : undefined}
			   classes="translate-z-0" />
		</div>
		{/if}
{/snippet}
