<script>
import ContentSection from "$layout/ContentSection.svelte";
import Hero from "$layout/Hero.svelte";
import Outro from "$layout/Outro.svelte";
import TeaserSection from "$layout/TeaserSection.svelte";
import { getImageName } from "$lib/helpers/image.js";
import BookingDialog from "$ui/BookingDialog.svelte";

/** @type {import('./$types').PageProps} */
let { data } = $props();
const page = () => data.service.fields;
const services = () => data.services;
</script>

<Hero title={page().title} image={getImageName(page().heroImage?.file.fileName)}
	  imageAlt={page().heroImage?.title} imagePositionClass="object-[0%_25%]">
	{@html page().intro}
	{#snippet contentFooter()}
		<BookingDialog type="intake" ctaIcon="calendar" ctaSize="lg"/>
	{/snippet}
</Hero>

{#if page().sections?.length}
	{#each page().sections as section, i}
		<ContentSection prose size="md" index={i} title={section.header || section.title}
						image={section.image}>
			{@html section.content}
		</ContentSection>
	{/each}
{:else}
	{#each page().contentSections as section, i}
		<ContentSection prose size="md" index={i}>
			{@html section}
		</ContentSection>
	{/each}
{/if}

{#if page().outro}
	<Outro image={page().heroImage}>
		{@html page().outro}
	</Outro>
{/if}

<TeaserSection items={services()} slug="services" title="Discover my other services" />
