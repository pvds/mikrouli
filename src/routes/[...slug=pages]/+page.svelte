<script>
import { onMount } from "svelte";
import { U_NBSP } from "$config";
import ContentSection from "$layout/ContentSection.svelte";
import Hero from "$layout/Hero.svelte";
import Outro from "$layout/Outro.svelte";
import TeaserSection from "$layout/TeaserSection.svelte";
import { formatDate } from "$lib/helpers/date.js";
import { getImageName } from "$lib/helpers/image.js";

/** @type {import('./$types').PageProps} */
let { data } = $props();
const page = $derived(data.page.fields);
const meta = $derived(data.page.meta);
const services = $derived(data.services);
let updated = $state(U_NBSP);

onMount(() => {
	updated = `Last updated on ${formatDate(meta.updatedAt)}`;
});
</script>

<Hero title={page.header} image={getImageName(page.heroImage?.file.fileName)}
	  imageAlt={page.heroImage?.title} imagePositionClass="object-[100%_75%]">
	{@html page.intro}
	<p class="mt-4 text-base italic">
		{updated}
	</p>
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
		<ContentSection prose proseClasses="max-w-full!" index={i}>
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
