<script>
import Hero from "$layout/Hero.svelte";
import Section from "$layout/Section.svelte";
import { formatDate } from "$lib/helpers/date.js";

let { data } = $props();
let { meta, title, intro, slug, sections } = data.local;
</script>

<Hero title={title} transitionName={slug}>
	{@html intro}
	<p class="mt-4 text-base italic text-primary-800">
		{#if meta.createdAt === meta.updatedAt}
			Published on {formatDate(meta.createdAt)}
		{:else}
			Last updated on {formatDate(meta.updatedAt)}
		{/if}
	</p>
</Hero>

{#each sections as section}
	<Section>
		<div class="prose prose-base">{@html section}</div>
	</Section>
{/each}
