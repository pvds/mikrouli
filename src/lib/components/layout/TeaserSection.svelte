<script>
import TeaserArticle from "$ui/TeaserArticle.svelte";
import { oddLastEntry } from "../../helpers/entry.js";
import Section from "./Section.svelte";
/**
 * @typedef {import("$types/contentful.js").ServiceEntry } ServiceEntry
 * @typedef {import("$types/contentful.js").PostEntry } PostEntry
 * @typedef {Object} Props
 * @property {ServiceEntry[]|PostEntry[]} items
 * @property {'services'|'blog'} slug
 * @property {string} title
 */

/** @type {Props} */
let { items, slug, title } = $props();
</script>

<Section {title}>
	<div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-12">
	{#each items as item, i}
		<div class="col-span-2 {oddLastEntry(items.length, i) &&
		'sm:col-start-2 lg:col-start-auto'} {i === 3 && slug === 'blog' && 'lg:hidden'}">
			<TeaserArticle item={item.fields} {slug} priority={i <= 3}/>
		</div>
	{/each}
	</div>
</Section>
