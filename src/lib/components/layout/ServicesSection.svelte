<script>
import ServiceArticle from "$ui/ServiceArticle.svelte";
import { oddLastEntry } from "../../helpers/entry.js";
import Section from "./Section.svelte";
/**
 * @typedef {import("$types/contentful.js").ServiceEntry } ServiceEntry
 * @typedef {Object} Props
 * @property {ServiceEntry[]} services
 */

/** @type {Props} */
let { services } = $props();
</script>

<Section innerClasses="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-12">
	{#each services as service, i}
		<div class="col-span-2 {oddLastEntry(services.length, i) &&
		'sm:col-start-2 lg:col-start-auto'}">
			<ServiceArticle service={service.fields} priority={i <= 3}/>
		</div>
	{/each}
</Section>
