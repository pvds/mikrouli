<script lang="ts">
import Hero from "$layout/Hero.svelte";
import Outro from "$layout/Outro.svelte";
import PageSections from "$layout/PageSections.svelte";
import TeaserSection from "$layout/TeaserSection.svelte";
import { getImageName } from "$lib/helpers/image.js";
import BookingDialog from "$ui/BookingDialog.svelte";
import type { PageProps } from "./$types";

let { data }: PageProps = $props();
const page = $derived(data.service.fields);
const services = $derived(data.services);
</script>

<Hero title={page.title} image={getImageName(page.heroImage?.file.fileName)}
	  imageAlt={page.heroImage?.title} imagePositionClass="object-[0%_25%]">
	{@html page.intro}
	{#snippet contentFooter()}
		<BookingDialog type="intake" ctaIcon="calendar" ctaSize="lg"/>
	{/snippet}
</Hero>

<PageSections page={page} size="md" />

{#if page.outro}
	<Outro image={page.heroImage}>
		{@html page.outro}
	</Outro>
{/if}

<TeaserSection items={services} slug="services" title="Discover my other services" />
