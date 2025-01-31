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
	color: "secondary-lighter",
	opacity: 1,
};
</script>

<Hero title={header}>
	{@html intro}
</Hero>

{#each posts as post, i}
	<Section wave={i % 2 === 1}>
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
				class="inline-block mt-4 font-semibold transition-colors hover:underline group-hover:text-accent-dark">Read more
				<span class="inline-block group-hover:animate-wiggle">→</span>
			</span>
		</div>
	</a>
{/snippet}
