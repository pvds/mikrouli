<script>
import { BOOKING_OPTIONS, BOOKING_URL } from "$config";
import Dialog from "$ui/Dialog.svelte";

/**
 * @typedef {Object} Props
 * @property {'page'|'book'|'intake'|'session'} [type='page']
 */

/** @type {Props} */
let { type = "page" } = $props();

/** @type {HTMLDialogElement|null} */
let dialog = $state(null);
/** @type {'loading'|'loaded'|'failed'} */
let iframeState = $state("loading");

const getBookingCta = () => BOOKING_OPTIONS[type].cta;
const getBookingUrl = () => BOOKING_OPTIONS[type].url;
</script>

<button
	class="px-4 py-2 rounded-lg bg-primary-800 text-white hover:bg-primary-900"
	onclick={() => dialog?.showModal()}
>
	{getBookingCta()}
</button>
<Dialog bind:dialogElement={dialog} classes="bg-primary-950" fullscreen>

	{#if iframeState === "loading"}
		<div class="absolute inset-0 flex items-center justify-center">
			<div class="w-10 h-10 border-4 border-transparent border-t-white rounded-full animate-spin"></div>
		</div>
	{:else if iframeState !== "failed"}
		<div class="absolute inset-0 flex items-center justify-center bg-primary-900">
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
	{#snippet header()}
		<footer class="z-1 flex flex-row-reverse justify-start bg-primary-950">
			<button
				onclick={() => dialog?.close()}
				class="py-4 px-6 text-sm text-primary-200 hover:text-primary-50"
				aria-label="Close"
			>
				Close Dialog
			</button>
			<a href={getBookingUrl()} target="_blank"
			   class="py-4 px-6 text-sm text-primary-200 hover:text-primary-50"
			>
				Open in a New Tab
			</a>
		</footer>
	{/snippet}
</Dialog>
