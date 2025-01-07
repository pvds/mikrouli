<script>
import Hero from "$lib/components/shell/Hero.svelte";
import { marked } from "marked";

/** @type {{data: import('$lib/types/contentful').ContentfulData}} */
let { data } = $props();

const page = data.pages.find((page) => page.fields.slug === "about");
</script>

<svelte:head>
	<title>About</title>
	<meta name="description" content="" />
</svelte:head>
{#if page}
	<Hero title={page.fields.longTitle}>
		{@html marked(page?.fields.intro)}
	</Hero>
{/if}
