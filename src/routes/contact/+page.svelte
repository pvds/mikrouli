<script>
import Hero from "$layout/Hero.svelte";
import Section from "$layout/Section.svelte";
import BookingDialog from "$ui/BookingDialog.svelte";

let { data } = $props();
let { header, intro, sections } = data.page.fields;
</script>

<Hero title={header}>
	{@html intro}
</Hero>

{#each sections as section, i}
	<Section>
		<div class="prose prose-base">{@html section}</div>
		{#if i === 0}
			<div class="flex gap-2 mt-6">
				<BookingDialog type="intake" />
				<BookingDialog type="session" />
			</div>
		{/if}
	</Section>
{/each}
