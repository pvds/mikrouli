<script>
import ContentSection from "$layout/ContentSection.svelte";
import Hero from "$layout/Hero.svelte";
import HeroImage from "$layout/HeroImage.svelte";
import Outro from "$layout/Outro.svelte";
import TeaserSection from "$layout/TeaserSection.svelte";
import { getImageName } from "$lib/helpers/image.js";

let { data } = $props();
let { header, intro, contentSections, outro, heroImage } = data.page.fields;
let posts = data.posts;
</script>

{#if heroImage}
	<HeroImage title={header} image={getImageName(heroImage.file.fileName)}
			   imageAlt={heroImage.title} positionClass="object-[100%_75%]">
		{@html intro}
	</HeroImage>
{:else}
	<Hero title={header} >
		{@html intro}
	</Hero>
{/if}

{#each contentSections as section, i}
	<ContentSection prose size="lg" index={i}>
		{@html section}
	</ContentSection>
{/each}

{#if outro}
	<Outro>{@html outro}</Outro>
{/if}

<TeaserSection items={posts} slug="blog" title="My latest insights"/>
