<script>
import ContentSection from "$layout/ContentSection.svelte";
import Hero from "$layout/Hero.svelte";

let { data } = $props();
let { header, intro, sections } = data.page.fields;
</script>

<Hero title={header}>
	{@html intro}
</Hero>

{#each sections as section}
	<ContentSection prose size="sm">
		{@html section}
	</ContentSection>
{/each}
