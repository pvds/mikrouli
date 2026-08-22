<script>
import ContentSection from "$layout/ContentSection.svelte";
import Hero from "$layout/Hero.svelte";
import Outro from "$layout/Outro.svelte";
import Section from "$layout/Section.svelte";
import TeaserSection from "$layout/TeaserSection.svelte";
import { getImageName } from "$lib/helpers/image.js";

/** @type {import('./$types').PageProps} */
let { data } = $props();
const page = $derived(data.page.fields);
const reviews = $derived(data.reviews);
const services = $derived(data.services);
const posts = $derived(data.posts);
</script>

<Hero title={page.header} image={getImageName(page.heroImage?.file.fileName)}
	  imageAlt={page.heroImage?.title} imagePositionClass="object-[100%_75%]">
	{@html page.intro}
</Hero>

<Section
	innerClasses="grid grid-cols-[repeat(auto-fill,minmax(--spacing(80),1fr))] gap-10 md:gap-20">
{#each reviews as review (review.meta.id)}
	<article>
		<h2 class="mb-1 font-semibold text-2xl">{review.fields.reviewer || "Anonymous"}</h2>
		<small class="block mb-2 text-base italic text-primary-darker"><strong
			class="font-semibold">{review.fields.age}
			year
			old
			{review.fields.nationality} client</strong> gave a
			<strong class="font-semibold text-nowrap">rating of {review.fields.rating}/10</strong>
		</small>
		<p class="prose">{@html review.fields.review}</p>
	</article>
{/each}
</Section>

{#if page.sections?.length}
	{#each page.sections as section, i (section.id)}
		<ContentSection prose size="lg" index={i} title={section.header || section.title}
						image={section.image}>
			{@html section.content}
		</ContentSection>
	{/each}
{:else}
	{#each page.contentSections as section, i}
		<ContentSection prose size="lg" index={i}>
			{@html section}
		</ContentSection>
	{/each}
{/if}

<TeaserSection items={posts} slug="blog" title="My latest insights"/>

{#if page.outro}
	<Outro image={page.outroImage}>
		{@html page.outro}
	</Outro>
{/if}

<TeaserSection items={services} slug="services" title="How I Can Support You"/>
