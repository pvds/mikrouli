<script>
import Hero from "$layout/Hero.svelte";
import Section from "$layout/Section.svelte";
import { formatDate } from "$lib/helpers/date.js";

let { data } = $props();
let { title, intro, slug, sections } = data.post.fields;
let { createdAt, updatedAt } = data.post.meta;
</script>

<Hero title={title} transitionName={slug}>
	{@html intro}
	<p class="mt-4 text-base italic text-primary-800">
		{#if createdAt === updatedAt}
			Published on {formatDate(createdAt)}
		{:else}
			Last updated on {formatDate(updatedAt)}
		{/if}
	</p>
</Hero>

{#each sections as section}
	<Section>
		<div class="prose prose-base">{@html section}</div>
	</Section>
{/each}
