<script>
import ContentSection from "$layout/ContentSection.svelte";
import Hero from "$layout/Hero.svelte";
import Outro from "$layout/Outro.svelte";
import Section from "$layout/Section.svelte";
import TeaserSection from "$layout/TeaserSection.svelte";
import { getImageName } from "$lib/helpers/image.js";
import BlogArticle from "$ui/BlogArticle.svelte";

/** @type {import('./$types').PageProps} */
let { data } = $props();
const page = $derived(data.page.fields);
const posts = $derived(data.posts);
const services = $derived(data.services);
</script>

<Hero title={page.header} image={getImageName(page.heroImage?.file.fileName)}
	  imageAlt={page.heroImage?.title} imagePositionClass="object-[100%_75%]">
	{@html page.intro}
</Hero>

{#each posts as post, i}
	<Section wave={i % 2 === 1}>
		<BlogArticle post={post.fields} priority={i <= 3}/>
	</Section>
{/each}

{#if page.sections?.length}
	{#each page.sections as section, i}
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

{#if page.outro}
	<Outro image={page.outroImage}>
		{@html page.outro}
	</Outro>
{/if}

<TeaserSection items={services} slug="services" title="How I Can Support You"/>
