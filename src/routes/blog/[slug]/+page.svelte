<script>
import Hero from "$layout/Hero.svelte";
import Section from "$layout/Section.svelte";
import { formatDate } from "$lib/helpers/date.js";
import { onMount } from "svelte";

let { data } = $props();
let { title, intro, slug, sections } = data.post.fields;
let { createdAt, updatedAt } = data.post.meta;

let created = $state("");
let updated = $state("");

onMount(() => {
	created = `Published on ${formatDate(createdAt)}`;
	updated = `Last updated on ${formatDate(updatedAt)}`;
});
</script>

<Hero title={title} transitionName={slug}>
	{@html intro}
	<p class="mt-4 text-base italic text-primary-800">
		{#if createdAt === updatedAt}
			{created}
		{:else}
			{updated}
		{/if}
	</p>
</Hero>

{#each sections as section}
	<Section>
		<div class="prose prose-base">{@html section}</div>
	</Section>
{/each}
