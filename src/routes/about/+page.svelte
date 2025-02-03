<script>
import ContentSection from "$layout/ContentSection.svelte";
import Hero from "$layout/Hero.svelte";

let { data } = $props();
let { header, intro, contentSections } = data.page.fields;
</script>

<Hero title={header}>
	{@html intro}
</Hero>

{#each contentSections as section}
	<ContentSection prose size="sm">
		{@html section}
	</ContentSection>
{/each}
