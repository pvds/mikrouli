<script>
import ContentSection from "$layout/ContentSection.svelte";
import Hero from "$layout/Hero.svelte";

let { data } = $props();
let { title, intro, slug, contentSections } = data.service.fields;
</script>

<Hero {title} transitionName={slug}>
	{@html intro}
</Hero>

{#each contentSections as section}
	<ContentSection prose size="lg">
		{@html section}
	</ContentSection>
{/each}
