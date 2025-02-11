<script>
import ContentSection from "$layout/ContentSection.svelte";
import Hero from "$layout/Hero.svelte";
import Outro from "$layout/Outro.svelte";
import Section from "$layout/Section.svelte";
import TeaserSection from "$layout/TeaserSection.svelte";
import { getImageName } from "$lib/helpers/image.js";
import BlogArticle from "$ui/BlogArticle.svelte";

let { data } = $props();
let { header, intro, contentSections, outro, heroImage } = data.page.fields;
let posts = data.posts;
let services = data.services;
</script>

<Hero title={header} image={heroImage ? getImageName(heroImage.file.fileName) : undefined}
	  imageAlt={heroImage ? heroImage.title : undefined} imagePositionClass="object-[100%_75%]">
	{@html intro}
</Hero>

{#each contentSections as section}
	<ContentSection prose size="lg">
		{@html section}
	</ContentSection>
{/each}

{#each posts as post, i}
	<Section wave={i % 2 === 0} theme={i % 2 === 0 ? "primary" : "default"}>
		<BlogArticle post={post.fields} priority={i <= 3}/>
	</Section>
{/each}

{#if outro}
	<Outro>{@html outro}</Outro>
{/if}

<TeaserSection items={services} slug="services" title="How I Can Support You"/>
