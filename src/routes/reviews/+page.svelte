<script>
import ContentSection from "$layout/ContentSection.svelte";
import Hero from "$layout/Hero.svelte";
import Section from "$layout/Section.svelte";
import TeaserSection from "$layout/TeaserSection.svelte";
import { getImageName } from "$lib/helpers/image.js";

let { data } = $props();
let { header, intro, sections, contentSections, heroImage } = data.page.fields;
let reviews = data.reviews;
let posts = data.posts;
</script>

<Hero title={header} image={heroImage ? getImageName(heroImage.file.fileName) : undefined}
	  imageAlt={heroImage ? heroImage.title : undefined} imagePositionClass="object-[100%_75%]">
	{@html intro}
</Hero>

<Section
	innerClasses="grid grid-cols-[repeat(auto-fill,minmax(--spacing(80),1fr))] gap-10 md:gap-20">
{#each reviews as review}
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

{#if sections?.length}
	{#each sections as section, i}
		<ContentSection prose size="lg" index={i}>
			<h2 class="text-3xl font-bold">{section.title}</h2>
			{@html section.content}
		</ContentSection>
	{/each}
{:else}
	{#each contentSections as section, i}
		<ContentSection prose size="lg" index={i}>
			{@html section}
		</ContentSection>
	{/each}
{/if}

<TeaserSection items={posts} slug="blog" title="My latest insights"/>
