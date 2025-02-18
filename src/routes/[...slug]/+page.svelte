<script>
import { U_NBSP } from "$config";
import ContentSection from "$layout/ContentSection.svelte";
import Hero from "$layout/Hero.svelte";
import Outro from "$layout/Outro.svelte";
import TeaserSection from "$layout/TeaserSection.svelte";
import { formatDate } from "$lib/helpers/date.js";
import { getImageName } from "$lib/helpers/image.js";
import { onMount } from "svelte";

let { data } = $props();
let { header, intro, sections, contentSections, outro, heroImage, outroImage } = $derived(
	data.page.fields,
);
let { updatedAt } = $derived(data.page.meta);
let services = $derived(data.services);
let updated = $state(U_NBSP);

onMount(() => {
	updated = `Last updated on ${formatDate(updatedAt)}`;
});
</script>

<Hero title={header} image={heroImage ? getImageName(heroImage.file.fileName) : undefined}
	  imageAlt={heroImage ? heroImage.title : undefined} imagePositionClass="object-[100%_75%]">
	{@html intro}
	<p class="mt-4 text-base italic">
		{updated}
	</p>
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
		<ContentSection prose proseClasses="max-w-full!" index={i}>
			{@html section}
		</ContentSection>
	{/each}
{/if}

{#if outro}
	<Outro image={outroImage}>
		{@html outro}
	</Outro>
{/if}

<TeaserSection items={services} slug="services" title="How I Can Support You"/>
