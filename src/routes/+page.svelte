<script>
import { base } from "$app/paths";
import { BUTTON_THEME } from "$config";
import ContentSection from "$layout/ContentSection.svelte";
import Hero from "$layout/Hero.svelte";
import TeaserSection from "$layout/TeaserSection.svelte";
import { svgIcon } from "$lib/helpers/icon";
import { getImageName } from "$lib/helpers/image.js";
import BookingDialog from "$ui/BookingDialog.svelte";
import Image from "$ui/image/Image.svelte";

let { data } = $props();
let { header, intro, sections, contentSections, heroImage } = data.page.fields;
let services = data.services;
let posts = data.posts;

/** @param {number} i */
const isLastSection = (i) => sections && i === sections.length - 1;
</script>

<Hero title={header} image={heroImage ? getImageName(heroImage.file.fileName) : undefined}
	  imageAlt={heroImage ? heroImage.title : undefined} imagePositionClass="object-[100%_75%]" sideAbsolute>
	{@html intro}
	{#snippet side()}
	<a href={`${base}/about`} aria-label="Learn more about me"
	   class="block w-[clamp(10rem,50vw,15rem)] mx-auto">
		<Image image="eleni-papamikrouli"
			   sizes="max-width(48em) clamp(10rem,50vw,15rem),min(20rem,25vw)"
			   isLocal
			   priority
			   alt="Portrait of Eleni Papamikrouli"
			   widthClass="w-[clamp(10rem,50vw,15rem)] md:w-[min(20rem,25vw)]"
			   classes="translate-z-0 drop-shadow-[0_0_48px_rgba(24,68,70,.6)]" />
	</a>
	{/snippet}
</Hero>

<TeaserSection items={services} priority slug="services" title="How I Can Support You"/>

{#if sections?.length}
	{#each sections as section, i}
	<ContentSection footer={isLastSection(i) ? footerCta : undefined} index={i}
					wave="even" size="lg" theme={isLastSection(i) ? "primaryDark" : "default"}
					prose proseInvert={isLastSection(i)}
					image={section.image} title={section.title}>
		{@html section.content}
	</ContentSection>
	{/each}
{:else}
	{#each contentSections as section, i}
	<ContentSection prose size="lg" index={i} wave="even">
		{@html section}
	</ContentSection>
	{/each}
{/if}

{#snippet footerCta()}
	<div class="flex flex-wrap gap-4 mt-8">
		<BookingDialog type="intake" ctaIcon="calendar"/>
		<a href={`${base}/contact`}
		   class="group py-2 px-4 font-semibold transition-colors {BUTTON_THEME.secondary}">Get in
			contact{@html svgIcon("internal")}</a>
	</div>
{/snippet}

<TeaserSection items={posts} slug="blog" title="My latest insights"/>

