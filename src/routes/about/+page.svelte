<script>
import Hero from "$lib/components/layout/Hero.svelte";
import Section from "$lib/components/layout/Section.svelte";

let { data } = $props();
let { header, intro, sections } = data.local;
</script>

<Hero title={header}>
	{@html intro}
</Hero>
 
{#each sections as section}
	<Section>
		{#if section.header}
			<h2 class="mb-4 text-3xl font-bold">{section.header}</h2>
		{/if}
		<div class="prose prose-base">{@html section.content}</div>
	</Section>
{/each}
