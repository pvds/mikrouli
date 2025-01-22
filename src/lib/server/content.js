/** @type {import("$lib/types/global").global}*/
import globalData from "$data/global.json";
/** @type {import("$lib/types/contentful").NavigationEntry[]}*/
import navigationItems from "$data/navigation.json";
/** @type {import("$lib/types/contentful").PostEntry[]}*/
import pageItems from "$data/pages.json";
/** @type {import("$lib/types/contentful").PostEntry[]}*/
import postItems from "$data/posts.json";
/** @type {import("$global/seo/Seo.svelte.types").SEOProps}*/
import seoData from "$data/seo.json";
/** @type {import("$lib/types/contentful").ServiceEntry[]}*/
import serviceItems from "$data/services.json";
import { error } from "@sveltejs/kit";
import { markdownToHtml, splitText } from "./utils.js";

/**
 * Fetch all content data.
 * @returns {import('$lib/types/global').global} - The processed content data.
 */
export const getGlobal = () => {
	return globalData;
};

/**
 * Fetch all seo data.
 * @returns {import('$global/seo/Seo.svelte.types').SEOProps} - The processed seo data.
 */
export const getSeo = () => {
	return seoData;
};

/**
 * Fetch and process a specific navigation by its slug.
 * @param {string} slug - The slug to fetch.
 * @returns {import('$lib/types/contentful').NavigationEntry} - The processed fields.
 * @throws {Error} - Throws a SvelteKit error if the navigation is not found.
 */
export const getNavigation = (slug) => {
	const navs = navigationItems;
	/** @type {import('$lib/types/contentful').NavigationEntry|undefined}*/
	const nav = navs?.find((n) => n.fields.slug === slug);

	if (!nav) throw error(404, `Navigation with slug '${slug}' not found`);

	return nav;
};

/**
 * Fetch and process a specific page by its slug.
 * @param {string} slug - The slug to fetch.
 * @returns {import('$lib/types/contentful').PageFields} - The processed fields.
 * @throws {Error} - Throws a SvelteKit error if the page is not found.
 */
export const getPage = (slug) => {
	const pages = pageItems;
	/** @type {import('$lib/types/contentful').ServiceEntry|undefined}*/
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
 * @returns {import('$lib/types/contentful').ServiceFields} - The processed fields.
 * @throws {Error} - Throws a SvelteKit error if the service is not found.
 */
export const getService = (slug) => {
	const services = serviceItems;
	/** @type {import('$lib/types/contentful').ServiceEntry|undefined}*/
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
 * @returns {import('$lib/types/contentful').ServiceFields[]} - The processed fields.
 */
export const getServices = () => {
	const services = serviceItems;

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
 * @returns {import('$lib/types/contentful').PostFields} - The processed fields.
 * @throws {Error} - Throws a SvelteKit error if the post is not found.
 */
export const getPost = (slug) => {
	const posts = postItems;
	/** @type {import('$lib/types/contentful').PostEntry|undefined}*/
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
 * @returns {import('$lib/types/contentful').PostFields[]} - The processed fields.
 */
export const getPosts = () => {
	const posts = postItems;

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
