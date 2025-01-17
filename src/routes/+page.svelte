<script>
import Hero from "$lib/components/layout/Hero.svelte";
import Section from "$lib/components/layout/Section.svelte";

let { data } = $props();
let { header, intro, content } = data.local;
</script>

<Hero title={header}>
	{@html intro}
</Hero>

<Section>
	<div class="prose prose-base">{@html content}</div>
</Section>
