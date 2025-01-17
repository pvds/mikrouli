<script>
import Hero from "$lib/components/layout/Hero.svelte";
import Section from "$lib/components/layout/Section.svelte";

let { data } = $props();
let { header, intro, contentSections } = data.local;
</script>

<Hero title={header}>
	{@html intro}
</Hero>

{#each contentSections as section}
	<Section>
		<div class="prose prose-base">{@html section}</div>
	</Section>
{/each}
