<script>
import ContentSection from "$layout/ContentSection.svelte";
import Hero from "$layout/Hero.svelte";
import { getImageName } from "$lib/helpers/image.js";
import Image from "$ui/image/Image.svelte";

let { data } = $props();
let { header, intro, contentSections, heroImage } = data.page.fields;
</script>

<Hero title={header} proseClasses="" image={heroImage ? getImageName(heroImage.file.fileName) :
undefined}
	  imageAlt={heroImage ? heroImage.title : undefined} imagePositionClass="object-[100%_75%]">
	<div class="flex flex-col md:flex-row items-center">
		<div class="flex-1 prose prose-lg font-semibold">
			{@html intro}
		</div>
		<div class="flex-none w-xs flex items-center">
			<Image image="chair" alt="Armchair" sizes="20rem" priority={true} isLocal={true}/>
		</div>
	</div>
</Hero>

{#each contentSections as section}
	<ContentSection prose size="sm">
		{@html section}
	</ContentSection>
{/each}
