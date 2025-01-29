<script>
import Dialog from "$ui/Dialog.svelte";

/**
 * @typedef {Object} Props
 * @property {'page'|'book'|'intake'|'session'} [type='page']
 */

/** @type {Props} */
let { type = "page" } = $props();

/** @type {HTMLDialogElement|null} */
let dialog = $state(null);

function openDialog() {
	dialog?.showModal();
}

function closeDialog() {
	dialog?.close();
}

/**
 * Function to get the booking URL
 * @param {boolean} [title=false] - Whether to return a title instead of a URL
 * @returns {string} - The appropriate booking URL or title
 */
function getBooking(title = false) {
	const baseUrl = "https://mikrouli.setmore.com";
	const bookingOptions = {
		page: {
			title: "View Booking page",
			url: baseUrl,
		},
		book: {
			title: "Schedule a Session",
			url: `${baseUrl}/book`,
		},
		intake: {
			title: "Schedule an Intake",
			url: `${baseUrl}/book?step=time-slot&products=6e0f678a-c1ef-49ae-bc6e-0087886e4e22&type=service&staff=cbd74a17-ccea-4b29-98a7-b7f90abc10e2&staffSelected=true`,
		},
		session: {
			title: "Schedule a Therapy Session",
			url: `${baseUrl}/book?step=time-slot&products=09def0c7-8a39-48de-8167-5d6bff597020&type=service&staff=cbd74a17-ccea-4b29-98a7-b7f90abc10e2&staffSelected=true`,
		},
	};

	const option = bookingOptions[type];
	return title ? option.title : option.url;
}
</script>

<button
	class="px-4 py-2 rounded-lg bg-primary-800 text-white hover:bg-primary-900"
	onclick={openDialog}
>
	{getBooking(true)}
</button>
<Dialog bind:dialogElement={dialog} classes="bg-primary-950" fullscreen>
	<div id="root"></div>
	<iframe
		title="Book a session"
		src={getBooking()}
		width="100%"
		height="100%"
		class="w-full h-full"
		loading="lazy"
	></iframe>
	{#snippet header()}
		<footer class="z-1 flex flex-row-reverse justify-start bg-primary-950">
			<button
				onclick={closeDialog}
				class="py-4 px-6 text-sm text-primary-200 hover:text-primary-50"
				aria-label="Close"
			>
				Close Dialog
			</button>
			<a href={getBooking()} target="_blank"
				class="py-4 px-6 text-sm text-primary-200 hover:text-primary-50"
				aria-label="Close"
			>
				Open in a New Tab
			</a>
		</footer>
	{/snippet}
</Dialog>


