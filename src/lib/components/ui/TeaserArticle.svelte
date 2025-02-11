<script>
import { base } from "$app/paths";
import { getImageName } from "../../helpers/image.js";
import Image from "./image/Image.svelte";

/**
 * @typedef {import("$types/contentful").ServiceFields } ServiceFields
 * @typedef {import("$types/contentful").PostFields } PostFields
 * @typedef {Object} Props
 * @property {ServiceFields|PostFields} item
 * @property {string} slug
 * @property {boolean} [priority=false]
 */

/** @type {Props} */
let { item, slug, priority = false } = $props();
</script>
<article class="group relative flex flex-col gap-4">
	{#if item.heroImage}
		<Image
			image={getImageName(item.heroImage.file.fileName)}
			alt={item.heroImage.description}
			sizes="(max-width: 40em) 80vw, (max-width: 64em) 40vw, 22rem"
			heightClass="h-[12rem]"
			positionClass="object-[50%_25%]"
			{priority}
			classes="rounded-md not-group-hover:grayscale"
		/>
	{/if}
	<div style="view-transition-name: {item.slug}">
		<h3 class="mb-4 text-2xl font-bold">{item.title}</h3>
		<div class="prose prose-base">{@html item.intro}</div>
		<a href={`${base}/${slug}/${item.slug}`}
			class="inline-block mt-4 font-semibold transition-all hover:underline group-hover:text-accent-dark
					after:content[''] after:absolute after:inset-0">Read more
			<span class="inline-block group-hover:animate-wiggle-right">&rarr;</span>
		</a>
	</div>
</article>
