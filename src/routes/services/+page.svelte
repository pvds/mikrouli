<script>
import ContentSection from "$layout/ContentSection.svelte";
import Hero from "$layout/Hero.svelte";
import Outro from "$layout/Outro.svelte";
import ServicesSection from "$layout/ServicesSection.svelte";

let { data } = $props();
let { header, intro, contentSections, outro } = data.page.fields;
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

{#if outro}
	<Outro>{@html outro}</Outro>
{/if}
