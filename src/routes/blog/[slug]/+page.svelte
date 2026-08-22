<script>
import { onMount } from "svelte";
import { resolve } from "$app/paths";
import { U_NBSP } from "$config";
import ContentSection from "$layout/ContentSection.svelte";
import Hero from "$layout/Hero.svelte";
import Outro from "$layout/Outro.svelte";
import Section from "$layout/Section.svelte";
import TeaserSection from "$layout/TeaserSection.svelte";
import { formatDate } from "$lib/helpers/date.js";
import { getImageName } from "$lib/helpers/image.js";

/** @type {import('./$types').PageProps} */
let { data } = $props();
const page = $derived(data.post.fields);
const meta = $derived(data.post.meta);
const post = $derived(data.post);
const pageInfo = $derived(data.page);
const services = $derived(data.services);

let created = $state(U_NBSP);
let updated = $state(U_NBSP);

onMount(() => {
	created = `Published on ${formatDate(meta.createdAt)}`;
	updated = `Last updated on ${formatDate(meta.updatedAt)}`;
});
</script>

<Hero title={page.title} image={getImageName(page.heroImage?.file.fileName)}
	  imageAlt={page.heroImage?.title} imagePositionClass="object-[0%_25%]">
	{@html page.intro}
	<p class="mt-4 text-base italic text-primary-light">
		{#if meta.createdAt === meta.updatedAt}
			{created}
		{:else}
			{updated}
		{/if}
	</p>
</Hero>

{#if page.sections?.length}
	{#each page.sections as section, i (section.id)}
		<ContentSection prose proseClasses="max-w-full!" index={i} title={section.title}>
			{@html section.content}
		</ContentSection>
	{/each}
{:else}
	{#each page.contentSections as section, i}
		<ContentSection prose proseClasses="max-w-full!" index={i}>
			{@html section}
		</ContentSection>
	{/each}
{/if}

{#if post.prev || post.next}
	<Section innerClasses="flex flex-wrap justify-between">
		{#if post.prev}
			<a href={resolve(`/blog/${post.prev?.slug}`)}
			   class="inline-block group mr-auto pr-4 py-2 font-semibold md-mid:text-xl text-primary-darker hover:text-accent-dark">
				<span class="inline-block mr-1 group-hover:animate-wiggle-left">&larr;
				</span>{post.prev?.title}
			</a>
		{/if}
		{#if post.next}
			<a href={resolve(`/blog/${post.next?.slug}`)}
			   class="inline-block group ml-auto pl-4 py-2 font-semibold md-mid:text-xl text-primary-darker hover:text-accent-dark text-right">
				{post.next?.title}<span
				class="inline-block ml-1 group-hover:animate-wiggle-right">&rarr;</span>
			</a>
		{/if}
	</Section>
{/if}

{#if pageInfo.outro}
	<Outro image={pageInfo.outroImage}>
		{@html pageInfo.outro}
	</Outro>
{/if}

<TeaserSection items={services} slug="services" title="How I Can Support You"/>
