<script>
/**
 * @typedef {Object} Props
 * @property {string} [classes]
 * @property {'sm'|'md'|'lg'|'custom'} [size='md']
 * @property {'primary'|'secondary'} [theme='md']
 * @property {string} [customSpacing]
 * @property {boolean} [wave=false]
 * @property {import('svelte').Snippet} [children]
 */

import WaveSvg from "$visuals/WaveSvg.svelte";

/** @type {Props} */
let { classes, size = "md", theme, customSpacing, wave, children } = $props();

const spacingY = {
	sm: {
		default: "py-6 md:py-10",
		wave: "md:py-2 my-10",
	},
	md: {
		default: "py-10 md:py-16",
		wave: "md:py-6 my-14",
	},
	lg: {
		default: "py-14 md:py-20",
		wave: "md:py-10 my-18",
	},
};

let spacing = $derived(() => {
	let vertical = "";
	const horizontal = "px-4 sm:px-6 md:px-8";
	switch (size) {
		case "sm":
			vertical = wave ? spacingY.sm.wave : spacingY.sm.default;
			break;
		case "md":
			vertical = wave ? spacingY.md.wave : spacingY.md.default;
			break;
		case "lg":
			vertical = wave ? spacingY.lg.wave : spacingY.lg.default;
			break;
		default:
			vertical = wave ? spacingY.md.wave : spacingY.md.default;
	}
	return customSpacing ? customSpacing : `${vertical} ${horizontal}`;
});

let themeClasses = $derived(() => {
	switch (theme) {
		case "primary":
			return "bg-primary-100 text-primary-800";
		case "secondary":
			return "bg-secondary-100 text-secondary-800";
		default:
			return wave ? "bg-secondary-100 text-secondary-800" : "";
	}
});
let waveColor = $derived(() => {
	switch (theme) {
		case "primary":
			return "primary-100";
		case "secondary":
			return "secondary-100";
		default:
			return "secondary-100";
	}
});
</script>

<section class="relative {classes} {spacing()} {themeClasses()}">
	<div class="max-w-6xl mx-auto">
		{#if wave}
			<WaveSvg color={waveColor()}>
				{@render children?.()}
			</WaveSvg>
	    {:else}
			{@render children?.()}
		{/if}
	</div>
</section>
