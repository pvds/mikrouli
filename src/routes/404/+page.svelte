<script>
import { base } from "$app/paths";
import Hero from "$lib/components/shell/Hero.svelte";
import Section from "$lib/components/shell/Section.svelte";

let { data } = $props();
let { header, intro, sections } = data.local;
let { name } = data.global;
</script>

<svelte:head>
	<title>{header} - {name}</title>
	<meta name="robots" content="noindex, nofollow" />
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
