<script>
import ContentSection from "$layout/ContentSection.svelte";
import Hero from "$layout/Hero.svelte";
import Section from "$layout/Section.svelte";

let { data } = $props();
let { header, intro, contentSections } = data.page.fields;
let reviews = data.reviews;
</script>

<Hero title={header}>
	{@html intro}
</Hero>

<Section
	innerClasses="grid grid-cols-[repeat(auto-fill,minmax(--spacing(80),1fr))] gap-10 md:gap-20">
{#each reviews as review}
	<article>
		<h2 class="mb-1 font-semibold text-2xl">{review.fields.reviewer || "Anonymous"}</h2>
		<small class="block mb-2 text-base italic text-primary-darker"><strong
			class="font-semibold">{review.fields.age}
			year
			old
			{review.fields.nationality} client</strong> gave a
			<strong class="font-semibold text-nowrap">rating of {review.fields.rating}/10</strong>
		</small>
		<p class="prose">{@html review.fields.review}</p>
	</article>
{/each}
</Section>

{#each contentSections as section}
	<ContentSection prose size="sm" index={1} classes="mb-40">
		{@html section}
	</ContentSection>
{/each}
