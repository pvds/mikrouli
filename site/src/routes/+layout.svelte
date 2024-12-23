<script>
import "../app.css";

/** @type {{children: import('svelte').Snippet}} */
const { children } = $props();
</script>

<div class="app">
	<main>
		{@render children()}
	</main>
</div>
