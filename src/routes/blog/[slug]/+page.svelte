<script>
import Hero from "$lib/components/shell/Hero.svelte";
import { marked } from "marked";

/** @type {{data: import('$lib/types/contentful').ContentfulData}} */
let { data } = $props();
</script>

<svelte:head>
	<title>Blog post X - Mikrouli</title>
	<meta name="description" content="" />
</svelte:head>

	<Hero title="Blog post X">
		{@html marked("This is a blog post")}
	</Hero>
