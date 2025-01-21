<script>
import { base } from "$app/paths";
import Hero from "$lib/components/layout/Hero.svelte";
import Section from "$lib/components/layout/Section.svelte";
import Image from "$lib/components/util/image/Image.svelte";

let { data } = $props();
let { header, intro, slug, posts } = data.local; // Destructure `posts` from `local`

/** @type {import("$lib/components/visuals/WaveSvg.type").WaveProps} */
const wave = {
	direction: "both",
	alignment: "left",
	color: "secondary-100",
	opacity: 1,
};

/** @param {string} image */
const getImageName = (image) => image.split(".")[0];
</script>

<Hero title={header}>
	{@html intro}
</Hero>

{#each posts as post, i}
	<Section
		classes={`px-8 ${i % 2 === 1 ? "py-10 my-14 bg-secondary-100 text-secondary-800" :
		"py-14"}`}
		{...(i % 2 === 1 ? { wave } : {})}
	>
		{@render teaser(post, i)}
	</Section>
{/each}

{#snippet teaser(
	/** @type {import("$lib/types/contentful").PostFields } */ post,
	/** @type {number} */ i
)}
	<a href={`${base}/${slug}/${post.slug}`}  class="group flex flex-wrap items-center gap-4">
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
		<div>
			<h2 class="mb-4 text-3xl font-bold">{post.title}</h2>
			<div class="prose prose-base">{@html post.intro}</div>
			<span
				class="inline-block mt-4 text-primary-700 hover:underline">Read more →</span>
		</div>
	</a>
{/snippet}
