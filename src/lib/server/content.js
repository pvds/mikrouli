/**
 * @file This file contains functions to fetch and process content data.
 *
 * @typedef {import('$types/contentful').BaseFieldsRaw} BaseFieldsRaw
 * @typedef {import('$types/contentful').BaseFields} BaseFields
 * @typedef {import('$types/contentful').PostEntry} PostEntry
 * @typedef {import('$types/contentful').PageEntry} PageEntry
 * @typedef {import('$types/contentful').NavigationEntry} NavigationEntry
 * @typedef {import('$types/contentful').ServiceEntry} ServiceEntry
 * @typedef {import('$global/seo/Seo.svelte.types').SEOProps} SEOProps
 * @typedef {import('$types/global').global} GlobalProps
 */

/** @type {NavigationEntry[]}*/
import navigationItems from "$data/generated/navigation.json";
/** @type {PageEntry[]}*/
import pageItems from "$data/generated/pages.json";
/** @type {PostEntry[]}*/
import postItems from "$data/generated/posts.json";
/** @type {ServiceEntry[]}*/
import serviceItems from "$data/generated/services.json";
/** @type {GlobalProps}*/
import globalData from "$data/global.json";
/** @type {SEOProps}*/
import seoData from "$data/seo.json";
import { error } from "@sveltejs/kit";
import { markdownToHtml, splitText } from "./utils.js";

/**
 * Preprocess JSON data to ensure `sections` field exists.
 * @template T
 * @param {Array<T & { fields: BaseFieldsRaw }>} data - Array of content entries.
 * @returns {Array<T & { fields: BaseFields }>} Processed data with sections.
 */
const preprocessJson = (data) => {
	return data.map((item) => ({
		...item,
		fields: {
			...item.fields,
			sections: [],
			prev: undefined,
			next: undefined,
		},
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
 * @param {PageEntry} [page] - The page data to override the default seo data.
 * @returns {SEOProps} - The processed seo data.
 */
export const getSeo = (page) => {
	if (!page) return seoData;
	return {
		...seoData,
		title: page.fields.title,
		description: page.fields.seoDescription,
		keywords: page.fields.seoKeywords,
		index: page.fields.seoIndex,
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
	/** @type {NavigationEntry|undefined}*/
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
	const pages = preprocessJson(pageItems);
	/** @type {PageEntry|undefined}*/
	const page = pages?.find((p) => p.fields.slug === slug);

	if (!page) throw error(404, `Page with slug '${slug}' not found`);

	return {
		...page,
		fields: {
			...page.fields,
			intro: markdownToHtml(page.fields.intro),
			sections: splitText(markdownToHtml(page.fields.content)),
		},
	};
};

/**
 * Fetch and process a specific service by its slug.
 * @param {string} slug - The slug to fetch.
 * @returns {ServiceEntry} - The processed fields.
 * @throws {Error} - Throws a SvelteKit error if the service is not found.
 */
export const getService = (slug) => {
	const services = preprocessJson(serviceItems);
	/** @type {ServiceEntry|undefined}*/
	const service = services.find((s) => s.fields.slug === slug);

	if (!service) throw error(404, `Service with slug '${slug}' not found`);

	return {
		...service,
		fields: {
			...service.fields,
			intro: markdownToHtml(service.fields.intro),
			sections: splitText(markdownToHtml(service.fields.content)),
		},
	};
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
			.map((service) => ({
				...service,
				fields: {
					...service.fields,
					intro: markdownToHtml(service.fields.intro),
				},
			})) || []
	);
};

/**
 * Fetch and process blog post slugs for generating dynamic routes.
 * @return {{ slug: string }[]} - An array of objects with a slug property.
 **/
export const getServiceEntries = () => {
	const services = serviceItems;
	return services?.map((post) => ({ slug: post.fields.slug })) || [];
};

/**
 * Fetch and process a specific blog post by its slug.
 *
 * @param {string} slug - The slug of the page to fetch.
 * @returns {PostEntry} - The processed fields.
 * @throws {Error} - Throws a SvelteKit error if the post is not found.
 */
export const getPost = (slug) => {
	const posts = preprocessJson(postItems);
	const index = posts.findIndex((p) => p.fields.slug === slug);

	if (index === -1) throw error(404, `Blog post with slug '${slug}' not found`);
	const post = posts[index];
	const prev = index > 0 ? posts[index - 1] : undefined;
	const next = index < posts.length - 1 ? posts[index + 1] : undefined;

	return {
		...post,
		fields: {
			...post.fields,
			intro: markdownToHtml(post.fields.intro),
			sections: splitText(markdownToHtml(post.fields.content)),
		},
		prev,
		next,
	};
};

/**
 * Fetch and process all blog posts.
 * @returns {PostEntry[]} - The processed fields.
 */
export const getPosts = () => {
	const posts = preprocessJson(postItems);

	return (
		posts
			?.filter((service) => !service.fields?.hidden)
			.map((post) => ({
				...post,
				fields: {
					...post.fields,
					intro: markdownToHtml(post.fields.intro),
				},
			})) || []
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
