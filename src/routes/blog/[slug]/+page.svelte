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
import { onMount } from "svelte";

let { data } = $props();
let { title, intro, sections, contentSections, heroImage } = $derived(data.post.fields);
let { createdAt, updatedAt } = $derived(data.post.meta);
let { prev, next } = $derived(data.post);
let { outro, outroImage } = $derived(data.page);
let services = $derived(data.services);

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

{#if sections?.length}
	{#each sections as section, i}
		<ContentSection prose proseClasses="max-w-full!" index={i} title={section.title}>
			{@html section.content}
		</ContentSection>
	{/each}
{:else}
	{#each contentSections as section, i}
		<ContentSection prose proseClasses="max-w-full!" index={i}>
			{@html section}
		</ContentSection>
	{/each}
{/if}

{#if prev || next}
	<Section innerClasses="flex flex-wrap justify-between">
		{#if prev}
			<a href={`${base}/blog/${prev.slug}`}
			   class="inline-block group mr-auto pr-4 py-2 font-semibold md-mid:text-xl text-primary-darker hover:text-accent-dark">
				<span class="inline-block mr-1 group-hover:animate-wiggle-left">&larr;</span>{prev.title}
			</a>
		{/if}
		{#if next}
			<a href={`${base}/blog/${next.slug}`}
			   class="inline-block group ml-auto pl-4 py-2 font-semibold md-mid:text-xl text-primary-darker hover:text-accent-dark text-right">
				{next.title}<span class="inline-block ml-1 group-hover:animate-wiggle-right">&rarr;</span>
			</a>
		{/if}
	</Section>
{/if}

{#if outro}
	<Outro image={outroImage}>
		{@html outro}
	</Outro>
{/if}

<TeaserSection items={services} slug="services" title="How I Can Support You"/>
