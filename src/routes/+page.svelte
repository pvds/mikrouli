<script>
import Hero from "$lib/components/shell/Hero.svelte";
import { marked } from "marked";

/** @type {{data: import('$lib/types/contentful').ContentfulData}} */
let { data } = $props();

const page = data.pages.find((page) => page.fields.slug === "home");
</script>

{#if page}
	<Hero title={page.fields.longTitle}>
		<p>
			{@html marked(page.fields.intro)}
		</p>
	</Hero>
{/if}
