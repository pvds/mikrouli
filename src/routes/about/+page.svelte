<script>
import Hero from "$layout/Hero.svelte";
import Section from "$layout/Section.svelte";

let { data } = $props();
let { header, intro, sections } = data.page.fields;
</script>

<Hero title={header}>
	{@html intro}
</Hero>

{#each sections as section}
	<Section>
		<div class="prose prose-base">{@html section}</div>
	</Section>
{/each}
