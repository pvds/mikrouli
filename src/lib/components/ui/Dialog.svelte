<script>
/**
 * @typedef {Object} Props
 * @property {string} [classes]
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
	classes = "",
	fullscreen = false,
	dialogElement = $bindable(),
	children,
	header,
	headerContent,
	footer,
	footerContent,
} = $props();

/**
 * Handle backdrop click to close the dialog
 * NB this only works if the dialog is modal (dialog.showModal())
 * @param {MouseEvent} event
 */
function handleBackdropClick(event) {
	if (event.target === dialogElement) {
		dialogElement?.close();
	}
}
</script>

<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_noninteractive_element_interactions
 	(native dialog is already accessible, closing on backdrop click is an enhancement ) -->
<dialog bind:this={dialogElement}
	onclick={handleBackdropClick}
	class="inset-0 m-auto border-none {fullscreen && 'h-full w-full'} {classes}
	max-w-[min(120ch,calc(--spacing(-16)+100%))] max-h-[min(120ch,calc(--spacing(-16)+100%))]
	max-sm:max-w-[calc(--spacing(-4)+100%)] max-sm:max-h-[calc(--spacing(-4)+100%)]
	rounded-3xl max-sm:rounded-lg
	transition-all transition-discrete duration-short open:delay-shortest open:duration-long
	starting:open:opacity-0 starting:open:scale-95 open:opacity-100 open:scale-100
	scale-50 opacity-0
	backdrop:bg-primary-950/50 backdrop:cursor-pointer backdrop:grayscale backdrop:opacity-0
	starting:open:backdrop:opacity-0 open:backdrop:opacity-100 backdrop:duration-short"
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
