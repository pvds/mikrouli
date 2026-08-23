<script lang="ts">
import type { Snippet } from "svelte";

interface Props {
	classes?: string;
	fullscreen?: boolean;
	id?: string;
	closedby?: "any" | "closerequest" | "none";
	dialogElement?: HTMLDialogElement | null;
	children?: Snippet;
	header?: Snippet;
	headerContent?: Snippet;
	footer?: Snippet;
	footerContent?: Snippet;
}

let {
	classes = "",
	fullscreen = false,
	id = undefined,
	closedby = undefined,
	dialogElement = $bindable(),
	children,
	header,
	headerContent,
	footer,
	footerContent,
}: Props = $props();
</script>

<dialog bind:this={dialogElement}
	{id}
	closedby={closedby}
	class="inset-0 m-auto border-none {fullscreen && 'h-full w-full'} {classes}
	max-w-[min(120ch,calc(--spacing(-16)+100%))] max-h-[min(120ch,calc(--spacing(-16)+100%))]
	max-sm:max-w-[calc(--spacing(-4)+100%)] max-sm:max-h-[calc(--spacing(-4)+100%)]
	rounded-3xl max-sm:rounded-lg
	transition-all transition-discrete duration-short open:delay-shortest open:duration-long
	starting:open:opacity-0 starting:open:scale-95 open:opacity-100 open:scale-100
	scale-50 opacity-0
	backdrop:bg-black/60 backdrop:cursor-pointer backdrop:grayscale backdrop:opacity-0
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
		<div class="flex-auto">{@render children?.()}</div>
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
