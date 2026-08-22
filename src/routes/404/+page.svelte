<script lang="ts">
import ContentSection from "$layout/ContentSection.svelte";
import Hero from "$layout/Hero.svelte";
import Outro from "$layout/Outro.svelte";
import { getImageName } from "$lib/helpers/image.js";
import Image from "$ui/image/Image.svelte";
import type { PageProps } from "./$types";

let { data }: PageProps = $props();
const page = $derived(data.page.fields);
</script>

<Hero title={page.header} proseClasses=" " image={getImageName(page.heroImage?.file.fileName)}
	  imageAlt={page.heroImage?.title} imagePositionClass="object-[100%_75%]">
	<div class="flex flex-col md:flex-row items-center">
		<div class="flex-1 prose prose-lg marker:text-accent-dark font-semibold">
			{@html page.intro}
		</div>
		<div class="flex-none w-xs flex items-center">
			<Image image="chair" alt="Armchair" sizes="20rem" priority={true} isLocal={true}/>
		</div>
	</div>
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
