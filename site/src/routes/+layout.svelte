<script>
import Header from "./Header.svelte";
import "../app.css";

/** @type {{children: import('svelte').Snippet}} */
const { children } = $props();
</script>

<svelte:head>
	<link rel="preload" as="font" href="/fonts/nunito.ttf" type="font/ttf" crossorigin="anonymous">
	<link rel="preload" as="font" href="/fonts/nunito-italic.ttf" type="font/ttf" crossorigin="anonymous">
</svelte:head>

<div class="app">
	<Header />

	<main>
		{@render children()}
	</main>
</div>
