<script>
import ContentSection from "$layout/ContentSection.svelte";
import Hero from "$layout/Hero.svelte";
import Outro from "$layout/Outro.svelte";
import BookingDialog from "$ui/BookingDialog.svelte";

let { data } = $props();
let { header, intro, contentSections, outro } = data.page.fields;
</script>

<Hero title={header}>
	{@html intro}
</Hero>

{#each contentSections as section, i}
	<ContentSection footer={i === 0 ? footerCta : undefined} prose size="lg" index={i}>
		{@html section}
	</ContentSection>
{/each}

{#snippet footerCta()}
	<div class="flex flex-wrap gap-2 mt-6">
		<BookingDialog type="intake" />
		<BookingDialog type="session" />
	</div>
{/snippet}

{#if outro}
	<Outro>{@html outro}</Outro>
{/if}
