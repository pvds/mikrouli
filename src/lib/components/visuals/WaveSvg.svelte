<script>
/** @typedef {import('./WaveSvg.type.d.ts').WaveProps} Wave */

/**
 * @typedef {Object} Props
 * @property {Wave['direction']} [direction]
 * @property {Wave['alignment']} [alignment]
 * @property {Wave['height']} [height]
 * @property {Wave['opacity']} [opacity]
 * @property {Wave['color']} [color]
 * @property {import('svelte').Snippet} [children]
 */

/** @type {Props} */
let {
	direction = "both",
	alignment = "left",
	color = "primary-100",
	height = 30,
	opacity = 1,
	children,
} = $props();
const alignmentClass = alignment === "left" ? "left-0" : "right-0";
</script>

<div class="wave">
	{#if direction === 'top' || direction === 'both'}
		<div
			class="wave__svg absolute z-1 w-full min-w-6xl {alignmentClass} -top-20 overflow-hidden pointer-events-none">
			<svg class="w-[inherit]"
				 style="height: calc({height} * var(--spacing))"
				 xmlns="http://www.w3.org/2000/svg"
				 viewBox="0 0 1440 390" preserveAspectRatio="none">
				<path style="fill: var(--color-{color})" fill-opacity="{opacity}"
					  d="M0 400V150c179 4 358 7 523 24s315 46 465 44 301-35 452-68v250H0Z"/>
			</svg>
		</div>
	{/if}
	<div class="wave__content {color} relative z-2 py-8">
		{@render children?.()}
	</div>
	{#if direction === 'bottom' || direction === 'both'}
		<div
			class="wave__svg absolute z-1 w-full min-w-6xl {alignmentClass} -bottom-20 overflow-hidden pointer-events-none">
			<svg class="w-[inherit]"
				 style="height: calc({height} * var(--spacing))"
				 xmlns="http://www.w3.org/2000/svg"
				 viewBox="0 0 1440 390" preserveAspectRatio="none">
				<path style="fill: var(--color-{color})" fill-opacity="{opacity}" d="M1440 0v250c-182-9-364-19-529-13s-314 26-463 31-299-7-448-18V0h1440Z"/>
			</svg>
		</div>
	{/if}
</div>

<!-- TODO: allow selecting or randomizing selected wave -->
{#snippet wave()}
	<div
		class="wave__svg absolute z-1 w-full min-w-6xl {alignmentClass} top-full overflow-hidden pointer-events-none">
		<svg class="w-[inherit]"
			 style="height: calc({height} * var(--spacing))"
			 xmlns="http://www.w3.org/2000/svg"
			 viewBox="0 0 1440 390" preserveAspectRatio="none">
			<path style="fill: var(--color-{color})" fill-opacity="{opacity}" d="M1440 0v250c-182-9-364-19-529-13s-314 26-463 31-299-7-448-18V0h1440Z"/>
			<path style="fill: var(--color-{color})" fill-opacity="{opacity}" d="M1440 0v250c-175 8-350 16-519 34s-331 45-483 41-295-40-438-75V0h1440Z"/>
			<path style="fill: var(--color-{color})" fill-opacity="{opacity}" d="M1440 0v250c-147 30-294 60-472 44s-387-79-554-94-290 17-414 50V0h1440Z"/>
			<path style="fill: var(--color-{color})" fill-opacity="{opacity}" d="M0 400V150c120 37 240 73 350 53s210-97 327-108c117-10 250 46 380 66s256 5 383-11v250H0Z"/>
			<path style="fill: var(--color-{color})" fill-opacity="{opacity}" d="M0 400V150c117 16 234 31 370 12s292-73 414-61c123 12 212 90 316 109s222-20 340-60v250H0Z"/>
			<path style="fill: var(--color-{color})" fill-opacity="{opacity}" d="M0 400V150c97 33 195 66 331 74s312-8 444-42c132-33 220-84 324-92s222 26 341 60v250H0Z"/>
		</svg>
	</div>
{/snippet}
