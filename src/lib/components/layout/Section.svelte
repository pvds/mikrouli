<script>
/**
 * @typedef {import('$types/content').SectionTheme} SectionTheme
 * @typedef {Object} Props
 * @property {string} [classes] on outer <section>, use styling the section (position, z-index, etc.)
 * @property {string} [innerClasses] on inner <div>, use for styling the content (grid, flex, etc.)
 * @property {string} [title]
 * @property {'sm'|'md'|'lg'} [size='md']
 * @property {SectionTheme} [theme='default']
 * @property {string} [customSpacing]
 * @property {boolean} [wave]
 * @property {import('svelte').Snippet} [children]
 */

import { SPACING_X_CLASSES } from "$config";
import WaveSvg from "$visuals/WaveSvg.svelte";

/** @type {Props} */
let {
	classes,
	innerClasses,
	title,
	size = "md",
	theme = "default",
	customSpacing,
	wave,
	children,
} = $props();

const spacingY = {
	sm: {
		default: "md-mid:py-6",
		wave: "md-mid:py-2 my-14",
		title: "mb-4 md-mid:mb-6",
	},
	md: {
		default: "py-2 md-mid:py-10",
		wave: "md-mid:py-6 my-18",
		title: "mb-6 md-mid:mb-8",
	},
	lg: {
		default: "py-6 md-mid:py-14",
		wave: "md-mid:py-10 my-22",
		title: "mb-8 md-mid:mb-10",
	},
};

/** @type {Record<SectionTheme, string>} */
const THEME_CLASSES = {
	primary: "bg-primary-lighter text-primary-darker",
	primaryDark: "bg-primary-darker text-primary-lighter",
	secondary: "bg-secondary-lighter text-secondary-darker",
	secondaryDark: "bg-secondary-darker text-secondary-lighter",
	accent: "bg-accent-lighter text-primary-darker",
	accentDark: "bg-accent-darker text-primary-lighter",
	accentSoft: "bg-mimosa-lighter text-primary-darker",
	default: "",
};
const THEME_WAVE_DEFAULT = THEME_CLASSES.accentSoft;
/** @type {Record<SectionTheme, string>} */
const WAVE_COLORS = {
	primary: "primary-lighter",
	primaryDark: "primary-darker",
	secondary: "secondary-lighter",
	secondaryDark: "secondary-darker",
	accent: "accent-lighter",
	accentDark: "accent-darker",
	accentSoft: "mimosa-lighter",
	default: "mimosa-lighter",
};

let spacing = $derived(
	customSpacing ||
		`${wave ? spacingY[size].wave : spacingY[size].default} ${SPACING_X_CLASSES}`,
);
let titleSpacing = $derived(spacingY[size].title);
let themeClasses = $derived(
	theme !== "default" ? THEME_CLASSES[theme] : wave ? THEME_WAVE_DEFAULT : "",
);
let waveColor = $derived(WAVE_COLORS[theme]);
</script>

<section class="relative {classes} {spacing} {themeClasses}">
	<div class="max-w-6xl mx-auto {innerClasses}">
		{#if wave}
			<WaveSvg color={waveColor}>
				{@render content()}
			</WaveSvg>
		{:else}
			{@render content()}
		{/if}
	</div>
</section>

{#snippet content()}
	{#if title}
		<h2 class="{titleSpacing} text-primary-darkest text-2xl md:text-3xl font-bold">{title}</h2>
	{/if}
	{@render children?.()}
{/snippet}
