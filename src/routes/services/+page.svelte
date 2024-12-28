<script>
import Hero from "$lib/components/shell/Hero.svelte";

/** @type {{data: import('$lib/types/contentful').ContentfulData}} */
let { data } = $props();

const page = data.pages.find((page) => page.fields.slug === "services");
</script>

<svelte:head>
	<title>Services - Mikrouli</title>
	<meta name="description" content="" />
</svelte:head>

{#if page}
	<Hero title={page.fields.longTitle}>
		<p>
			{page.fields.intro}
		</p>
	</Hero>
{/if}
