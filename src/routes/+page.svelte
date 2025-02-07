<script>
import { base } from "$app/paths";
import ContentSection from "$layout/ContentSection.svelte";
import Hero from "$layout/Hero.svelte";
import ServicesSection from "$layout/ServicesSection.svelte";
import BookingDialog from "$ui/BookingDialog.svelte";

let { data } = $props();
let { header, intro, sections } = data.page.fields;
let services = data.services;
</script>

<Hero title={header}>
	{@html intro}
</Hero>

<ServicesSection {services}/>

{#if sections}
	{#each sections as section, i}
		<ContentSection footer={i === sections.length - 1 ? footerCta : undefined} index={i}
						wave="even" size="lg" prose>
				<h2 class="text-3xl font-bold">{section.title}</h2>
			{@html section.content}
		</ContentSection>
	{/each}
{/if}

{#snippet footerCta()}
	<div class="flex flex-wrap gap-4 mt-8">
		<BookingDialog type="intake"/>
		<a href={`${base}/contact`}
		   class="py-2 px-4 font-semibold transition-colors hover:underline group-hover:text-accent-dark">Get in contact</a>
	</div>
{/snippet}

