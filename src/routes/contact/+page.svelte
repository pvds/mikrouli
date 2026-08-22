<script>
import ContentSection from "$layout/ContentSection.svelte";
import Hero from "$layout/Hero.svelte";
import Outro from "$layout/Outro.svelte";
import TeaserSection from "$layout/TeaserSection.svelte";
import { getImageName } from "$lib/helpers/image.js";
import BookingDialog from "$ui/BookingDialog.svelte";

let { data } = $props();
const page = () => data.page.fields;
const posts = () => data.posts;
</script>

<Hero title={page().header} image={getImageName(page().heroImage?.file.fileName)}
	  imageAlt={page().heroImage?.title} imagePositionClass="object-[100%_75%]">
	{@html page().intro}
</Hero>

{#if page().sections?.length}
	{#each page().sections as section, i}
		<ContentSection contentFooter={i === 0 ? /** @type {import("svelte").Snippet<[]>} */
		(footerCta) : undefined} prose size="lg" index={i}
						title={section.header || section.title} image={section.image}>
			{@html section.content}
		</ContentSection>
	{/each}
{:else}
	{#each page().contentSections as section, i}
		<ContentSection contentFooter={i === 0 ? /** @type {import("svelte").Snippet<[]>} */
		(footerCta) : undefined} prose size="lg" index={i}>
			{@html section}
		</ContentSection>
	{/each}
{/if}

{#snippet footerCta()}
	<div class="flex flex-wrap gap-2 mt-6">
		<BookingDialog type="intake" ctaIcon="calendar" />
		<BookingDialog type="session" ctaTheme="secondary" ctaIcon="calendar" />
	</div>
{/snippet}

{#if page().outro}
	<Outro image={page().outroImage}>
		{@html page().outro}
	</Outro>
{/if}

<TeaserSection items={posts()} slug="blog" title="My latest insights"/>
