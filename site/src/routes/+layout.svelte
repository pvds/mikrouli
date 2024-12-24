<script>
import Header from "$lib/components/Header.svelte";
import "$lib/styles/index.css";

/** @type {{children: import('svelte').Snippet}} */
const { children } = $props();
</script>

<svelte:head>
	<link rel="preload" as="font" href="/fonts/nunito-latin.woff2"
		  type="font/woff2"
		  crossorigin="anonymous">
</svelte:head>

<div class="app">
	<Header />

	<main>
		{@render children()}
	</main>
</div>
