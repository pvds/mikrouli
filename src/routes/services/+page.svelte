<script>
import ContentSection from "$layout/ContentSection.svelte";
import Hero from "$layout/Hero.svelte";
import ServicesSection from "$layout/ServicesSection.svelte";

let { data } = $props();
let { header, intro, contentSections } = data.page.fields;
let services = data.services;
</script>

<Hero title={header}>
	{@html intro}
</Hero>

{#each contentSections as section}
	<ContentSection prose>
		{@html section}
	</ContentSection>
{/each}


<ServicesSection {services}/>
