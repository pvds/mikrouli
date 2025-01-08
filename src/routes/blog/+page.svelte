<script>
import Hero from "$lib/components/shell/Hero.svelte";
import Section from "$lib/components/shell/Section.svelte";

let { data } = $props();
let { title, longTitle, intro, posts } = data.local; // Destructure `posts` from `local`
let { name } = data.global;

/** @type {import("$lib/components/shell/Wave.svelte.type").Wave} */
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

<Hero title={longTitle}>
	{@html intro}
</Hero>

{#each posts as post, i}
	<Section
		classes={`px-8 py-14 ${i % 2 === 1 ? "my-14 bg-secondary-100 text-secondary-800" : ""}`}
		{...(i % 2 === 1 ? { wave } : {})}
	>
		<h2 class="mb-4 text-3xl font-bold">{post.title}</h2>
		<div class="prose-base">{@html post.intro}</div>
	</Section>
{/each}
