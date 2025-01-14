<script>
import { base } from "$app/paths";
import { page } from "$app/state";
import { prependURL } from "$lib/helpers/page.js";

/** @type {{children?: import('svelte').Snippet}} */
let { children } = $props();

/**
 * @param {string} title title of the current page
 * @param {string} slogan site slogan
 * @param {string} name site name
 * @param {string} [separator] separator between title, parent, and slogan
 * @returns {string} the constructed title
 */
function constructTitle(title, slogan, name, separator = " - ") {
	const isHome = page.url.pathname === `${base}/`;
	const homeTitle = `${name}${separator}${slogan}`;
	const defaultTitle = `${title}${separator}${name}`;
	return isHome || !title ? homeTitle : defaultTitle;
}

let title = $derived(
	constructTitle(
		page.data.seo.title || page.data.local.title,
		page.data.seo.titleSlogan,
		page.data.seo.name,
	),
);
let description = $derived(page.data.seo.description);
let keywords = $derived(page.data.seo.keywords);
let canonical = $derived(page.data.seo.canonical);
let siteName = $derived(page.data.seo.siteName);
let imageURL = $derived(prependURL(page.data.seo.imageURL));
let logo = $derived(prependURL(page.data.seo.logo));
let author = $derived(page.data.seo.author);
let name = $derived(page.data.seo.name);
let type = $derived(page.data.seo.type);
let index = $derived(page.data.seo.index);
let twitter = $derived(page.data.seo.twitter);
let openGraph = $derived(page.data.seo.openGraph);
let schemaOrg = $derived(page.data.seo.schemaOrg);
let schemaType = $derived(page.data.seo.schemaType);
let socials = $derived(page.data.seo.socials);
let jsonld = $derived(page.data.seo.jsonld);

// Reactive data bindings
let linkedData = $derived(
	/** @type {import('./Seo.svelte.types').SeoLinkedData} */
	{
		"@context": "https://schema.org",
		"@type": schemaType.length > 1 ? schemaType : schemaType[0],
		name: name,
		url: page.url.origin,
		image: imageURL,
		logo: {
			"@type": "ImageObject",
			url: logo,
			width: 48,
			height: 48,
		},
		sameAs: socials,
		...jsonld,
	},
);

let ldScript = $derived(
	`<script type="application/ld+json">${JSON.stringify(linkedData)}${"<"}/script>`,
);
</script>

<svelte:head>
	{#if title}
		{#if imageURL}
			<meta name="robots" content={index ? "index, follow, max-image-preview:large" :
			"noindex nofollow"}>
		{:else}
			<meta name="robots" content={index ? "index, follow" : "noindex nofollow"}>
		{/if}
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
	{#if schemaOrg && (socials.length || logo || name)}
		{@html ldScript}
	{/if}
</svelte:head>
