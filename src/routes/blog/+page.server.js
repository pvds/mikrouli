import { getPage, getPosts } from "$lib/server/content.js";

export const prerender = true; // Ensure the site is statically generated

/** @type {import('./$types').PageServerLoad} */
export const load = async () => {
	const slug = "blog";
	const page = getPage(slug);
	const posts = getPosts();

	return { local: { ...page, posts } };
};
