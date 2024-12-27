<script>
import Header from "$lib/components/shell/Header.svelte";
import "../app.css";

/** @type {{children: import('svelte').Snippet}} */
const { children } = $props();
</script>

<div class="app min-h-dvh bg-accent-100 text-broad">
	<Header />

	<main>
		{@render children()}
	</main>
</div>
