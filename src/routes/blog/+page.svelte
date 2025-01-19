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
		classes={`px-8 py-14 ${i % 2 === 1 ? "my-14 bg-secondary-100 text-secondary-800" : ""}`}
		{...(i % 2 === 1 ? { wave } : {})}
	>
		<div class="flex items-center">
			{#if post.heroImage}
			<div class="mr-4">
				<Image
					image={getImageName(post.heroImage.file.fileName)}
					alt={post.heroImage.description}
					sizes="20rem"
					classes="rounded-md"
					isCMS={true}
				/>
			</div>
			{/if}
			<div>
				<h2 class="mb-4 text-3xl font-bold">{post.title}</h2>
				<div class="prose prose-base">{@html post.intro}</div>
				<a href={`${base}/${slug}/${post.slug}`}
				   class="inline-block mt-4 text-primary-700 hover:underline">Read more →</a>
			</div>
		</div>
	</Section>
{/each}
