<script>
import { base } from "$app/paths";
import ContentSection from "$layout/ContentSection.svelte";
import Hero from "$layout/Hero.svelte";
import Outro from "$layout/Outro.svelte";
import TeaserSection from "$layout/TeaserSection.svelte";
import { getImageName } from "$lib/helpers/image.js";
import Image from "$ui/image/Image.svelte";

let { data } = $props();
let { header, intro, contentSections, outro, heroImage } = data.page.fields;
let services = data.services;
let posts = data.posts;
</script>

<Hero title={header} image={heroImage ? getImageName(heroImage.file.fileName) : undefined}
	  imageAlt={heroImage ? heroImage.title : undefined} imagePositionClass="object-[100%_75%]">
	<div class="md:w-3/5 lg:w-3/4">
		{@html intro}
	</div>
	<a href={`${base}/about`} aria-label="Learn more about me"
	   class="relative block md:absolute mx-auto md:mx-[inherit] -mt-10 w-1/2 md:w-2/5 md:bottom-0 md:right-0 -bottom-16">
		<Image image="eleni-papamikrouli"
			   sizes="max(25rem,40vw)"
			   isLocal
			   alt="Portrait of Eleni Papamikrouli"
			   widthClass="md:w-[min(25rem,40vw)]"
			   classes="drop-shadow-[0_0_48px_rgba(24,68,70,.6)]" />
	</a>
</Hero>

<TeaserSection items={services} priority slug="services" title="How I Can Support You"/>

{#each contentSections as section}
	<ContentSection prose size="lg">
		{@html section}
	</ContentSection>
{/each}

{#if outro}
	<Outro>{@html outro}</Outro>
{/if}

<TeaserSection items={posts} slug="blog" title="My latest insights"/>
