<script>
import { base } from "$app/paths";
import Hero from "$layout/Hero.svelte";
import Section from "$layout/Section.svelte";
import { getImageName } from "$lib/helpers/image.js";
import Image from "$ui/image/Image.svelte";

let { data } = $props();
let { header, intro, sections } = data.page.fields;
let services = data.services;
</script>

<Hero title={header}>
	{@html intro}
</Hero>

{#each services as service, i}
	<Section>
		{@render teaser(service.fields, i)}
	</Section>
{/each}

{#each sections as section}
	<Section>
		<div class="prose prose-base">{@html section}</div>
	</Section>
{/each}

{#snippet teaser(
	/** @type {import("$types/contentful").ServiceFields } */ service,
	/** @type {number} */ i
)}
	<a href={`${base}/services/${service.slug}`}
	   class="group flex flex-wrap items-center gap-4">
		{#if service.heroImage}
			<div class="flex-none min-w-[20rem]">
				<Image
					image={getImageName(service.heroImage.file.fileName)}
					aspectRatio={`${service.heroImage.file.details.image.width}/
					${service.heroImage.file.details.image.height}`}
					alt={service.heroImage.description}
					sizes="20rem"
					priority={(i <= 1)}
					classes="rounded-md not-group-hover:grayscale"
					isCMS={true}
				/>
			</div>
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
