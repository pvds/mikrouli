<script>
import { base } from "$app/paths";
import Hero from "$layout/Hero.svelte";
import Section from "$layout/Section.svelte";
import ServiceSection from "$layout/ServiceSection.svelte";
import BookingDialog from "$ui/BookingDialog.svelte";

let { data } = $props();
let { header, intro, sections } = data.page.fields;
let services = data.services;
</script>

<Hero title={header}>
	{@html intro}
</Hero>

<ServiceSection {services}/>

{#each sections as section, i}
	<Section wave={i % 2 === 0}>
		<div class="prose prose-lg marker:text-accent-dark prose-strong:text-accent-dark
			prose-strong:font-bold prose-headings:text-3xl prose-headings:font-bold">
			{@html section}
		</div>
		{#if i === sections.length - 1}
			<div class="flex flex-wrap gap-4 mt-8">
				<BookingDialog type="intake"/>
				<a href={`${base}/contact`}
				   class="py-2 px-4 font-semibold transition-colors hover:underline group-hover:text-accent-dark">Get in contact</a>
			</div>
		{/if}
	</Section>
{/each}
