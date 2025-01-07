import { error } from "@sveltejs/kit";
import { marked } from "marked";
import data from "../data/content.json";

/**
 * Fetch all content data.
 * @returns {import('$lib/types/contentful').ContentfulData} - The processed content data.
 */
export const getGlobal = () => {
	return {
		navigation: data.navigation || [],
		pages: data.pages || [],
		services: data.services || [],
		posts: data.posts || [],
	};
};

/**
 * Fetch and process a specific page by its slug.
 * @param {string} slug - The slug of the page to fetch.
 * @returns {import('$lib/types/contentful').PageFields} - The processed page fields.
 * @throws {Error} - Throws a SvelteKit error if the page is not found.
 */
export const getPage = (slug) => {
	const pages = data.pages || [];
	const page = pages?.find((p) => p.fields.slug === slug);

	if (!page) throw error(404, `Page with slug '${slug}' not found`);

	return {
		...page.fields,
		intro: marked(page.fields.intro, { async: false }), // convert markdown to HTML
	};
};
