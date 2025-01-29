<script>
/**
 * @typedef {Object} Props
 * @property {string} [classes]
 * @property {boolean} [blocking=false]
 * @property {boolean} [fullscreen=false]
 * @property {HTMLDialogElement|null} dialogElement
 * @property {import('svelte').Snippet} [children]
 * @property {import('svelte').Snippet} [header]
 * @property {import('svelte').Snippet} [headerContent]
 * @property {import('svelte').Snippet} [footer]
 * @property {import('svelte').Snippet} [footerContent]
 */

/** @type {Props} */
let {
	fullscreen = false,
	classes = "",
	dialogElement = $bindable(),
	children,
	header,
	headerContent,
	footer,
	footerContent,
} = $props();
</script>

<dialog
	bind:this={dialogElement} onclose={() => console.log("closed", dialogElement?.open)}
	class="rounded-3xl inset-0 m-auto border-none {fullscreen && 'h-full w-full'}
	{classes} max-w-[min(120ch,calc(--spacing(-16)+100%))] max-h-[min(120ch,calc(--spacing(-16)+100%))]
	backdrop:bg-primary-950/50"
>
	<div class="flex flex-col h-full">
		{#if header}
			{@render header()}
		{/if}
		{#if headerContent}
			<header>
				{@render headerContent()}
			</header>
		{/if}
		<main class="flex-auto">{@render children?.()}</main>
		{#if footer}
			<footer>
				{@render footer()}
			</footer>
		{/if}
		{#if footerContent}
			{@render footerContent()}
		{/if}
	</div>
</dialog>
