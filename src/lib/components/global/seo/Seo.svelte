<script>
import { base } from "$app/paths";
import { page } from "$app/state";
import { checkSeo } from "./Seo.helper.js";

/** @typedef {import('./Seo.svelte.types.js').SEOProps} SEOProps */

/** @type {{children?: import('svelte').Snippet}} */
let { children } = $props();

/**
 * @param {string} title title of the current page
 * @param {string} slogan site slogan
 * @param {string} name site name
 * @param {string} [separator] separator between title, parent, and slogan
 * @returns {string} the constructed title
 */
const constructTitle = (title, slogan, name, separator = " - ") => {
	if (!name || !slogan) return "";
	const isHome = page.url.pathname === `${base}/`;
	return isHome || !title ? name + separator + slogan : title + separator + name;
};
/**
 * @param {string} url the URL to prepend
 * @returns {string} the URL with the origin prepended
 */
const prependURL = (url) => (url?.startsWith("http") ? url : `${page.url.origin}${base}/${url}`);

let title = $derived(
	constructTitle(
		page.data.seo.title || page.data.local.title,
		page.data.seo.titleSlogan,
		page.data.seo.name,
	),
);
/** @type {SEOProps['description']} */
let description = $derived(page.data.seo.description);
/** @type {SEOProps['keywords']} */
let keywords = $derived(page.data.seo.keywords);
/** @type {SEOProps['canonical']} */
let canonical = $derived(page.data.seo.canonical || page.url.href);
/** @type {SEOProps['siteName']} */
let siteName = $derived(page.data.seo.siteName);
/** @type {SEOProps['imageURL']} */
let imageURL = $derived(prependURL(page.data.seo.imageURL));
/** @type {SEOProps['logo']} */
let logo = $derived(prependURL(page.data.seo.logo));
/** @type {SEOProps['author']} */
let author = $derived(page.data.seo.author);
/** @type {SEOProps['name']} */
let name = $derived(page.data.seo.name);
/** @type {SEOProps['type']} */
let type = $derived(page.data.seo.type || "website");
/** @type {SEOProps['index']} */
let index = $derived(page.data.seo.index);
/** @type {SEOProps['twitter']} */
let twitter = $derived(page.data.seo.twitter || false);
/** @type {SEOProps['openGraph']} */
let openGraph = $derived(page.data.seo.openGraph || false);
/** @type {SEOProps['schemaOrg']} */
let schemaOrg = $derived(page.data.seo.schemaOrg || false);
/** @type {SEOProps['schemaType']} */
let schemaType = $derived(page.data.seo.schemaType || ["WebSite"]);
/** @type {SEOProps['socials']} */
let socials = $derived(page.data.seo.socials || []);
/** @type {SEOProps['jsonld']} */
let jsonld = $derived(page.data.seo.jsonld);

// Reactive data bindings
let linkedData = $derived(
	/** @type {import('./Seo.svelte.types.js').SeoLinkedData} */
	{
		"@context": "https://schema.org",
		"@type": schemaType && schemaType.length > 1 ? schemaType : schemaType?.[0],
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
	{#if schemaOrg && (socials?.length || logo || name)}
		{@html ldScript}
	{/if}
</svelte:head>
