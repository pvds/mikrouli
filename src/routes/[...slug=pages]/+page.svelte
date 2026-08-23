<script lang="ts">
import { onMount } from "svelte";
import { U_NBSP } from "$config";
import Hero from "$layout/Hero.svelte";
import Outro from "$layout/Outro.svelte";
import PageSections from "$layout/PageSections.svelte";
import TeaserSection from "$layout/TeaserSection.svelte";
import { formatDate } from "$lib/helpers/date.js";
import { getImageName } from "$lib/helpers/image.js";
import type { PageProps } from "./$types";

let { data }: PageProps = $props();
const page = $derived(data.page.fields);
const meta = $derived(data.page.meta);
const services = $derived(data.services);
let updated = $state(U_NBSP);

onMount(() => {
	updated = `Last updated on ${formatDate(meta.updatedAt)}`;
});
</script>

<Hero title={page.header} image={getImageName(page.heroImage?.file.fileName)}
	  imageAlt={page.heroImage?.title} imagePositionClass="object-[100%_75%]">
	{@html page.intro}
	<p class="mt-4 text-base italic">
		{updated}
	</p>
</Hero>

<PageSections page={page} proseClasses="max-w-full!" />

{#if page.outro}
	<Outro image={page.outroImage}>
		{@html page.outro}
	</Outro>
{/if}

<TeaserSection items={services} slug="services" title="How I Can Support You"/>
