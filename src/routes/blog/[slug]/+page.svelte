<script>
import { base } from "$app/paths";
import Hero from "$layout/Hero.svelte";
import Section from "$layout/Section.svelte";
import { formatDate } from "$lib/helpers/date.js";
import { onMount } from "svelte";

let { data } = $props();
let { title, intro, slug, contentSections } = $derived(data.post.fields);
let { createdAt, updatedAt } = $derived(data.post.meta);
let { prev, next } = $derived(data.post);

let created = $state("");
let updated = $state("");

onMount(() => {
	created = `Published on ${formatDate(createdAt)}`;
	updated = `Last updated on ${formatDate(updatedAt)}`;
});
</script>

<Hero title={title} transitionName={slug}>
	{@html intro}
	<p class="mt-4 text-base italic text-primary-darker">
		{#if createdAt === updatedAt}
			{created}
		{:else}
			{updated}
		{/if}
	</p>
</Hero>

{#each contentSections as section}
	<Section innerClasses="prose prose-base">
		{@html section}
	</Section>
{/each}

{#if prev || next}
	<Section innerClasses="flex flex-wrap justify-between">
		{#if prev}
			<a href={`${base}/blog/${prev.fields.slug}`}
			   class="inline-block flex-auto group mr-2 py-2 font-semibold text-primary-darker hover:text-accent-dark">
				<span class="inline-block mr-1 group-hover:animate-wiggle-left">&larr;</span>{prev.fields.title}
			</a>
		{/if}
		{#if next}
			<a href={`${base}/blog/${next.fields.slug}`}
			   class="inline-block flex-auto text-right group ml-2 py-2 font-semibold text-primary-darker hover:text-accent-dark">
				{next.fields.title}<span class="inline-block ml-1 group-hover:animate-wiggle-right">&rarr;</span>
			</a>
		{/if}
	</Section>
{/if}
