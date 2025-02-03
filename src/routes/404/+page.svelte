<script>
import ContentSection from "$layout/ContentSection.svelte";
import Hero from "$layout/Hero.svelte";
import Image from "$ui/image/Image.svelte";

let { data } = $props();
let { header, intro, contentSections } = data.page.fields;
</script>

<Hero title={header} proseClasses="">
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
