<script>
import { resolve } from "$app/paths";
import ContentSection from "$layout/ContentSection.svelte";
import Hero from "$layout/Hero.svelte";
import Outro from "$layout/Outro.svelte";
import TeaserSection from "$layout/TeaserSection.svelte";
import { getImageName } from "$lib/helpers/image.js";
import Image from "$ui/image/Image.svelte";

/** @type {import('./$types').PageProps} */
let { data } = $props();
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

{#if page.sections?.length}
	{#each page.sections as section, i}
	<ContentSection index={i} wave="even" size="lg" prose title={section.header || section.title}
					image={section.image}>
		{@html section.content}
	</ContentSection>
	{/each}
{:else}
	{#each page.contentSections as section, i}
	<ContentSection prose size="lg" index={i} wave="even">
		{@html section}
	</ContentSection>
	{/each}
{/if}

{#if page.outro}
	<Outro image={page.outroImage}>
		{@html page.outro}
	</Outro>
{/if}

<TeaserSection items={posts} slug="blog" title="My latest insights"/>
