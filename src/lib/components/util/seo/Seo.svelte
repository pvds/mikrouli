<script>
import { page } from "$app/state";
import { constructTitle, prependURL } from "./Seo.helpers.js";

/** @typedef {import('./Seo.svelte.types').SEOProps} SEOProps */

/** @type {{children?: import('svelte').Snippet}} */
let { children } = $props();

/** @type SEOProps */
let seo = $derived({
	title: constructTitle(
		page.data.seo.title || page.data.local.title,
		page.data.seo.siteSlogan,
		page.data.seo.siteName,
	),
	description: page.data.seo.description,
	keywords: page.data.seo.keywords,
	canonical: page.data.seo.canonical || page.url.href,
	siteName: page.data.seo.siteName,
	siteSlogan: page.data.seo.siteSlogan,
	imageURL: prependURL(page.data.seo.imageURL),
	logo: prependURL(page.data.seo.logo),
	author: page.data.seo.author,
	name: page.data.seo.name,
	type: page.data.seo.type || "website",
	index: page.data.seo.index,
	twitter: page.data.seo.twitter || false,
	openGraph: page.data.seo.openGraph || false,
	schemaOrg: page.data.seo.schemaOrg || false,
	schemaType: page.data.seo.schemaType || ["WebSite"],
	socials: page.data.seo.socials || [],
	jsonld: page.data.seo.jsonld,
});

let seoLinkedData = $derived({
	"@context": "https://schema.org",
	"@type": seo?.schemaType && seo.schemaType.length > 1 ? seo.schemaType : seo.schemaType?.[0],
	name: seo.name,
	url: page.url.origin,
	image: seo.imageURL,
	logo: {
		"@type": "ImageObject",
		url: seo.logo,
		width: 48,
		height: 48,
	},
	sameAs: seo.socials,
	...seo.jsonld,
});

let ldScript = $derived(
	`<script type="application/ld+json">${JSON.stringify(seoLinkedData)}${"<"}/script>`,
);

/** Warn for missing description and keywords */
if (import.meta.env.MODE === "development") {
	/** @type {(keyof SEOProps)[]} */
	const propertiesToCheck = ["description", "keywords"];
	$effect(() => {
		console.log("SEO data:", seo);
		for (const property of propertiesToCheck) {
			if (!seo[property]) {
				console.warn(`SEO warning: '${property}' is not defined.`);
			}
		}
	});
}
</script>

<svelte:head>
	{#if seo.imageURL}
		<meta name="robots" content={seo.index ? "index, follow, max-image-preview:large" : "noindex, nofollow"}>
	{:else}
		<meta name="robots" content={seo.index ? "index, follow" : "noindex, nofollow"}>
	{/if}
	{#if seo.title}
		<title>{seo.title}</title>
		<link rel="canonical" href={seo.canonical}>
	{/if}
	{#if seo.description}
		<meta name="description" content={seo.description}>
	{/if}
	{#if seo.keywords}
		<meta name="keywords" content={seo.keywords}>
	{/if}
	{#if seo.author}
		<meta name="author" content={seo.author}>
	{/if}
	{#if seo.openGraph}
		{#if seo.siteName}
			<meta property="og:site_name" content={seo.siteName}>
		{/if}
		<meta property="og:url" content={page.url.href}>
		<meta property="og:type" content={seo.type}>
		<meta property="og:title" content={seo.title}>
		{#if seo.description}
			<meta property="og:description" content={seo.description}>
		{/if}
		{#if seo.imageURL}
			<meta property="og:image" content={seo.imageURL}>
		{/if}
		{#if seo.logo}
			<meta property="og:logo" content={seo.logo}>
		{/if}
	{/if}
	{#if seo.twitter}
		<meta name="twitter:card" content="summary_large_image">
		<meta property="twitter:domain" content={page.url.hostname}>
		<meta property="twitter:url" content={page.url.href}>
		<meta name="twitter:title" content={seo.title}>
		{#if seo.description}
			<meta name="twitter:description" content={seo.description}>
		{/if}
		{#if seo.imageURL}
			<meta name="twitter:image" content={seo.imageURL}>
		{/if}
	{/if}
	{@render children?.()}
	{#if seo.schemaOrg && (seo?.socials?.length || seo.logo || seo.name)}
		{@html ldScript}
	{/if}
</svelte:head>
