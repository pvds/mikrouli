<script>
import Header from "./Header.svelte";
import "../app.css";

/** @type {{children: import('svelte').Snippet}} */
const { children } = $props();
</script>

<div class="app">
	<Header />

	<main>
		{@render children()}
	</main>
</div>
