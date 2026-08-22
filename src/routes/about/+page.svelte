<script lang="ts">
import ContentSection from "$layout/ContentSection.svelte";
import Hero from "$layout/Hero.svelte";
import Outro from "$layout/Outro.svelte";
import TeaserSection from "$layout/TeaserSection.svelte";
import { getImageName } from "$lib/helpers/image.js";
import type { PageProps } from "./$types";

let { data }: PageProps = $props();
const page = $derived(data.page.fields);
const posts = $derived(data.posts);
</script>

<Hero title={page.header} image={getImageName(page.heroImage?.file.fileName)}
	  imageAlt={page.heroImage?.title} imagePositionClass="object-[100%_75%]">
	{@html page.intro}
</Hero>

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

{#if page.outro}
	<Outro image={page.outroImage}>
		{@html page.outro}
	</Outro>
{/if}

<TeaserSection items={posts} slug="blog" title="My latest insights"/>
