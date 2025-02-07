<script>
import BookingDialog from "$ui/BookingDialog.svelte";
import ContentSection from "./ContentSection.svelte";

/**
 * @typedef {Object} Props
 * @property {import('svelte').Snippet} [children]
 */

/** @type {Props} */
let { children } = $props();
</script>

<ContentSection prose theme="secondary" index={1}>
	{@render children?.()}
	{#snippet footer()}
		<div class="flex flex-wrap gap-2 mt-6">
			<BookingDialog type="intake" />
			<BookingDialog type="session" />
		</div>
	{/snippet}
</ContentSection>
