<script>
import { base } from "$app/paths";
import { getImageName } from "../../helpers/image.js";
import Image from "./image/Image.svelte";

/**
 * @typedef {import("$types/contentful").PostFields } PostFields
 * @typedef {Object} Props
 * @property {PostFields} post
 * @property {boolean} [priority=false]
 */

/** @type {Props} */
let { post, priority = false } = $props();
</script>
<article
	class="group relative flex flex-wrap items-center gap-4">
	{#if post.heroImage}
		<div class="flex-none min-w-[20rem]">
			<Image
				image={getImageName(post.heroImage.file.fileName)}
				alt={post.heroImage.description}
				sizes="20rem"
				{priority}
				classes="rounded-md not-group-hover:grayscale"
			/>
		</div>
	{/if}
	<div style="view-transition-name: {post.slug}">
		<h2 class="mb-4 text-3xl font-bold">{post.title}</h2>
		<div class="prose prose-base">{@html post.intro}</div>
		<a href={`${base}/blog/${post.slug}`}
		   class="inline-block mt-4 font-semibold transition-all hover:underline group-hover:text-accent-dark after:content[''] after:absolute after:inset-0">Read more
			<span class="inline-block group-hover:animate-wiggle-right">→</span>
		</a>
	</div>
</article>
