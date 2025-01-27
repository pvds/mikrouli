<script>
import Hero from "$layout/Hero.svelte";
import Section from "$layout/Section.svelte";

let { data } = $props();
let { title, intro, slug, sections } = data.local;
</script>

<Hero title={title} transitionName={slug}>
	{@html intro}
</Hero>

{#each sections as section}
	<Section>
		<div class="prose prose-base">{@html section}</div>
	</Section>
{/each}

