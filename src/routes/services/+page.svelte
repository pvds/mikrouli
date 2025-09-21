<script>
import { resolve } from "$app/paths";
import ContentSection from "$layout/ContentSection.svelte";
import Hero from "$layout/Hero.svelte";
import Outro from "$layout/Outro.svelte";
import TeaserSection from "$layout/TeaserSection.svelte";
import { getImageName } from "$lib/helpers/image.js";
import Image from "$ui/image/Image.svelte";

let { data } = $props();
let { header, intro, sections, contentSections, outro, heroImage, outroImage } =
	data.page.fields;
let services = data.services;
let posts = data.posts;
</script>

<Hero title={header} image={heroImage ? getImageName(heroImage.file.fileName) : undefined}
	  imageAlt={heroImage ? heroImage.title : undefined} imagePositionClass="object-[100%_75%]" sideAbsolute>
	{@html intro}
	{#snippet side()}
		<a href={resolve('/about')} aria-label="Learn more about me"
		   class="block w-[clamp(10rem,50vw,15rem)] mx-auto">
			<Image image="eleni-papamikrouli"
				   sizes="max-width(48em) clamp(10rem,50vw,15rem),min(20rem,25vw)"
				   isLocal
				   priority
				   alt="Portrait of Eleni Papamikrouli"
				   widthClass="w-[clamp(10rem,50vw,15rem)] md:w-[min(20rem,25vw)]"
				   classes="translate-z-0 drop-shadow-[0_0_48px_rgba(24,68,70,.6)] top-4 hover:-top-0 transition-[top]" />
		</a>
	{/snippet}
</Hero>


{#if sections?.length}
	{#each sections as section, i}
		<ContentSection prose size="md" index={i} title={section.header || section.title}
						image={section.image}>
			{@html section.content}
		</ContentSection>
	{/each}
{:else}
	{#each contentSections as section, i}
		<ContentSection prose size="md" index={i}>
			{@html section}
		</ContentSection>
	{/each}
{/if}

<TeaserSection items={services} priority slug="services" title="How I Can Support You"/>

{#if outro}
	<Outro image={outroImage}>
		{@html outro}
	</Outro>
{/if}

<TeaserSection items={posts} slug="blog" title="My latest insights"/>
