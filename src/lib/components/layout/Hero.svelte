<script>
import { SPACING_X_CLASSES } from "$config";
import Image from "$ui/image/Image.svelte";
import WaveCss from "$visuals/WaveCss.svelte";
import Section from "./Section.svelte";

/**
 * @typedef {Object} Props
 * @property {string|undefined} title
 * @property {string|undefined} [proseClasses]
 * @property {import('svelte').Snippet} [children]
 * @property {import('svelte').Snippet} [side]
 * @property {boolean} [sideAbsolute]
 * @property {string} [image]
 * @property {string} [imageAlt]
 * @property {string} [imagePositionClass]
 */

/** @type {Props} */
let { title, proseClasses, children, side, sideAbsolute, image, imageAlt, imagePositionClass } =
	$props();

const spacingY = $derived(() => ({
	padding: image ? "py-20 md:py-30" : "py-16 md:py-24",
	bottom: sideAbsolute
		? image
			? "max-md:-bottom-20 max-md:-mt-5 md:-bottom-30"
			: "max-md:-bottom-16 max-md:-mt-5 md:-bottom-24"
		: "",
}));

const sideClasses = $derived(sideAbsolute ? "md:absolute md:right-0" : "");
</script>

<div class="hero relative mb-12 -mt-8">
	{#if image && imageAlt}
	<div class="absolute inset-0">
		<Image {image} alt={imageAlt} sizes="50vw" priority positionClass={imagePositionClass}/>
	</div>
	<div class="absolute inset-0 bg-[var(--primary-950)]/85"></div>
	{/if}
	<Section classes="{!image && 'bg-primary-light'} overflow-hidden"
			customSpacing="{SPACING_X_CLASSES} {spacingY().padding}"
			innerClasses={sideAbsolute ? 'relative' : 'flex'}>
		<div>
			{#if title}
				<h1 class="text-3xl md:text-4xl mb-6 font-bold" class:text-white={image}>{title}</h1>
			{/if}
			<div class="{side ? 'md:w-8/12 md:pr-4' : ''}">
				<div class="{proseClasses ||
				'prose prose-lg md:prose-xl font-semibold text-balance'}"
					 class:prose-invert={image} style="--container-prose: 65ch">
					{@render children?.()}
				</div>
			</div>
		</div>
		<div class="relative md:w-4/12 {sideClasses} {spacingY().bottom}">
			{@render side?.()}
		</div>
	</Section>
	<WaveCss height={25} inside/>
</div>
