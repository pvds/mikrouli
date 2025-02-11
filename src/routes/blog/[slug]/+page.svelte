<script>
import { base } from "$app/paths";
import { U_NBSP } from "$config";
import ContentSection from "$layout/ContentSection.svelte";
import Hero from "$layout/Hero.svelte";
import Outro from "$layout/Outro.svelte";
import Section from "$layout/Section.svelte";
import TeaserSection from "$layout/TeaserSection.svelte";
import { formatDate } from "$lib/helpers/date.js";
import { getImageName } from "$lib/helpers/image.js";
import Image from "$ui/image/Image.svelte";
import { onMount } from "svelte";

let { data } = $props();
let { title, intro, contentSections, heroImage } = $derived(data.post.fields);
let { createdAt, updatedAt } = $derived(data.post.meta);
let { prev, next } = $derived(data.post);
let outro = data.outro;
let services = data.services;

let created = $state(U_NBSP);
let updated = $state(U_NBSP);

onMount(() => {
	created = `Published on ${formatDate(createdAt)}`;
	updated = `Last updated on ${formatDate(updatedAt)}`;
});
</script>

<Hero {title} image={heroImage ? getImageName(heroImage.file.fileName) : undefined}
	  imageAlt={heroImage ? heroImage.title : undefined} imagePositionClass="object-[0%_25%]">
	{@html intro}
	<p class="mt-4 text-base italic text-primary-light">
		{#if createdAt === updatedAt}
			{created}
		{:else}
			{updated}
		{/if}
	</p>
</Hero>

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
			   class="inline-block text-right group ml-auto pl-4 py-2 font-semibold md:text-xl text-primary-darker hover:text-accent-dark">
				{next.title}<span class="inline-block ml-1 group-hover:animate-wiggle-right">&rarr;</span>
			</a>
		{/if}
	</Section>
{/if}

{#if outro}
	<Outro>{@html outro}</Outro>
{/if}

<TeaserSection items={services} slug="services" title="How I Can Support You"/>
