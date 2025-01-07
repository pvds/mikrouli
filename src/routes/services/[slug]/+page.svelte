<script>
import Hero from "$lib/components/shell/Hero.svelte";
import { marked } from "marked";

/** @type {{data: import('$lib/types/contentful').ContentfulData}} */
let { data } = $props();
</script>

<svelte:head>
	<title>Service X - Mikrouli</title>
	<meta name="description" content="" />
</svelte:head>

	<Hero title="Service X">
		{@html marked("This is a service page")}
	</Hero>
