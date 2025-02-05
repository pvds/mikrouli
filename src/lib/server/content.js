/**
 * @file This file contains functions to fetch and process content data.
 *
 * @typedef {import('$types/contentful').BaseFieldsRaw} BaseFieldsRaw
 * @typedef {import('$types/contentful').BaseFields} BaseFields
 * @typedef {import('$types/contentful').BaseEntry} BaseEntry
 * @typedef {import('$types/contentful').BaseEntryRaw} BaseEntryRaw
 * @typedef {import('$types/contentful').BaseFieldsMinimal} BaseFieldsMinimal
 * @typedef {import('$types/contentful').Metadata} Metadata
 * @typedef {import('$types/contentful').PostEntry} PostEntry
 * @typedef {import('$types/contentful').PageEntry} PageEntry
 * @typedef {import('$types/contentful').NavigationEntry} NavigationEntry
 * @typedef {import('$types/contentful').ServiceEntry} ServiceEntry
 * @typedef {import('$lib/types/contentful').SectionFields} SectionFields
 * @typedef {import('$global/seo/Seo.svelte.types').SEOProps} SEOProps
 * @typedef {import('$types/global').global} GlobalProps
 */

import { URL_BASE_PRODUCTION } from "$config";
import navigationItems from "$data/generated/navigation.json";
import pageItems from "$data/generated/pages.json";
import postItems from "$data/generated/posts.json";
import serviceItems from "$data/generated/services.json";
import globalData from "$data/global.json";
import seoData from "$data/seo.json";
import { error } from "@sveltejs/kit";
import { getImageName } from "../helpers/image.js";
import { markdownToHtml, splitText } from "./utils.js";

/**
 * Preprocess JSON data to ensure the 'contentSections' field exists.
 * @param {BaseEntryRaw[]} data - Array of content entries.
 * @returns {BaseEntry[]} Processed data.
 */
const preprocessJson = (data) => {
	return data?.map((item) => ({
		...item,
		fields: {
			...item.fields,
			contentSections: [],
		},
		prev: undefined,
		next: undefined,
	}));
};

/**
 * Fetch all content data.
 * @returns {GlobalProps} - The processed content data.
 */
export const getGlobal = () => {
	return globalData;
};

/**
 * Fetch all seo data.
 * @param {PageEntry|PostEntry|ServiceEntry} [entry] - The page data to override the default seo data.
 * @param {'BlogPosting'|'Organization'|'Service'} [jsonLdType="Organization"] - The ld+json type to
 * use.
 * @returns {SEOProps} - The processed seo data.
 */
export const getSeo = (entry, jsonLdType = "Organization") => {
	const data = /** @type {SEOProps} */ seoData;
	if (!entry) return data;
	let jsonld = {};
	switch (jsonLdType) {
		case "BlogPosting":
			{
				/** @type {PostEntry} */
				const post = entry;
				const image = post.fields.heroImage
					? {
							"@type": "ImageObject",
							url: `${URL_BASE_PRODUCTION}/images/cms/${getImageName(post.fields.heroImage.file.fileName)}-320.webp`,
						}
					: undefined;
				jsonld = {
					"@context": "https://schema.org",
					"@type": "BlogPosting",
					headline: post.fields.header,
					description: post.fields.seoDescription,
					datePublished: post.meta.createdAt.replace(/\.\d{3}Z$/, "Z"),
					dateModified: post.meta.updatedAt.replace(/\.\d{3}Z$/, "Z"),
					author: {
						"@type": "Person",
						name: data.author,
					},
					publisher: {
						"@type": "Organization",
						name: data.siteName,
						logo: {
							"@type": "ImageObject",
							url: data.logo,
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
			break;
		case "Service":
			{
				/** @type {ServiceEntry} */
				const service = entry;
				const image = service.fields.heroImage
					? {
							"@type": "ImageObject",
							url: `${URL_BASE_PRODUCTION}/images/cms/${getImageName(service.fields.heroImage.file.fileName)}-320.webp`,
						}
					: undefined;
				jsonld = {
					"@context": "https://schema.org",
					"@type": "Service",
					name: service.fields.title,
					description: service.fields.seoDescription,
					serviceType: "Therapy",
					provider: {
						"@type": "Organization",
						name: data.siteName,
						url: URL_BASE_PRODUCTION,
						logo: {
							"@type": "ImageObject",
							url: data.logo,
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
			break;
		default:
			jsonld = {};
			break;
	}
	return {
		...data,
		title: entry.fields.title,
		description: entry.fields.seoDescription,
		keywords: entry.fields.seoKeywords,
		index: entry.fields.seoIndex,
		jsonld: jsonld || data.jsonld,
	};
};

/**
 * Fetch and process a specific navigation by its slug.
 * @param {string} slug - The slug to fetch.
 * @returns {NavigationEntry} - The processed fields.
 * @throws {Error} - Throws a SvelteKit error if the navigation is not found.
 */
export const getNavigation = (slug) => {
	const navs = navigationItems;
	/** @type {NavigationEntry|undefined} */
	const nav = navs?.find((n) => n.fields.slug === slug);

	if (!nav) throw error(404, `Navigation with slug '${slug}' not found`);

	return nav;
};

/**
 * Fetch and process a specific page by its slug.
 * @param {string} slug - The slug to fetch.
 * @returns {PageEntry} - The processed fields.
 * @throws {Error} - Throws a SvelteKit error if the page is not found.
 */
export const getPage = (slug) => {
	const pages = /** @type {PageEntry[]} */ preprocessJson(pageItems);
	/** @type {PageEntry|undefined} */
	const page = pages?.find((p) => p.fields.slug === slug);

	if (!page) throw error(404, `Page with slug '${slug}' not found`);

	return processEntryMarkdown(page);
};

/**
 * Fetch and process a specific service by its slug.
 * @param {string} slug - The slug to fetch.
 * @returns {ServiceEntry} - The processed fields.
 * @throws {Error} - Throws a SvelteKit error if the service is not found.
 */
export const getService = (slug) => {
	const services = preprocessJson(serviceItems);
	/** @type {ServiceEntry|undefined} */
	const service = services.find((s) => s.fields.slug === slug);

	if (!service) throw error(404, `Service with slug '${slug}' not found`);

	return processEntryMarkdown(service);
};

/**
 * Fetch and process all services
 * @returns {ServiceEntry[]} - The processed fields.
 */
export const getServices = () => {
	const services = preprocessJson(serviceItems);

	return (
		services
			?.filter((service) => !service.fields?.hidden)
			.map((service) => processEntryMarkdown(service)) || []
	);
};

/**
 * Fetch and process blog post slugs for generating dynamic routes.
 * @return {{ slug: string }[]} - An array of objects with a slug property.
 **/
export const getServiceEntries = () => {
	const services = serviceItems;
	return services?.map((service) => ({ slug: service.fields.slug })) || [];
};

/**
 * Fetch and process a specific blog post by its slug.
 *
 * @param {string} slug - The slug of the page to fetch.
 * @returns {PostEntry} - The processed fields.
 * @throws {Error} - Throws a SvelteKit error if the post is not found.
 */
export const getPost = (slug) => {
	const posts = /** @type {PostEntry[]} */ preprocessJson(postItems);
	const index = posts.findIndex((p) => p.fields.slug === slug);

	if (index === -1) throw error(404, `Blog post with slug '${slug}' not found`);
	/** @type {PostEntry} */
	const post = processEntryMarkdown(posts[index]);

	/**
	 * Extract minimal fields from a post entry.
	 * @param {PostEntry} entry
	 * @return {BaseFieldsMinimal}
	 */
	const minimalFields = (entry) => ({
		title: entry.fields.title,
		header: entry.fields.header,
		slug: entry.fields.slug,
	});
	const prev = index > 0 ? minimalFields(posts[index - 1]) : undefined;
	const next = index < posts.length - 1 ? minimalFields(posts[index + 1]) : undefined;

	return {
		...post,
		prev,
		next,
	};
};

export const getPosts = () => {
	const posts = /** @type {PostEntry[]} */ preprocessJson(postItems);

	return (
		posts?.filter((post) => !post.fields?.hidden).map((post) => processEntryMarkdown(post)) ||
		[]
	);
};

/**
 * Fetch and process blog post slugs for generating dynamic routes.
 * @return {{ slug: string }[]} - An array of objects with a slug property.
 **/
export const getPostEntries = () => {
	const posts = postItems;
	return posts?.map((post) => ({ slug: post.fields.slug })) || [];
};

/**
 * Processes a single content entry by converting its markdown fields.
 *
 * @param {BaseEntry} entry A content entry parsed from Contentful.
 * @returns {BaseEntry} The entry with markdown converted.
 */
function processEntryMarkdown(entry) {
	const sections = entry.fields.sections?.map((section) => ({
		...section,
		content: markdownToHtml(section.content),
	}));

	return {
		...entry,
		fields: {
			...entry.fields,
			intro: markdownToHtml(entry.fields.intro),
			contentSections: splitText(markdownToHtml(entry.fields.content)),
			sections,
		},
	};
}
