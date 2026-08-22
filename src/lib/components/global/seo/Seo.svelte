<script lang="ts">
import type { Snippet } from "svelte";
import { asset, resolve } from "$app/paths";
import { page } from "$app/state";
import { ORG_NAME, ORG_SLOGAN } from "$config";
import { checkSeo } from "./Seo.helper.js";
import type { SEOProps } from "./Seo.svelte.types.js";

let { children }: { children?: Snippet } = $props();

const constructTitle = (
	title: string | undefined,
	category: string | undefined,
	separator: string = " - ",
): string => {
	const isHome = page.url.pathname === resolve("/");
	const normalize = (value: string | undefined) =>
		value?.replace(/\s+/g, " ").trim() || "";
	const truncate = (value: string, maxLength: number): string => {
		if (value.length <= maxLength) return value;
		const trimmed = value.slice(0, Math.max(0, maxLength - 1)).trimEnd();
		return trimmed ? `${trimmed}…` : value;
	};

	const brand = ORG_NAME;
	const normalizedTitle = normalize(title);
	const normalizedCategory = normalize(category);

	if (isHome || !normalizedTitle) {
		return `${brand}${separator}${ORG_SLOGAN}`;
	}

	const suffix = normalizedCategory
		? `${separator}${normalizedCategory}${separator}${brand}`
		: `${separator}${brand}`;
	const maxTitleLength = 70;
	const titleWithSuffix = `${normalizedTitle}${suffix}`;
	if (titleWithSuffix.length <= maxTitleLength) {
		return titleWithSuffix;
	}

	const availableTitleLength = Math.max(0, maxTitleLength - suffix.length);
	return `${truncate(normalizedTitle, availableTitleLength)}${suffix}`;
};

let title: SEOProps["title"] = $derived(
	constructTitle(page.data.seo.title, page.data.seo.category),
);
let description: SEOProps["description"] = $derived(page.data.seo.description);
let keywords: SEOProps["keywords"] = $derived(page.data.seo.keywords);
let canonical: SEOProps["canonical"] = $derived(
	page.data.seo.canonical || page.url.href,
);
let siteName: SEOProps["siteName"] = $derived(page.data.seo.siteName);
let imageURL: SEOProps["imageURL"] = $derived(
	page.data.seo?.imageURL ? asset(`/${page.data.seo.imageURL}`) : undefined,
);
/** @type {SEOProps['logo']} */
let logo = $derived(
	page.data.seo?.logo ? asset(`/${page.data.seo.logo}`) : undefined,
);
/** @type {SEOProps['author']} */
let author = $derived(page.data.seo.author);
/** @type {SEOProps['type']} */
let type = $derived(page.data.seo.type || "website");
/** @type {SEOProps['index']} */
let index = $derived(page.data.seo.index);
/** @type {SEOProps['twitter']} */
let twitter = $derived(page.data.seo.twitter || false);
/** @type {SEOProps['openGraph']} */
let openGraph = $derived(page.data.seo.openGraph || false);
/** @type {SEOProps['jsonld']} */
let jsonld = $derived(page.data.seo.jsonld);

let ldScript = $derived(
	`<script type="application/ld+json">${JSON.stringify(jsonld)}${"<"}/script>`,
);

if (import.meta.env.MODE === "development") {
	$effect(() => checkSeo(page.data.seo, page.route.id));
}
</script>

<svelte:head>
	{#if imageURL}
		<meta name="robots" content={index ? "index, follow, max-image-preview:large" :
			"noindex nofollow"}>
	{:else}
		<meta name="robots" content={index ? "index, follow" : "noindex nofollow"}>
	{/if}
	{#if title}
		<title>{title}</title>
		<link rel="canonical" href={canonical || page.url.href}>
	{/if}
	{#if description}
		<meta name="description" content={description}>
	{/if}
	{#if keywords}
		<meta name="keywords" content={keywords}>
	{/if}
	{#if author}
		<meta name="author" content={author}>
	{/if}
	{#if openGraph}
		{#if siteName}
			<meta property="og:site_name" content={siteName}>
		{/if}
		{#if title}
			<meta property="og:url" content={page.url.href}>
			<meta property="og:type" content={type}>
			<meta property="og:title" content={title}>
		{/if}
		{#if description}
			<meta property="og:description" content={description}>
		{/if}
		{#if imageURL}
			<meta property="og:image" content={imageURL}>
		{/if}
		{#if logo}
			<meta property="og:logo" content={logo}>
		{/if}
	{/if}
	{#if twitter}
		{#if title}
			<meta name="twitter:card" content="summary_large_image">
			<meta property="twitter:domain" content={page.url.hostname}>
			<meta property="twitter:url" content={page.url.href}>
			<meta name="twitter:title" content={title}>
		{/if}
		{#if description}
			<meta name="twitter:description" content={description}>
		{/if}
		{#if imageURL}
			<meta name="twitter:image" content={imageURL}>
		{/if}
	{/if}
	{@render children?.()}
	{#if jsonld}
		{@html ldScript}
	{/if}
</svelte:head>
