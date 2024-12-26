<script>
import Header from "$lib/components/shell/Header.svelte";
import "../app.css";

/** @type {{children: import('svelte').Snippet}} */
const { children } = $props();
</script>

<svelte:head>
	<link rel="preload" as="font" href="/fonts/nunito-latin.woff2"
		  type="font/woff2"
		  crossorigin="anonymous">
</svelte:head>

<div class="app min-h-dvh bg-brand-100 text-broad">
	<Header />

	<main class="section">
		{@render children()}
	</main>
</div>
