<script>
import ContentSection from "$layout/ContentSection.svelte";
import Hero from "$layout/Hero.svelte";
import Outro from "$layout/Outro.svelte";
import TeaserSection from "$layout/TeaserSection.svelte";
import { getImageName } from "$lib/helpers/image.js";
import BookingDialog from "$ui/BookingDialog.svelte";

let { data } = $props();
let { title, intro, sections, contentSections, outro, heroImage } = $derived(data.service.fields);
let services = $derived(data.services);
</script>

<Hero {title} image={heroImage ? getImageName(heroImage.file.fileName) : undefined}
	  imageAlt={heroImage ? heroImage.title : undefined} imagePositionClass="object-[0%_25%]">
	{@html intro}
	{#snippet contentFooter()}
		<BookingDialog type="intake" ctaIcon="calendar" ctaSize="lg"/>
	{/snippet}
</Hero>

{#if sections?.length}
	{#each sections as section, i}
		<ContentSection prose size="md" index={i} title={section.header || section.title}
						image={section.image}>
			{@html section.content}
		</ContentSection>
	{/each}
{:else}
	{#each contentSections as section, i}
		<ContentSection prose size="md" index={i}>
			{@html section}
		</ContentSection>
	{/each}
{/if}

{#if outro}
	<Outro image={heroImage}>
		{@html outro}
	</Outro>
{/if}

<TeaserSection items={services} slug="services" title="Discover my other services" />
