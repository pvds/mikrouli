import { error } from "@sveltejs/kit";
import content from "../data/content.json";
import global from "../data/global.json";
import { markdownToHtml } from "./utils.js";

/**
 * Fetch all content data.
 * @returns {import('$lib/types/global').global} - The processed content data.
 */
export const getGlobal = () => {
	return global;
};

/**
 * Fetch and process a specific page by its slug.
 * @param {string} slug - The slug to fetch.
 * @returns {import('$lib/types/contentful').PageFields} - The processed fields.
 * @throws {Error} - Throws a SvelteKit error if the page is not found.
 */
export const getPage = (slug) => {
	const pages = content.pages || [];
	/** @type {import('$lib/types/contentful').PageEntry | undefined}*/
	const page = pages?.find((p) => p.fields.slug === slug);

	if (!page) throw error(404, `Page with slug '${slug}' not found`);
	const sections = page.fields.sections;

	return {
		...page.fields,
		intro: markdownToHtml(page.fields.intro),
		sections: sections.map((section) => ({
			...section,
			content: markdownToHtml(section.content),
		})),
	};
};

/**
 * Fetch and process a specific service by its slug.
 * @param {string} slug - The slug to fetch.
 * @returns {import('$lib/types/contentful').ServiceFields} - The processed fields.
 * @throws {Error} - Throws a SvelteKit error if the service is not found.
 */
export const getService = (slug) => {
	const services = content.services;
	/** @type {import('$lib/types/contentful').ServiceEntry | undefined}*/
	const service = services?.find((s) => s.fields.slug === slug);

	if (!service) throw error(404, `Service with slug '${slug}' not found`);

	const sections = service.fields.sections;

	return {
		...service.fields,
		intro: markdownToHtml(service.fields.intro),
		sections: sections.map((section) => ({
			...section,
			content: markdownToHtml(section.content),
		})),
	};
};

/**
 * Fetch and process all services
 * @returns {import('$lib/types/contentful').ServiceFields[]} - The processed fields.
 */
export const getServices = () => {
	const services = content.services || [];

	return services?.map((service) => ({
		...service.fields,
		intro: markdownToHtml(service.fields.intro),
	}));
};

/**
 * Fetch and process blog post slugs for generating dynamic routes.
 * @return {{ slug: string }[]} - An array of objects with a slug property.
 **/
export const getServiceEntries = () => {
	const services = content.services || [];
	return services?.map((post) => ({ slug: post.fields.slug })) || [];
};

/**
 * Fetch and process a specific blog post by its slug.
 * @param {string} slug - The slug of the page to fetch.
 * @returns {import('$lib/types/contentful').PostFields} - The processed fields.
 * @throws {Error} - Throws a SvelteKit error if the post is not found.
 */
export const getPost = (slug) => {
	const posts = content.posts || [];
	const post = posts?.find((p) => p.fields.slug === slug);

	if (!post) throw error(404, `Blog post with slug '${slug}' not found`);

	return {
		...post.fields,
		intro: markdownToHtml(post.fields.intro),
	};
};

/**
 * Fetch and process all blog posts.
 * @returns {import('$lib/types/contentful').PostFields[]} - The processed fields.
 */
export const getPosts = () => {
	const posts = content.posts || [];

	return posts?.map((post) => ({
		...post.fields,
		intro: markdownToHtml(post.fields.intro),
	}));
};

/**
 * Fetch and process blog post slugs for generating dynamic routes.
 * @return {{ slug: string }[]} - An array of objects with a slug property.
 **/
export const getPostEntries = () => {
	const posts = content.posts || [];
	return posts?.map((post) => ({ slug: post.fields.slug })) || [];
};
