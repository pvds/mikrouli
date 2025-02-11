<script>
import { base } from "$app/paths";
import ContentSection from "$layout/ContentSection.svelte";
import Hero from "$layout/Hero.svelte";
import HeroImage from "$layout/HeroImage.svelte";
import Section from "$layout/Section.svelte";
import { formatDate } from "$lib/helpers/date.js";
import { getImageName } from "$lib/helpers/image.js";
import { onMount } from "svelte";

let { data } = $props();
let { title, intro, slug, contentSections, heroImage } = $derived(data.post.fields);
let { createdAt, updatedAt } = $derived(data.post.meta);
let { prev, next } = $derived(data.post);
let created = $state("");
let updated = $state("");

onMount(() => {
	created = `Published on ${formatDate(createdAt)}`;
	updated = `Last updated on ${formatDate(updatedAt)}`;
});
</script>

{#if heroImage}
	<HeroImage title={title} image={getImageName(heroImage.file.fileName)} imageAlt={heroImage.title}
		transitionName={slug}>
		{@html intro}
		<p class="mt-4 text-base italic text-primary-light">
			{#if createdAt === updatedAt}
				{created}
			{:else}
				{updated}
			{/if}
		</p>
	</HeroImage>
{:else}
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
{/if}

{#each contentSections as section}
	<ContentSection prose size="lg">
		{@html section}
	</ContentSection>
{/each}

{#if prev || next}
	<Section innerClasses="flex flex-wrap justify-between">
		{#if prev}
			<a href={`${base}/blog/${prev.slug}`}
			   class="inline-block group mr-auto pr-4 py-2 font-semibold text-primary-darker hover:text-accent-dark">
				<span class="inline-block mr-1 group-hover:animate-wiggle-left">&larr;</span>{prev.title}
			</a>
		{/if}
		{#if next}
			<a href={`${base}/blog/${next.slug}`}
			   class="inline-block text-right group ml-auto pl-4 py-2 font-semibold text-primary-darker hover:text-accent-dark">
				{next.title}<span class="inline-block ml-1 group-hover:animate-wiggle-right">&rarr;</span>
			</a>
		{/if}
	</Section>
{/if}
