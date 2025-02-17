<script>
import ContentSection from "$layout/ContentSection.svelte";
import Hero from "$layout/Hero.svelte";
import Outro from "$layout/Outro.svelte";
import TeaserSection from "$layout/TeaserSection.svelte";
import { getImageName } from "$lib/helpers/image.js";

let { data } = $props();
let { title, intro, contentSections, outro, heroImage } = $derived(data.service.fields);
let services = $derived(data.services);
</script>

<Hero {title} image={heroImage ? getImageName(heroImage.file.fileName) : undefined}
	  imageAlt={heroImage ? heroImage.title : undefined} imagePositionClass="object-[0%_25%]">
	{@html intro}
</Hero>

{#each contentSections as section, i}
	<ContentSection prose size="lg" index={i}>
		{@html section}
	</ContentSection>
{/each}

{#if outro}
	<Outro image={heroImage}>
		{@html outro}
	</Outro>
{/if}

<TeaserSection items={services} slug="services" title="Discover my other services" />
