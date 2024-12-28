<script>
import Hero from "$lib/components/shell/Hero.svelte";

/** @type {{data: import('$lib/types/contentful').ContentfulData}} */
let { data } = $props();

const page = data.pages.find((page) => page.fields.slug === "blog");
</script>

<svelte:head>
	<title>Blog - Mikrouli</title>
	<meta name="description" content="" />
</svelte:head>

{#if page}
	<Hero title={page.fields.longTitle}>
		<p>
			{page.fields.intro}
		</p>
	</Hero>
{/if}
