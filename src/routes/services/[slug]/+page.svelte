<script>
import Hero from "$layout/Hero.svelte";
import Section from "$layout/Section.svelte";

let { data } = $props();
let { title, intro, slug, sections } = data.service.fields;
</script>

<Hero {title} transitionName={slug}>
	{@html intro}
</Hero>

{#each sections as section}
	<Section innerClasses="prose prose-base">
		{@html section}
	</Section>
{/each}

