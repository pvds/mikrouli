<script lang="ts">
import type { Snippet } from "svelte";
import { resolve } from "$app/paths";
import { BUTTON_THEME } from "$config";
import type { ImageField } from "$types/contentful";
import BookingDialog from "$ui/BookingDialog.svelte";
import { svgIcon } from "../../helpers/icon.js";
import ContentSection from "./ContentSection.svelte";

interface Props {
	image?: ImageField;
	children?: Snippet;
}

let { image, children }: Props = $props();
</script>

<ContentSection prose proseInvert theme="primaryDark" size="lg" index={1} {image} imagePosition="end">
	{@render children?.()}
	{#snippet contentFooter()}
		<div class="flex flex-wrap gap-2 mt-6">
			<BookingDialog type="book" ctaIcon="calendar" />
			<a href={resolve('/contact')} class="group py-2 px-4 font-semibold transition-colors
				{BUTTON_THEME.secondary}">Contact me{@html svgIcon("internal")}</a>
		</div>
	{/snippet}
</ContentSection>
