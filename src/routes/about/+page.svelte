<script>
import ContentSection from "$layout/ContentSection.svelte";
import Hero from "$layout/Hero.svelte";
import Outro from "$layout/Outro.svelte";
import TeaserSection from "$layout/TeaserSection.svelte";

let { data } = $props();
let { header, intro, contentSections, outro } = data.page.fields;
let posts = data.posts;
</script>

<Hero title={header}>
	{@html intro}
</Hero>

{#each contentSections as section, i}
	<ContentSection prose size="lg" index={i}>
		{@html section}
	</ContentSection>
{/each}

{#if outro}
	<Outro>{@html outro}</Outro>
{/if}

<TeaserSection items={posts} slug="blog" title="My latest insights"/>
