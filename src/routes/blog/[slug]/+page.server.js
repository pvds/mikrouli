import { getPost, getPostEntries } from "$lib/server/content.js";

export const prerender = true; // Ensure the site is statically generated

/** @type {import('./$types').EntryGenerator} */
export const entries = async () => {
	return getPostEntries();
};

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ params }) => {
	const { slug } = params;
	const post = getPost(slug);

	return { local: post };
};
