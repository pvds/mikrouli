<script>
import Hero from "$lib/components/layout/Hero.svelte";
import Section from "$lib/components/layout/Section.svelte";

let { data } = $props();
let { title, header, intro, sections } = data.local;
let { name } = data.global;
</script>

<svelte:head>
	<title>{title} - {name}</title>
	<meta name="description" content="" />
</svelte:head>

<Hero title={header}>
	{@html intro}
</Hero>

{#each sections as section}
	<Section classes="p-8">
		{#if section.header}
			<h2 class="mb-4 text-3xl font-bold">{section.header}</h2>
		{/if}
		<div class="prose-base">{@html section.content}</div>
	</Section>
{/each}
