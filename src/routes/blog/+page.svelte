<script>
import { base } from "$app/paths";
import Hero from "$lib/components/layout/Hero.svelte";
import Section from "$lib/components/layout/Section.svelte";

let { data } = $props();
let { title, header, intro, slug, posts } = data.local; // Destructure `posts` from `local`
let { name } = data.global;

/** @type {import("$lib/components/visuals/Wave.svelte.type").Wave} */
const wave = {
	direction: "both",
	alignment: "left",
	color: "secondary-100",
	opacity: 1,
};
</script>

<svelte:head>
	<title>{title} - {name}</title>
	<meta name="description" content="" />
</svelte:head>

<Hero title={header}>
	{@html intro}
</Hero>

{#each posts as post, i}
	<Section
		classes={`px-8 py-14 ${i % 2 === 1 ? "my-14 bg-secondary-100 text-secondary-800" : ""}`}
		{...(i % 2 === 1 ? { wave } : {})}
	>
		<h2 class="mb-4 text-3xl font-bold">{post.title}</h2>
		<div class="prose-base">{@html post.intro}</div>
		<a href={`${base}/${slug}/${post.slug}`}
		   class="inline-block mt-4 text-primary-600 hover:underline">Read more →</a>
	</Section>
{/each}
