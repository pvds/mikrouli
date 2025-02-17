<script>
import ContentSection from "$layout/ContentSection.svelte";
import Hero from "$layout/Hero.svelte";
import Outro from "$layout/Outro.svelte";
import TeaserSection from "$layout/TeaserSection.svelte";
import { getImageName } from "$lib/helpers/image.js";
import BookingDialog from "$ui/BookingDialog.svelte";

let { data } = $props();
let { header, intro, sections, contentSections, outro, heroImage } = data.page.fields;
let posts = data.posts;
</script>

<Hero title={header} image={heroImage ? getImageName(heroImage.file.fileName) : undefined}
	  imageAlt={heroImage ? heroImage.title : undefined} imagePositionClass="object-[100%_75%]">
	{@html intro}
</Hero>

{#if sections?.length}
	{#each sections as section, i}
		<ContentSection footer={i === 0 ? footerCta : undefined} prose size="lg" index={i} title={section.title}>
			{@html section.content}
		</ContentSection>
	{/each}
{:else}
	{#each contentSections as section, i}
		<ContentSection footer={i === 0 ? footerCta : undefined} prose size="lg" index={i}>
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

{#if outro}
	<Outro>{@html outro}</Outro>
{/if}

<TeaserSection items={posts} slug="blog" title="My latest insights"/>
