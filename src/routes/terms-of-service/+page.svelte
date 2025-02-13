<script>
import { U_NBSP } from "$config";
import ContentSection from "$layout/ContentSection.svelte";
import Hero from "$layout/Hero.svelte";
import Outro from "$layout/Outro.svelte";
import { formatDate } from "$lib/helpers/date.js";
import { getImageName } from "$lib/helpers/image.js";
import { onMount } from "svelte";

let { data } = $props();
let { header, intro, sections, contentSections, outro, heroImage } = data.page.fields;
let { updatedAt } = data.page.meta;
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
		<ContentSection prose proseClasses="max-w-full!" index={i}>
			<h2 class="text-3xl font-bold">{section.title}</h2>
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
	<Outro>{@html outro}</Outro>
{/if}
