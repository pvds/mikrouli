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
	class="group relative flex flex-col md:flex-row items-center gap-4">
	{#if post.heroImage}
		<div class="flex-none w-full md:w-[16rem] md-mid:w-[20rem]">
			<Image
				image={getImageName(post.heroImage.file.fileName)}
				alt={post.heroImage.description}
				sizes="(max-width: 48em) 80vw, (max-width: 56em) 16rem, (max-width: 64em) 20rem"
				heightClass="h-[12rem]"
				{priority}
				classes="rounded-md not-group-hover:grayscale"
			/>
		</div>
	{/if}
	<div style="view-transition-name: {post.slug}">
		<h2 class="mb-4 text-3xl font-bold">{post.title}</h2>
		<div class="prose prose-base">{@html post.intro}</div>
		<a href={`${base}/blog/${post.slug}`}
		   class="inline-block mt-2 font-semibold transition-all hover:underline group-hover:text-accent-dark after:content[''] after:absolute after:inset-0">Read more
			<span class="inline-block group-hover:animate-wiggle-right">→</span>
		</a>
	</div>
</article>
