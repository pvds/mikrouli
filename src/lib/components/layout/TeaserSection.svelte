<script lang="ts">
import type { PostEntry, ServiceEntry } from "$types/contentful";
import TeaserArticle from "$ui/TeaserArticle.svelte";
import { oddLastEntry } from "../../helpers/entry.js";
import Section from "./Section.svelte";

interface Props {
	items: ServiceEntry[] | PostEntry[];
	slug: "services" | "blog";
	priority?: boolean;
	title: string;
}

let { items, slug, title, priority }: Props = $props();
</script>

<Section {title}>
	<div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-12">
	{#each items as item, i (item.fields.slug)}
		<div class="col-span-2 {oddLastEntry(items.length, i) &&
		'sm:col-start-2 lg:col-start-auto'} {i === 3 && slug === 'blog' && 'lg:hidden'}">
			<TeaserArticle item={item.fields} {slug} priority={priority && i <= 3}/>
		</div>
	{/each}
	</div>
</Section>
