<script lang="ts">
import { onMount } from "svelte";

let isDisabled = $state(false);

onMount(() => {
	isDisabled = localStorage.getItem("umami.disabled") === "1";
});

$effect(() => {
	if (typeof localStorage === "undefined") return;

	if (isDisabled) {
		localStorage.setItem("umami.disabled", "1");
	} else {
		localStorage.removeItem("umami.disabled");
	}
});
</script>

<div class="mx-auto px-8 pt-8 md:pt-24 prose prose-strong:font-bold marker:text-accent-dark">
	<h1 class="text-2xl md:text-3xl">Configure Analytics tracking</h1>
	<p>
		In order to avoid tracking your own visits, you can disable tracking.<br/>
		<strong>Tracking is <span class="text-accent-dark font-black">{isDisabled ? "DISABLED" :
			"ENABLED"}</span>
			on this device using this browser</strong>.
	</p>
	<div class="mt-12 flex flex-wrap gap-2">
		<label class="inline-flex items-center gap-3 rounded-full border border-accent-dark bg-primary-light px-4 py-2 text-left text-primary-darker">
			<input bind:checked={isDisabled} type="checkbox" class="h-4 w-4 accent-accent-dark" />
			<span class="flex flex-col">
				<span><span class="font-black">{isDisabled ? "START" : "STOP"}</span> tracking</span>
				<small class="text-accent-dark/80">This device/browser combination</small>
			</span>
		</label>
	</div>
	{#if isDisabled}
	<div
		class="mt-8 prose-sm bg-accent-lighter border-2 border-accent-dark p-4 rounded-xl">
		<h2 class="text-accent-dark">Tracking is now disabled!</h2>
		<strong class="text-base">Please note</strong>
		<ul class="mt-2">
			<li>You need to <strong>disable tracking for every device and browser
				combination</strong> you use</li>
			<li>If you <strong>clear your browser data, you will need to disable tracking
				again</strong></li>
		</ul>
	</div>
	{/if}
</div>
