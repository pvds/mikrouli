<script>
import { BOOKING_OPTIONS, BOOKING_URL, BUTTON_THEME } from "$config";
import { svgIcon } from "$lib/helpers/icon";
import Dialog from "$ui/Dialog.svelte";

/**
 * @typedef {import("$types/content").BookingType} BookingType
 * @typedef {import("$types/content").BookingCta} BookingCta
 * @typedef {import("$types/content").CtaTheme} CtaTheme
 * @typedef {import("$types/content").CtaIcon} CtaIcon
 *
 * @typedef {Object} Props
 * @property {BookingType} [type='page']
 * @property {BookingCta} [cta]
 * @property {CtaTheme} [ctaTheme='primary']
 * @property {CtaIcon} [ctaIcon]
 */

/** @type {Props} */
let { type = "page", cta, ctaTheme = "primary", ctaIcon } = $props();

/** @type {HTMLDialogElement|null} */
let dialog = $state(null);
/** @type {'loading'|'loaded'|'failed'} */
let iframeState = $state("loading");

const getBookingCta = () => BOOKING_OPTIONS[type].cta;
const getBookingUrl = () => BOOKING_OPTIONS[type].url;
</script>

<button
	class="group {cta?.classes ? cta.classes : 'px-4 py-2'}
	transition-all {BUTTON_THEME[ctaTheme]}"
	onclick={() => dialog?.showModal()}
>
	{#if cta}
		<span class="xs:hidden">{cta.textShort}</span>
		<span class="max-xs:hidden min-lg:hidden">{cta.text}</span>
		<span class="max-lg:hidden">{cta.textLong}</span>
	{:else}
		{getBookingCta()}
	{/if}
	{#if ctaIcon}
		{@html svgIcon(ctaIcon)}
	{/if}
</button>
<Dialog bind:dialogElement={dialog} classes="bg-primary-darkest" fullscreen>
	{#snippet header()}
		<header class="p-2 z-1 flex flex-row-reverse justify-start bg-primary-darkest gap-2">
			<button
				onclick={() => dialog?.close()}
				class="py-2 px-4 rounded-full text-sm font-semibold hover:bg-primary-darker text-primary-light hover:text-primary-lightest"
				aria-label="Close"
			>
				Close Dialog
			</button>
			<a href={getBookingUrl()} target="_blank"
			   class="py-2 px-4 rounded-full text-sm font-semibold hover:bg-primary-darker text-primary-light hover:text-primary-lightest"
			>
				Open in a New Tab
			</a>
		</header>
	{/snippet}

	{#if iframeState === "loading"}
		<div class="absolute inset-0 flex items-center justify-center">
			<div class="w-10 h-10 border-4 border-transparent border-t-white rounded-full animate-spin"></div>
		</div>
	{:else if iframeState === "failed"}
		<div class="absolute inset-0 flex items-center justify-center bg-primary-darker">
			<section>
				<h1 class="text-3xl">Failed to load the booking form.</h1>
				<a href={BOOKING_URL} target="_blank" onclick={() => dialog?.close()}
				   class="inline-block mt-4 py-4 text-lg underline"
				>
					Try opening our booking app in a new tab.
				</a>
			</section>
		</div>
	{/if}

	<iframe
		title={getBookingCta()}
		src="{getBookingUrl()}"
		width="100%"
		height="100%"
		class="w-full h-full"
		loading="lazy"
		onload={() => (iframeState = "loaded")}
		onerror={() => (iframeState = "failed")}
	></iframe>
</Dialog>
