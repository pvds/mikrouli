/** @type {import("$types/contentful").NavigationEntry[]}*/
import navigationItems from "$data/generated/navigation.json";
/** @type {import("$types/contentful").PageEntry[]}*/
import pageItems from "$data/generated/pages.json";
/** @type {import("$types/contentful").PostEntry[]}*/
import postItems from "$data/generated/posts.json";
/** @type {import("$types/contentful").ServiceEntry[]}*/
import serviceItems from "$data/generated/services.json";
/** @type {import("$types/global").global}*/
import globalData from "$data/global.json";
/** @type {import("$global/seo/Seo.svelte.types").SEOProps}*/
import seoData from "$data/seo.json";
import { error } from "@sveltejs/kit";
import { markdownToHtml, splitText } from "./utils.js";

/**
 * TODO: check if we can simplify this
 * @typedef {import('$types/contentful').BaseFieldsRaw} BaseFieldsRaw
 * @typedef {import('$types/contentful').BaseFields} BaseFields
 */

/**
 * Preprocess JSON data to ensure `sections` field exists.
 * @template T
 * @param {Array<T & { fields: BaseFieldsRaw }>} data - Array of content entries.
 * @returns {Array<T & { fields: BaseFields }>} Processed data with sections.
 */
const preprocessJson = (data) => {
	return data.map((item) => {
		return {
			...item,
			fields: {
				...item.fields,
				sections: [],
			},
		};
	});
};

/**
 * Fetch all content data.
 * @returns {import('$types/global').global} - The processed content data.
 */
export const getGlobal = () => {
	return globalData;
};

/**
 * Fetch all seo data.
 * @param {import('$types/contentful').BaseFields} [page] - The page data to override the default seo data.
 * @returns {import('$global/seo/Seo.svelte.types').SEOProps} - The processed seo data.
 */
export const getSeo = (page) => {
	if (!page) return seoData;
	return {
		...seoData,
		title: page.title,
		description: page.seoDescription,
		keywords: page.seoKeywords,
		index: page.seoIndex,
	};
};

/**
 * Fetch and process a specific navigation by its slug.
 * @param {string} slug - The slug to fetch.
 * @returns {import('$types/contentful').NavigationEntry} - The processed fields.
 * @throws {Error} - Throws a SvelteKit error if the navigation is not found.
 */
export const getNavigation = (slug) => {
	const navs = navigationItems;
	/** @type {import('$types/contentful').NavigationEntry|undefined}*/
	const nav = navs?.find((n) => n.fields.slug === slug);

	if (!nav) throw error(404, `Navigation with slug '${slug}' not found`);

	return nav;
};

/**
 * Fetch and process a specific page by its slug.
 * @param {string} slug - The slug to fetch.
 * @returns {import('$types/contentful').PageFields} - The processed fields.
 * @throws {Error} - Throws a SvelteKit error if the page is not found.
 */
export const getPage = (slug) => {
	const pages = preprocessJson(pageItems);
	/** @type {import('$types/contentful').PageEntry|undefined}*/
	const page = pages?.find((p) => p.fields.slug === slug);

	if (!page) throw error(404, `Page with slug '${slug}' not found`);

	return {
		...page.fields,
		intro: markdownToHtml(page.fields.intro),
		sections: splitText(markdownToHtml(page.fields?.content)),
	};
};

/**
 * Fetch and process a specific service by its slug.
 * @param {string} slug - The slug to fetch.
 * @returns {import('$types/contentful').ServiceFields} - The processed fields.
 * @throws {Error} - Throws a SvelteKit error if the service is not found.
 */
export const getService = (slug) => {
	const services = preprocessJson(serviceItems);
	/** @type {import('$types/contentful').ServiceEntry|undefined}*/
	const service = services.find((s) => s.fields.slug === slug);

	if (!service) throw error(404, `Service with slug '${slug}' not found`);

	return {
		...service.fields,
		intro: markdownToHtml(service.fields.intro),
		sections: splitText(markdownToHtml(service.fields.content)),
	};
};

/**
 * Fetch and process all services
 * @returns {import('$types/contentful').ServiceFields[]} - The processed fields.
 */
export const getServices = () => {
	const services = preprocessJson(serviceItems);

	return (
		services?.map((service) => ({
			...service.fields,
			intro: markdownToHtml(service.fields.intro),
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
 * @param {string} slug - The slug of the page to fetch.
 * @returns {import('$types/contentful').PostFields} - The processed fields.
 * @throws {Error} - Throws a SvelteKit error if the post is not found.
 */
export const getPost = (slug) => {
	const posts = preprocessJson(postItems);
	/** @type {import('$types/contentful').PostEntry|undefined}*/
	const post = posts?.find((p) => p.fields.slug === slug);

	if (!post) throw error(404, `Blog post with slug '${slug}' not found`);

	return {
		...post.fields,
		intro: markdownToHtml(post.fields.intro),
		sections: splitText(markdownToHtml(post.fields.content)),
	};
};

/**
 * Fetch and process all blog posts.
 * @returns {import('$types/contentful').PostFields[]} - The processed fields.
 */
export const getPosts = () => {
	const posts = preprocessJson(postItems);

	return (
		posts?.map((post) => ({
			...post.fields,
			intro: markdownToHtml(post.fields.intro),
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
