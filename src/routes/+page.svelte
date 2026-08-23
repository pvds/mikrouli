<script lang="ts">
import { resolve } from "$app/paths";
import Hero from "$layout/Hero.svelte";
import Outro from "$layout/Outro.svelte";
import PageSections from "$layout/PageSections.svelte";
import TeaserSection from "$layout/TeaserSection.svelte";
import { getImageName } from "$lib/helpers/image.js";
import Image from "$ui/image/Image.svelte";
import type { PageProps } from "./$types";

let { data }: PageProps = $props();
const page = $derived(data.page.fields);
const services = $derived(data.services);
const posts = $derived(data.posts);
</script>

<Hero title={page.header} image={getImageName(page.heroImage?.file.fileName)}
	  imageAlt={page.heroImage?.title}
	  imagePositionClass="object-[100%_75%]" sideAbsolute>
	{@html page.intro}
	{#snippet side()}
	<a href={resolve('/about')} aria-label="Learn more about me"
	   class="block w-[clamp(10rem,50vw,15rem)] mx-auto">
		<Image image="eleni-papamikrouli"
			   sizes="(max-width: 48em) clamp(10rem,50vw,15rem),min(20rem,25vw)"
			   isLocal
			   priority
			   alt="Portrait of Eleni Papamikrouli"
			   widthClass="w-[clamp(10rem,50vw,15rem)] md:w-[min(20rem,25vw)]"
			   classes="translate-z-0 drop-shadow-[0_0_48px_rgba(24,68,70,.6)] sm:top-4 sm:hover:-top-0 transition-[top]" />
	</a>
	{/snippet}
</Hero>

<TeaserSection items={services} priority slug="services" title="How I Can Support You"/>

<PageSections page={page} />

{#if page.outro}
	<Outro image={page.outroImage}>
		{@html page.outro}
	</Outro>
{/if}

<TeaserSection items={posts} slug="blog" title="My latest insights"/>
