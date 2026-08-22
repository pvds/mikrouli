<script lang="ts">
import {
	BOOKING_OPTIONS,
	BOOKING_URL,
	BUTTON_SIZE,
	BUTTON_THEME,
} from "$config";
import { svgIcon } from "$lib/helpers/icon";
import type {
	BookingCta,
	BookingType,
	CtaIcon,
	CtaSize,
	CtaTheme,
} from "$types/content";
import Dialog from "$ui/Dialog.svelte";

interface Props {
	type?: BookingType;
	cta?: BookingCta;
	ctaTheme?: CtaTheme;
	ctaSize?: CtaSize;
	ctaIcon?: CtaIcon;
}

let {
	type = "page",
	cta,
	ctaSize = "md",
	ctaTheme = "primary",
	ctaIcon,
}: Props = $props();

let dialog = $state<HTMLDialogElement | null>(null);
let iframeState = $state<"loading" | "loaded" | "failed">("loading");

const booking = $derived(BOOKING_OPTIONS[type]);
</script>

<button
	class="group {cta?.classes}
	transition-all {BUTTON_THEME[ctaTheme]} {BUTTON_SIZE[ctaSize]}"
	onclick={() => dialog?.showModal()}
	type="button"
>
	{#if cta}
		<span class="xs:hidden">{cta.textShort}</span>
		<span class="max-xs:hidden min-lg:hidden">{cta.text}</span>
		<span class="max-lg:hidden">{cta.textLong}</span>
	{:else}
		{booking.cta}
	{/if}
	{#if ctaIcon}
		{@html svgIcon(ctaIcon)}
	{/if}
</button>
<Dialog bind:dialogElement={dialog} classes="bg-primary-darkest" fullscreen>
	{#snippet header()}
		<div class="p-2 z-1 flex flex-row-reverse justify-start bg-primary-darkest gap-2">
			<button
				onclick={() => dialog?.close()}
				class="py-2 px-4 rounded-full text-sm font-semibold hover:bg-primary-darker text-primary-light hover:text-primary-lightest"
				aria-label="Close"
				type="button"
			>
				Close Dialog
			</button>
			<a href={booking.url} target="_blank"
			   class="py-2 px-4 rounded-full text-sm font-semibold hover:bg-primary-darker text-primary-light hover:text-primary-lightest"
			>
				Open in a New Tab
			</a>
		</div>
	{/snippet}

	{#if iframeState === "loading"}
		<div class="absolute inset-0 flex items-center justify-center">
			<div class="w-10 h-10 border-4 border-transparent border-t-white rounded-full animate-spin"></div>
		</div>
	{:else if iframeState === "failed"}
		<div class="absolute inset-0 flex items-center justify-center bg-primary-darker">
			<section>
				<h1 class="text-2xl md:text-3xl">Failed to load the booking form.</h1>
				<a href={BOOKING_URL} target="_blank" onclick={() => dialog?.close()}
				   class="inline-block mt-4 py-4 text-lg underline"
				>
					Try opening our booking app in a new tab.
				</a>
			</section>
		</div>
	{/if}

	<iframe
		title={booking.cta}
		src={booking.url}
		class="w-full h-full"
		loading="lazy"
		onload={() => (iframeState = "loaded")}
		onerror={() => (iframeState = "failed")}
	></iframe>
</Dialog>
