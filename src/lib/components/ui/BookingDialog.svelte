<script>
import Dialog from "$ui/Dialog.svelte";

/** @type {HTMLDialogElement|null} */
let dialog = null;

// Function to open the dialog
function openDialog() {
	dialog?.showModal();
}
</script>

<button
	class="px-4 py-2 rounded-lg bg-primary-800 text-white hover:bg-primary-900"
	onclick={openDialog}
>
	Book a Session
</button>
<Dialog bind:dialogElement={dialog} fullscreen>
	<div id="root"></div>
	<iframe
		title="Book a session"
		src="https://mikrouli.setmore.com"
		width="100%"
		height="100%"
		class="w-full h-full"
		loading="lazy"
	></iframe>
	{#snippet header()}
		<footer class="z-1 flex flex-row-reverse justify-start bg-primary-950">
			<button
				onclick={() => dialog?.close()}
				class="py-4 px-6 text-sm text-primary-200 hover:text-primary-50"
				aria-label="Close"
			>
				Back to Mikrouli.nl
			</button>
			<a href="https://mikrouli.setmore.com" target="_blank"
				class="py-4 px-6 text-sm text-primary-200 hover:text-primary-50"
				aria-label="Close"
			>
				Open Booking in a New Tab
			</a>
		</footer>
	{/snippet}
</Dialog>


