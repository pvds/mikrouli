<script>
import { BUTTON_THEME } from "$config";
import { onMount } from "svelte";

let isDisabled = $state(false);

onMount(() => {
	isDisabled = localStorage.getItem("umami.disabled") === "1";
});

function toggleTracking() {
	if (isDisabled) {
		localStorage.removeItem("umami.disabled"); // Enable tracking
	} else {
		localStorage.setItem("umami.disabled", "1"); // Disable tracking
	}
	isDisabled = !isDisabled;
}
</script>

<div class="mx-auto px-8 pt-8 md:pt-24 prose prose-strong:font-bold marker:text-accent-dark">
	<h1 class="text-3xl">Configure Analytics tracking</h1>
	<p>
		In order to avoid tracking your own visits, you can disable tracking.<br/>
		<strong>Tracking is <span class="text-accent-dark font-black">{isDisabled ? "DISABLED" :
			"ENABLED"}</span>
			on this device using this browser</strong>.
	</p>
	<div class="mt-12 flex flex-wrap gap-2">
	<button onclick={toggleTracking}
		class="flex flex-col px-4 py-2 transition text-center leading-tight {BUTTON_THEME.primary}">
		<span><span class="font-black">{isDisabled ? "START" : "STOP"}</span> tracking</span>
		<small class="text-accent-light">This device/browser combination</small>
	</button>
	<a href="https://eu.umami.is/share/ZNdZ6PywYGVatvHp/mikrouli.nl" target="_blank" rel="noopener"
	   class="px-4 py-2 no-underline transition text-center flex items-center {BUTTON_THEME.secondary}">View
		Analytics</a>
	</div>
	{#if isDisabled}
	<div
		class="mt-8 prose-sm bg-accent-lighter border-2 border-accent-dark p-4 rounded-xl">
		<h2 class="text-accent-dark">Tracking is now disabled!</h2>
		<strong class="text-base">Please note</strong>
		<ul class="mt-2">
			<li>You need to <strong>disable tracking for every device and browser
			combination</strong> you use
			<li>If you <strong>clear your browser data, you will need to disable tracking
				again</strong>
		</ul>
	</div>
	{/if}
</div>
