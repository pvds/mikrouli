<script>
import { base } from "$app/paths";
import { getImageName } from "../../helpers/image.js";
import Image from "./image/Image.svelte";

/**
 * @typedef {import("$types/contentful").ServiceFields } ServiceFields
 * @typedef {Object} Props
 * @property {ServiceFields} service
 * @property {boolean} [priority=false]
 */

/** @type {Props} */
let { service, priority = false } = $props();
</script>
<article class="group relative flex flex-col gap-4">
	{#if service.heroImage}
		<Image
			image={getImageName(service.heroImage.file.fileName)}
			alt={service.heroImage.description}
			sizes="(max-width: 40em) 100vw, (max-width: 64em) 50vw, 22rem"
			heightClass="h-[12rem]"
			{priority}
			classes="rounded-md not-group-hover:grayscale"
		/>
	{/if}
	<div style="view-transition-name: {service.slug}">
		<h3 class="mb-4 text-2xl font-bold">{service.title}</h3>
		<div class="prose prose-base">{@html service.intro}</div>
		<a href={`${base}/services/${service.slug}`}
			class="inline-block mt-4 font-semibold transition-all hover:underline group-hover:text-accent-dark
					after:content[''] after:absolute after:inset-0">Read more
			<span class="inline-block group-hover:animate-wiggle-right">&rarr;</span>
		</a>
	</div>
</article>
