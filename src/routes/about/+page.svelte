<script>
import ContentSection from "$layout/ContentSection.svelte";
import Hero from "$layout/Hero.svelte";
import Outro from "$layout/Outro.svelte";
import TeaserSection from "$layout/TeaserSection.svelte";
import { getImageName } from "$lib/helpers/image.js";

let { data } = $props();
let { header, intro, sections, contentSections, outro, heroImage, outroImage } =
	data.page.fields;
let posts = data.posts;
</script>

<Hero title={header} image={heroImage ? getImageName(heroImage.file.fileName) : undefined}
	  imageAlt={heroImage ? heroImage.title : undefined} imagePositionClass="object-[100%_75%]">
	{@html intro}
</Hero>

{#if sections?.length}
	{#each sections as section, i}
		<ContentSection prose size="lg" index={i} title={section.header || section.title}
						image={section.image}>
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

{#if outro}
	<Outro image={outroImage}>
		{@html outro}
	</Outro>
{/if}

<TeaserSection items={posts} slug="blog" title="My latest insights"/>
