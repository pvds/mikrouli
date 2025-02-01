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
<article class="group flex flex-col gap-4">
	{#if service.heroImage}
		<Image
			image={getImageName(service.heroImage.file.fileName)}
			alt={service.heroImage.description}
			sizes="20rem"
			heightClass="h-[--spacing(48)]"
			{priority}
			classes="rounded-md not-group-hover:grayscale"
			isCMS={true}
		/>
	{/if}
	<div style="view-transition-name: {service.slug}">
		<h3 class="mb-4 text-2xl font-bold">{service.title}</h3>
		<div class="prose prose-base">{@html service.intro}</div>
		<a href={`${base}/services/${service.slug}`}
			class="inline-block mt-4 font-semibold transition-colors hover:underline group-hover:text-accent-dark">Read more
			<span class="inline-block group-hover:animate-wiggle-right">&rarr;</span>
		</a>
	</div>
</article>
