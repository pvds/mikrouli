<script>
/**
 * @summary Easy SEO metadata for your app
 * @description This component provides a simple way to add SEO metadata to your app.
 * @example
 * Add the component to `+layout.svelte`:
 * ```html
 * <SEO />
 * ```
 * Add the metadata in your `+layout(.server).js` load function:
 * ```js
 * export const load = async ({ url }) => {
 *     // OPTIONAL: You can use url.origin to get the base URL,
 *     // or even url.href to get the full URL.
 *     // (For example, to get URLs of images in your /static folder), like this:
 *     // imageURL: `${url.origin}/image.jpg`
 *     return {
 *         title: 'Mikrouli - Systemic Therapy',
 *         description: 'I’m Eleni Papamikrouli, a systemic therapist working with individuals, couples, and families.',
 *         keywords: 'systemic therapy, systemic therapist, systemic counseling'
 *         // ...
 *     };
 * };
 * ```
 * Now you can add metadata to your pages by overriding and/or extending the values set in the layout file
 **/

import { page } from "$app/state";

/** @type {import('./SEO.svelte.types.js').SEOProps} */
let {
	title,
	description,
	keywords,
	canonical,
	siteName,
	imageURL,
	logo,
	author,
	name,
	type = "website",
	index = true,
	twitter,
	openGraph,
	schemaOrg,
	schemaType = ["Person", "Organization"],
	socials = [],
	jsonld = {},
	children,
} = $props();

// Resolved state values scoped to page.data.seo
let seoTitle = $state(title || page.data.seo?.title);
let seoDescription = $state(description || page.data.seo?.description);
let seoKeywords = $state(keywords || page.data.seo?.keywords);
let seoCanonical = $state(canonical || page.data.seo?.canonical);
let seoSiteName = $state(siteName || page.data.seo?.siteName);
let seoImageURL = $state(imageURL || page.data.seo?.imageURL);
let seoLogo = $state(logo || page.data.seo?.logo);
let seoAuthor = $state(author || page.data.seo?.author);
let seoName = $state(name || page.data.seo?.name);
let seoType = $state(type || page.data.seo?.type);
let seoIndex = $state(index || page.data.seo?.index);
let seoTwitter = $state(twitter || page.data.seo?.twitter);
let seoOpenGraph = $state(openGraph || page.data.seo?.openGraph);
let seoSchemaOrg = $state(schemaOrg || page.data.seo?.schemaOrg);
let seoSchemaType = $state(schemaType || page.data.seo?.schemaType);
let seoSocials = $state(socials || page.data.seo?.socials);
let seoJsonld = $state(jsonld || page.data.seo?.jsonld);

// Reactive data bindings
let SeoLinkedData = $derived(
	/** @type {import('./SEO.svelte.types.js').SeoLinkedData} */
	{
		"@context": "https://schema.org",
		"@type": seoSchemaType.length > 1 ? seoSchemaType : seoSchemaType[0],
		name: seoName,
		url: location.origin,
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
			<meta name="robots" content={seoIndex ? "index, follow, max-image-preview:large" : "noindex"}>
		{:else}
			<meta name="robots" content={seoIndex ? "index, follow" : "noindex"}>
		{/if}
		<title>{seoTitle}</title>
		<link rel="canonical" href={seoCanonical || location.href}>
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
			<meta property="og:url" content={location.href}>
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
			<meta property="twitter:domain" content={location.hostname}>
			<meta property="twitter:url" content={location.href}>
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
