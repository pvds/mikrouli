<script>
import { base } from "$app/paths";
import { BUTTON_THEME } from "$config";
import ContentSection from "$layout/ContentSection.svelte";
import Hero from "$layout/Hero.svelte";
import TeaserSection from "$layout/TeaserSection.svelte";
import { svgIcon } from "$lib/helpers/icon";
import BookingDialog from "$ui/BookingDialog.svelte";

let { data } = $props();
let { header, intro, sections } = data.page.fields;
let services = data.services;
let posts = data.posts;
</script>

<Hero title={header}>
	{@html intro}
</Hero>

<TeaserSection items={services} slug="services" title="How I Can Support You"/>

{#if sections}
	{#each sections as section, i}
		<ContentSection footer={i === sections.length - 1 ? footerCta : undefined} index={i}
						wave="even" size="lg" prose>
				<h2 class="text-3xl font-bold">{section.title}</h2>
			{@html section.content}
		</ContentSection>
	{/each}
{/if}

{#snippet footerCta()}
	<div class="flex flex-wrap gap-4 mt-8">
		<BookingDialog type="intake" ctaIcon="calendar"/>
		<a href={`${base}/contact`}
		   class="group py-2 px-4 font-semibold transition-colors {BUTTON_THEME.secondary}">Get in
			contact{@html svgIcon("internal")}</a>
	</div>
{/snippet}

<TeaserSection items={posts} slug="blog" title="Latest posts"/>

