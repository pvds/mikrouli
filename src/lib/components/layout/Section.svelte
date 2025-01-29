<script>
/**
 * @typedef {Object} Props
 * @property {string} [classes]
 * @property {'sm'|'md'|'lg'} [size='md']
 * @property {'primary'|'secondary'|'default'} [theme='default']
 * @property {string} [customSpacing]
 * @property {boolean} [wave]
 * @property {import('svelte').Snippet} [children]
 */

import WaveSvg from "$visuals/WaveSvg.svelte";

/** @type {Props} */
let { classes, size = "md", theme = "default", customSpacing, wave, children } = $props();

const spacingX = "px-4 sm:px-6 md:px-8";
const spacingY = {
	sm: { default: "py-6 md:py-10", wave: "md:py-2 my-10" },
	md: { default: "py-10 md:py-16", wave: "md:py-6 my-14" },
	lg: { default: "py-14 md:py-20", wave: "md:py-10 my-18" },
};

const THEME_WAVE_DEFAULT = "bg-secondary-100 text-secondary-800";
const THEME_CLASSES = {
	primary: "bg-primary-100 text-primary-800",
	secondary: "bg-secondary-100 text-secondary-800",
	default: "",
};
const WAVE_COLORS = {
	primary: "primary-100",
	secondary: "secondary-100",
	default: "secondary-100",
};

let spacing = $derived(
	customSpacing || `${wave ? spacingY[size].wave : spacingY[size].default} ${spacingX}`,
);
let themeClasses = $derived(
	theme !== "default" ? THEME_CLASSES[theme] : wave ? THEME_WAVE_DEFAULT : "",
);
let waveColor = $derived(WAVE_COLORS[theme]);
</script>

<section class="relative {classes} {spacing} {themeClasses}">
	<div class="max-w-6xl mx-auto">
		{#if wave}
			<WaveSvg color={waveColor}>
				{@render children?.()}
			</WaveSvg>
		{:else}
			{@render children?.()}
		{/if}
	</div>
</section>
