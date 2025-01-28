<script>
import Hero from "$layout/Hero.svelte";
import Section from "$layout/Section.svelte";
import Image from "$ui/image/Image.svelte";

let { data } = $props();
let { header, intro, sections } = data.page.fields;
</script>

<Hero title={header} proseClasses="">
	<div class="flex flex-col md:flex-row items-center">
		<div class="flex-1 prose prose-lg font-semibold">
			{@html intro}
		</div>
		<div class="flex-none w-xs flex items-center">
			<Image image="chair" alt="Armchair" sizes="20rem" priority={true}/>
		</div>
	</div>
</Hero>


{#each sections as section}
	<Section>
		<div class="prose prose-base">{@html section}</div>
	</Section>
{/each}
