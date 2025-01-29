<script>
import { base } from "$app/paths";
import Hero from "$layout/Hero.svelte";
import Section from "$layout/Section.svelte";
import { getImageName } from "$lib/helpers/image.js";
import Image from "$ui/image/Image.svelte";

let { data } = $props();
let { header, intro, sections } = data.page.fields;
let services = data.services;

/** @type {import("$visuals/WaveSvg.type").WaveProps} */
const wave = {
	direction: "both",
	alignment: "left",
	color: "secondary-100",
	opacity: 1,
};
</script>

<Hero title={header}>
	{@html intro}
</Hero>

<Section>
	<div
		class="grid grid-cols-[repeat(auto-fill,minmax(--spacing(80),1fr))] gap-x-[min(5vw,--spacing(12))] gap-y-12">
{#each services as service, i}
		{@render teaser(service.fields, i)}
{/each}
	</div>
</Section>

{#each sections as section, i}
	<Section
		classes={`px-8 ${i % 2 === 0 ? "py-10 my-14 bg-secondary-100 text-secondary-800" :
		"py-14"}`}
		{...(i % 2 === 0 && { wave })}
	>
		<div class="prose prose-base">{@html section}</div>
	</Section>
{/each}

{#snippet teaser(
	/** @type {import("$types/contentful").ServiceFields } */ service,
	/** @type {number} */ i
)}
	<a href={`${base}/services/${service.slug}`}
	   class="group flex flex-col gap-4">
		{#if service.heroImage}
			<Image
				image={getImageName(service.heroImage.file.fileName)}
				alt={service.heroImage.description}
				aspectRatio={`${service.heroImage.file.details.image.width}/
					${service.heroImage.file.details.image.height}`}
				sizes="20rem"
				heightClass="h-[--spacing(48)]"
				priority={(i <= 1)}
				classes="rounded-md not-group-hover:grayscale"
				isCMS={true}
			/>
		{/if}
		<div style="view-transition-name: {service.slug}">
			<h2 class="mb-4 text-3xl font-bold">{service.title}</h2>
			<div class="prose prose-base">{@html service.intro}</div>
			<span
				class="inline-block mt-4 font-semibold transition-colors hover:underline group-hover:text-accent-600">Read more
				<span class="inline-block group-hover:animate-wiggle">→</span>
			</span>
		</div>
	</a>
{/snippet}
