<script>
import { base } from "$app/paths";
import { BUTTON_THEME } from "$config";
import BookingDialog from "$ui/BookingDialog.svelte";
import { svgIcon } from "../../helpers/icon.js";
import ContentSection from "./ContentSection.svelte";

/**
 * @typedef {Object} Props
 * @property {import('$types/contentful').ImageField} [image]
 * @property {import('svelte').Snippet} [children]
 */

/** @type {Props} */
let { image, children } = $props();
</script>

<ContentSection prose proseInvert theme="primaryDark" size="lg" index={1} {image}>
	{@render children?.()}
	{#snippet contentFooter()}
		<div class="flex flex-wrap gap-2 mt-6">
			<BookingDialog type="book" ctaIcon="calendar" />
			<a href={`${base}/contact`} class="group py-2 px-4 font-semibold transition-colors
				{BUTTON_THEME.secondary}">Contact me{@html svgIcon("internal")}</a>
		</div>
	{/snippet}
</ContentSection>
