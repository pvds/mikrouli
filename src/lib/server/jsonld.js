/**
 * @file This file contains functions to fetch and process content data.
 *
 * @typedef {import('$types/contentful').PostEntry} PostEntry
 * @typedef {import('$types/contentful').PageEntry} PageEntry
 * @typedef {import('$types/contentful').ServiceEntry} ServiceEntry
 * @typedef {import('$types/contentful').ImageField} ImageField
 * @typedef {import('$global/seo/Seo.svelte.types').SEOProps} SEOProps
 * @typedef {import('$global/seo/Seo.svelte.types').JsonLdType} JsonLdType
 */

import { IMAGE_EXT, IMAGE_THUMBNAIL_SIZE, URL_BASE_PRODUCTION } from "$config";
import { getImageName } from "../helpers/image.js";

/**
 * Generate JSON-LD based on the page type.
 * @param {PageEntry|PostEntry|ServiceEntry} entry - The entry data.
 * @param {SEOProps} seoData
 * @param {JsonLdType} jsonLdType - The type of JSON-LD.
 * @param {PostEntry[]|ServiceEntry[]} [items=[]] - Optional array of items for collection pages.
 * @returns {object|undefined} JSON-LD object.
 */
export const getJsonLd = (entry, seoData, jsonLdType = "Organization", items = []) => {
	switch (jsonLdType) {
		case "BlogPosting":
			return getBlogPosting(entry, seoData);
		case "Service":
			return getService(entry, seoData);
		case "ContactPage":
			return getContactPage(entry, seoData);
		case "AboutPage":
			return getAboutPage(entry, seoData);
		case "WebPage":
			return getPage(entry, seoData);
		case "BlogCollection":
			return getBlogCollection(entry, seoData, items);
		case "ServiceCollection":
			return getServiceCollection(entry, seoData, items);
		default:
			return undefined;
	}
};

/**
 * Generate JSON-LD for a generic WebPage.
 * @param {PageEntry} page - The page entry.
 * @param {SEOProps} seoData - The SEO data.
 * @returns {object} JSON-LD for WebPage.
 */
function getPage(page, seoData) {
	return getBasePage(page, seoData, "WebPage");
}

/**
 * Generate JSON-LD for a Contact Page.
 * @param {PageEntry} page - The page entry.
 * @param {SEOProps} seoData - The SEO data.
 * @returns {object} JSON-LD for ContactPage.
 */
function getContactPage(page, seoData) {
	return getBasePage(page, seoData, "ContactPage");
}

/**
 * Generate JSON-LD for an About Page.
 * @param {PageEntry} page - The page entry.
 * @param {SEOProps} seoData - The SEO data.
 * @returns {object} JSON-LD for AboutPage.
 */
function getAboutPage(page, seoData) {
	return getBasePage(page, seoData, "AboutPage");
}

/**
 * Generate JSON-LD for a Blog Overview Page (CollectionPage with BlogPosting items).
 * @param {PageEntry} page - The blog overview page entry.
 * @param {SEOProps} seoData
 * @param {Array<PostEntry>} posts - An array of blog posts.
 * @returns {object} JSON-LD for a CollectionPage with BlogPosting items.
 */
function getBlogCollection(page, seoData, posts) {
	/** @type {Record<string, any>} */
	const base = /** @type {Record<string, any>} */ getBasePage(page, seoData, "CollectionPage");
	if (posts.length) {
		base.hasPart = posts.map((post) => ({
			"@type": "BlogPosting",
			headline: post.fields.header,
			description: post.fields.seoDescription,
			datePublished: iso8601Date(post.meta.createdAt),
			dateModified: iso8601Date(post.meta.updatedAt),
			mainEntityOfPage: {
				"@type": "WebPage",
				"@id": `${URL_BASE_PRODUCTION}/blog/${post.fields.slug}`,
			},
		}));
	}
	return base;
}

/**
 * Generate JSON-LD for a Services Overview Page (CollectionPage with Service items).
 * @param {PageEntry} page - The services overview page entry.
 * @param {SEOProps} seoData
 * @param {Array<ServiceEntry>} services - An array of services.
 * @returns {object} JSON-LD for a CollectionPage with Service items.
 */
function getServiceCollection(page, seoData, services) {
	/** @type {Record<string, any>} */
	const base = /** @type {Record<string, any>} */ getBasePage(page, seoData, "CollectionPage");
	if (services.length) {
		base.hasPart = services.map((service) => ({
			"@type": "Service",
			name: service.fields.title,
			description: service.fields.seoDescription,
			provider: {
				"@type": "Organization",
				name: seoData.siteName,
				url: URL_BASE_PRODUCTION,
				logo: {
					"@type": "ImageObject",
					url: seoData.logo,
				},
			},
			mainEntityOfPage: {
				"@type": "WebPage",
				"@id": `${URL_BASE_PRODUCTION}/services/${service.fields.slug}`,
			},
		}));
	}
	return base;
}

/**
 * Generate JSON-LD for a Blog Posting.
 * @param {PostEntry} post - The post entry.
 * @param {SEOProps} seoData
 * @returns {object} JSON-LD for BlogPosting.
 */
function getBlogPosting(post, seoData) {
	const image = getImage(post.fields.heroImage);
	return {
		"@context": "https://schema.org",
		"@type": "BlogPosting",
		headline: post.fields.header,
		description: post.fields.seoDescription,
		datePublished: iso8601Date(post.meta.createdAt),
		dateModified: iso8601Date(post.meta.updatedAt),
		author: {
			"@type": "Person",
			name: seoData.author,
		},
		publisher: {
			"@type": "Organization",
			name: seoData.siteName,
			logo: {
				"@type": "ImageObject",
				url: seoData.logo,
			},
		},
		image,
		mainEntityOfPage: {
			"@type": "WebPage",
			"@id": `${URL_BASE_PRODUCTION}/blog/${post.fields.slug}`,
		},
		breadcrumb: {
			"@type": "BreadcrumbList",
			itemListElement: [
				{
					"@type": "ListItem",
					position: 1,
					name: "Home",
					item: `${URL_BASE_PRODUCTION}/`,
				},
				{
					"@type": "ListItem",
					position: 2,
					name: "Blog",
					item: `${URL_BASE_PRODUCTION}/blog`,
				},
				{
					"@type": "ListItem",
					position: 3,
					name: post.fields.title,
					item: `${URL_BASE_PRODUCTION}/blog/${post.fields.slug}`,
				},
			],
		},
	};
}

/**
 * Generate JSON-LD for a Service.
 * @param {ServiceEntry} service - The service entry.
 * @param {SEOProps} seoData
 * @returns {object} JSON-LD for Service.
 */
function getService(service, seoData) {
	const image = getImage(service.fields.heroImage);

	return {
		"@context": "https://schema.org",
		"@type": "Service",
		name: service.fields.title,
		description: service.fields.seoDescription,
		serviceType: "Therapy",
		provider: {
			"@type": "Organization",
			name: seoData.siteName,
			url: URL_BASE_PRODUCTION,
			logo: {
				"@type": "ImageObject",
				url: seoData.logo,
			},
		},
		image,
		mainEntityOfPage: {
			"@type": "WebPage",
			"@id": `${URL_BASE_PRODUCTION}/services/${service.fields.slug}`,
		},
		breadcrumb: {
			"@type": "BreadcrumbList",
			itemListElement: [
				{
					"@type": "ListItem",
					position: 1,
					name: "Home",
					item: `${URL_BASE_PRODUCTION}/`,
				},
				{
					"@type": "ListItem",
					position: 2,
					name: "Services",
					item: `${URL_BASE_PRODUCTION}/services`,
				},
				{
					"@type": "ListItem",
					position: 3,
					name: service.fields.title,
					item: `${URL_BASE_PRODUCTION}/services/${service.fields.slug}`,
				},
			],
		},
	};
}

/**
 * Generate base JSON-LD for a page.
 * @param {PageEntry} page - The page entry.
 * @param {SEOProps} seoData - The SEO data.
 * @param {string} pageType - The specific page type (e.g., "AboutPage", "ContactPage", or "WebPage").
 * @returns {object} Base JSON-LD object.
 */
function getBasePage(page, seoData, pageType) {
	const slug = page.fields.slug; // Use dynamic slug from your entry
	const url = `${URL_BASE_PRODUCTION}/${slug}`;
	return {
		"@context": "https://schema.org",
		"@type": pageType,
		name: page.fields.title,
		description: page.fields.seoDescription,
		url: url,
		mainEntityOfPage: {
			"@type": "WebPage",
			"@id": url,
		},
		breadcrumb: {
			"@type": "BreadcrumbList",
			itemListElement: [
				{
					"@type": "ListItem",
					position: 1,
					name: "Home",
					item: `${URL_BASE_PRODUCTION}/`,
				},
				{
					"@type": "ListItem",
					position: 2,
					name: page.fields.title,
					item: url,
				},
			],
		},
	};
}

/**
 * Remove milliseconds from the date string
 * @param {string} date - The date string.
 * @return {string} The date string without milliseconds.
 */
function iso8601Date(date) {
	return date.replace(/\.\d{3}Z$/, "Z");
}

/**
 * Get the image object for JSON-LD.
 * @param {ImageField|undefined} image
 * @return {{"@type": string, url: string} | undefined} The image object.
 */
function getImage(image) {
	return image
		? {
				"@type": "ImageObject",
				url: `${URL_BASE_PRODUCTION}/images/cms/${getImageName(image.file.fileName)}-${IMAGE_THUMBNAIL_SIZE}.${IMAGE_EXT}`,
			}
		: undefined;
}
