<script>
import ContentSection from "$layout/ContentSection.svelte";
import Hero from "$layout/Hero.svelte";
import Outro from "$layout/Outro.svelte";
import { getImageName } from "$lib/helpers/image.js";
import Image from "$ui/image/Image.svelte";

let { data } = $props();
let { header, intro, sections, contentSections, heroImage, outro, outroImage } = data.page.fields;
</script>

<Hero title={header} proseClasses=" " image={heroImage ? getImageName(heroImage.file.fileName) :
undefined}
	  imageAlt={heroImage ? heroImage.title : undefined} imagePositionClass="object-[100%_75%]">
	<div class="flex flex-col md:flex-row items-center">
		<div class="flex-1 prose prose-lg marker:text-accent-dark font-semibold">
			{@html intro}
		</div>
		<div class="flex-none w-xs flex items-center">
			<Image image="chair" alt="Armchair" sizes="20rem" priority={true} isLocal={true}/>
		</div>
	</div>
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
