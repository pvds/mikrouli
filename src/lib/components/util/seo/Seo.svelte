<script>
import { page } from "$app/state";
import { constructTitle, prependURL } from "./Seo.helpers.js";

/** @type {{children?: import('svelte').Snippet}} */
let { children } = $props();

/** @type {import('./Seo.svelte.types').SEOProps} */
const seoData = page.data.seo;

/** @type {import('./Seo.svelte.types').SEOProps} */
let seo = $derived({
	title: constructTitle(
		seoData.title || page.data.local.title,
		seoData.siteSlogan,
		seoData.siteName,
	),
	description: seoData.description,
	keywords: seoData.keywords,
	canonical: seoData.canonical || page.url.href,
	siteName: seoData.siteName,
	siteSlogan: seoData.siteSlogan,
	imageURL: prependURL(seoData.imageURL),
	logo: prependURL(seoData.logo),
	author: seoData.author,
	name: seoData.name,
	type: seoData.type || "website",
	index: seoData.index,
	twitter: seoData.twitter || false,
	openGraph: seoData.openGraph || false,
	schemaOrg: seoData.schemaOrg || false,
	schemaType: seoData.schemaType || ["WebSite"],
	socials: seoData.socials || [],
	jsonld: seoData.jsonld,
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
