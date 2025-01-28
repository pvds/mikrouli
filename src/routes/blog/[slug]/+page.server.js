import { getPost, getPostEntries, getSeo } from "$lib/server/content.js";

/** @type {import('./$types').EntryGenerator} */
export const entries = async () => {
	return getPostEntries();
};

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ params }) => {
	const { slug } = params;
	const post = getPost(slug);
	const seo = getSeo(post);

	return { post, seo };
};
