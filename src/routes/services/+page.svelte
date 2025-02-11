<script>
import ContentSection from "$layout/ContentSection.svelte";
import Hero from "$layout/Hero.svelte";
import Outro from "$layout/Outro.svelte";
import TeaserSection from "$layout/TeaserSection.svelte";

let { data } = $props();
let { header, intro, contentSections, outro } = data.page.fields;
let services = data.services;
let posts = data.posts;
</script>

<Hero title={header}>
	{@html intro}
</Hero>

{#each contentSections as section}
	<ContentSection prose size="lg">
		{@html section}
	</ContentSection>
{/each}

<TeaserSection items={services} slug="services" title="How I Can Support You"/>

{#if outro}
	<Outro>{@html outro}</Outro>
{/if}

<TeaserSection items={posts} slug="blog" title="My latest insights"/>
