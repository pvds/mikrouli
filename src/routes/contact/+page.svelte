<script lang="ts">
import Hero from "$layout/Hero.svelte";
import Outro from "$layout/Outro.svelte";
import PageSections from "$layout/PageSections.svelte";
import TeaserSection from "$layout/TeaserSection.svelte";
import { getImageName } from "$lib/helpers/image.js";
import BookingDialog from "$ui/BookingDialog.svelte";
import type { PageProps } from "./$types";

let { data }: PageProps = $props();
const page = $derived(data.page.fields);
const posts = $derived(data.posts);
</script>

<Hero title={page.header} image={getImageName(page.heroImage?.file.fileName)}
	  imageAlt={page.heroImage?.title} imagePositionClass="object-[100%_75%]">
	{@html page.intro}
</Hero>

<PageSections page={page} contentFooter={footerCta} firstSectionOnly />

{#snippet footerCta()}
	<div class="flex flex-wrap gap-2 mt-6">
		<BookingDialog type="intake" ctaIcon="calendar" />
		<BookingDialog type="session" ctaTheme="secondary" ctaIcon="calendar" />
	</div>
{/snippet}

{#if page.outro}
	<Outro image={page.outroImage}>
		{@html page.outro}
	</Outro>
{/if}

<TeaserSection items={posts} slug="blog" title="My latest insights"/>
