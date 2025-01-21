<script>
import Hero from "$lib/components/layout/Hero.svelte";
import Section from "$lib/components/layout/Section.svelte";

let { data } = $props();
let { title, intro, slug, sections } = data.local;
</script>

<div style="view-transition-name: {slug}">

<Hero {title}>
	{@html intro}
</Hero>

{#each sections as section}
	<Section>
		<div class="prose prose-base">{@html section}</div>
	</Section>
{/each}

</div>
