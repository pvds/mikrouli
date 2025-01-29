<script>
import { base } from "$app/paths";
import Hero from "$layout/Hero.svelte";
import Section from "$layout/Section.svelte";
import { getImageName } from "$lib/helpers/image";
import Image from "$ui/image/Image.svelte";

let { data } = $props();
let { header, intro, slug } = data.page.fields; // Destructure `posts` from `local`
let posts = data.posts;

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

{#each posts as post, i}
	<Section
		classes={`px-8 ${i % 2 === 1 ? "py-10 my-14 bg-secondary-100 text-secondary-800" :
		"py-14"}`}
		{...(i % 2 === 1 && { wave })}
	>
		{@render teaser(post.fields, i)}
	</Section>
{/each}

{#snippet teaser(
	/** @type {import("$types/contentful").PostFields } */ post,
	/** @type {number} */ i
)}
	<a href={`${base}/${slug}/${post.slug}`}
	   class="group flex flex-wrap items-center gap-4">
		{#if post.heroImage}
			<div class="flex-none min-w-[20rem]">
				<Image
					image={getImageName(post.heroImage.file.fileName)}
					aspectRatio={`${post.heroImage.file.details.image.width}/
					${post.heroImage.file.details.image.height}`}
					alt={post.heroImage.description}
					sizes="20rem"
					priority={(i <= 1)}
					classes="rounded-md not-group-hover:grayscale"
					isCMS={true}
				/>
			</div>
		{/if}
		<div style="view-transition-name: {post.slug}">
			<h2 class="mb-4 text-3xl font-bold">{post.title}</h2>
			<div class="prose prose-base">{@html post.intro}</div>
			<span
				class="inline-block mt-4 font-semibold transition-colors hover:underline group-hover:text-accent-600">Read more
				<span class="inline-block group-hover:animate-wiggle">→</span>
			</span>
		</div>
	</a>
{/snippet}
