<script lang="ts">
import Hero from "$layout/Hero.svelte";
import Outro from "$layout/Outro.svelte";
import PageSections from "$layout/PageSections.svelte";
import Section from "$layout/Section.svelte";
import TeaserSection from "$layout/TeaserSection.svelte";
import { getImageName } from "$lib/helpers/image.js";
import BlogArticle from "$ui/BlogArticle.svelte";
import type { PageProps } from "./$types";

let { data }: PageProps = $props();
const page = $derived(data.page.fields);
const posts = $derived(data.posts);
const services = $derived(data.services);
</script>

<Hero title={page.header} image={getImageName(page.heroImage?.file.fileName)}
	  imageAlt={page.heroImage?.title} imagePositionClass="object-[100%_75%]">
	{@html page.intro}
</Hero>

{#each posts as post, i (post.fields.slug)}
	<Section wave={i % 2 === 1}>
		<BlogArticle post={post.fields} priority={i <= 3}/>
	</Section>
{/each}

<PageSections page={page} />

{#if page.outro}
	<Outro image={page.outroImage}>
		{@html page.outro}
	</Outro>
{/if}

<TeaserSection items={services} slug="services" title="How I Can Support You"/>
