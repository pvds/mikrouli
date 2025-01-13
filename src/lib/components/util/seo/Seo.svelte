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

let seoTitle = $derived(
	constructTitle(
		page.data.title || page.data.local.title,
		page.data.titleSlogan,
		page.data.name,
		page.data.titleConstructed,
	),
);
let seoDescription = $state(page.data.description);
let seoKeywords = $state(page.data.keywords);
let seoCanonical = $state(page.data.canonical);
let seoSiteName = $state(page.data.siteName);
let seoImageURL = $state(prependURL(page.data.imageURL));
let seoLogo = $state(prependURL(page.data.logo));
let seoAuthor = $state(page.data.author);
let seoName = $state(page.data.name);
let seoType = $state(page.data.type);
let seoIndex = $state(page.data.index);
let seoTwitter = $state(page.data.twitter);
let seoOpenGraph = $state(page.data.openGraph);
let seoSchemaOrg = $state(page.data.schemaOrg);
let seoSchemaType = $state(page.data.schemaType);
let seoSocials = $state(page.data.socials);
let seoJsonld = $state(page.data.jsonld);

// Reactive data bindings
let SeoLinkedData = $derived(
	/** @type {import('./Seo.svelte.types').SeoLinkedData} */
	{
		"@context": "https://schema.org",
		"@type": seoSchemaType.length > 1 ? seoSchemaType : seoSchemaType[0],
		name: seoName,
		url: page.url.origin,
		image: seoImageURL,
		logo: {
			"@type": "ImageObject",
			url: seoLogo,
			width: 48,
			height: 48,
		},
		sameAs: seoSocials,
		...seoJsonld,
	},
);

let LdScript = $derived(
	`<script type="application/ld+json">${JSON.stringify(SeoLinkedData)}${"<"}/script>`,
);
</script>

<svelte:head>
	{#if seoTitle}
		{#if seoImageURL}
			<meta name="robots" content={seoIndex ? "index, follow, max-image-preview:large" :
			"noindex nofollow"}>
		{:else}
			<meta name="robots" content={seoIndex ? "index, follow" : "noindex nofollow"}>
		{/if}
		<title>{seoTitle}</title>
		<link rel="canonical" href={seoCanonical || page.url.href}>
	{/if}
	{#if seoDescription}
		<meta name="description" content={seoDescription}>
	{/if}
	{#if seoKeywords}
		<meta name="keywords" content={seoKeywords}>
	{/if}
	{#if seoAuthor}
		<meta name="author" content={seoAuthor}>
	{/if}
	{#if seoOpenGraph}
		{#if seoSiteName}
			<meta property="og:site_name" content={seoSiteName}>
		{/if}
		{#if seoTitle}
			<meta property="og:url" content={page.url.href}>
			<meta property="og:type" content={seoType}>
			<meta property="og:title" content={seoTitle}>
		{/if}
		{#if seoDescription}
			<meta property="og:description" content={seoDescription}>
		{/if}
		{#if seoImageURL}
			<meta property="og:image" content={seoImageURL}>
		{/if}
		{#if seoLogo}
			<meta property="og:logo" content={seoLogo}>
		{/if}
	{/if}
	{#if seoTwitter}
		{#if seoTitle}
			<meta name="twitter:card" content="summary_large_image">
			<meta property="twitter:domain" content={page.url.hostname}>
			<meta property="twitter:url" content={page.url.href}>
			<meta name="twitter:title" content={seoTitle}>
		{/if}
		{#if seoDescription}
			<meta name="twitter:description" content={seoDescription}>
		{/if}
		{#if seoImageURL}
			<meta name="twitter:image" content={seoImageURL}>
		{/if}
	{/if}
	{@render children?.()}
	{#if seoSchemaOrg && (seoSocials.length || seoLogo || seoName)}
		{@html LdScript}
	{/if}
</svelte:head>
