<script>
import Footer from "$lib/components/shell/Footer.svelte";
import Header from "$lib/components/shell/Header.svelte";
import "../app.css";

/** @type {{children: import('svelte').Snippet,data: import('$lib/types/contentful').ContentfulData}} */
let { children, data } = $props();
</script>

<div
	class="relative overflow-clip flex flex-col app min-h-dvh bg-primary-50 text-primary-800">
	<Header />

	<main class="grow">
		{@render children()}
	</main>

	<Footer />
</div>
