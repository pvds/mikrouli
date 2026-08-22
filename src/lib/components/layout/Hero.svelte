<script lang="ts">
import type { Snippet } from "svelte";
import { SPACING_X_CLASSES } from "$config";
import Image from "$ui/image/Image.svelte";
import WaveCss from "$visuals/WaveCss.svelte";
import Section from "./Section.svelte";

interface Props {
	title: string | undefined;
	proseClasses?: string;
	children?: Snippet;
	contentFooter?: Snippet;
	side?: Snippet;
	sideAbsolute?: boolean;
	image?: string;
	imageAlt?: string;
	imagePositionClass?: string;
}

let {
	title,
	proseClasses,
	children,
	contentFooter,
	side,
	sideAbsolute,
	image,
	imageAlt,
	imagePositionClass,
}: Props = $props();

const spacingY = $derived({
	padding: image
		? "pt-14 pb-18 sm:pt-20 sm:pb-24 md:pt-30 md:pb-34"
		: "py-10 sm:py-16 md:py-24",
	bottom: sideAbsolute
		? image
			? "-bottom-18 sm:-bottom-24 md:-bottom-34 max-sm:-mt-8 sm:-mt-6"
			: "-bottom-10 sm:-bottom-16 md:-bottom-24 max-sm:-mt-8 sm:-mt-6"
		: "",
});

const sideClasses = $derived(sideAbsolute ? "md:absolute md:right-0" : "");
</script>

<div class="hero relative mb-12 -mt-8">
	{#if image && imageAlt}
	<div class="absolute inset-0">
		<Image {image} alt={imageAlt} sizes="50vw" priority positionClass={imagePositionClass}/>
	</div>
	<div class="absolute inset-0 bg-primary-black/75"></div>
	{/if}
	<Section classes={["overflow-hidden", !image && "bg-primary-light"]}
			customSpacing={[SPACING_X_CLASSES, spacingY.padding]}
			innerClasses={sideAbsolute ? "relative" : "flex"}>
		<div>
			{#if title}
			<h1 class={[
				"text-3xl md:text-4xl mb-6 font-bold",
				image && "[text-shadow:2px_2px_4px_rgba(14,38,39,1)]",
				image && "text-white",
			]}>{title}</h1>
			{/if}
			<div class={[side && "md:w-8/12 md:pr-4"]}>
				<div
					class={[
						proseClasses || "prose sm:prose-lg md:prose-xl font-semibold text-balance",
						image && "prose-invert prose-p:[text-shadow:2px_2px_0px_rgba(14,38,39,1)]",
					]} style="--container-prose: 65ch">
					{@render children?.()}
				</div>
				{#if contentFooter}
				<div class="mt-4 md:mt-6 lg:mt-8 -mb-2 md:-mb-4 lg:-mb-6">
				{@render contentFooter()}
				</div>
				{/if}
			</div>
		</div>
		{#if side}
		<div class={["relative md:w-4/12", sideClasses, spacingY.bottom, { "content-center": !sideAbsolute }]}>
			{@render side?.()}
		</div>
		{/if}
	</Section>
	<WaveCss height={25} inside/>
</div>
