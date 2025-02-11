<script>
import ContentSection from "$layout/ContentSection.svelte";
import Hero from "$layout/Hero.svelte";
import HeroImage from "$layout/HeroImage.svelte";
import Outro from "$layout/Outro.svelte";
import { getImageName } from "$lib/helpers/image.js";

let { data } = $props();
let { title, intro, slug, contentSections, outro, heroImage } = data.service.fields;
</script>

{#if heroImage}
	<HeroImage title={title} image={getImageName(heroImage.file.fileName)} imageAlt={heroImage.title}
			   transitionName={slug} positionClass="object-[0%_25%]">
		{@html intro}
	</HeroImage>
{:else}
	<Hero {title} transitionName={slug}>
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
