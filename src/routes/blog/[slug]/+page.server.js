import { getPost, getPostEntries } from "$lib/server/content.js";

/** @type {import('./$types').EntryGenerator} */
export const entries = async () => {
	return getPostEntries();
};

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ params, parent }) => {
	const { slug } = params;
	const post = getPost(slug);
	const parentData = await parent();

	const seo = {
		...parentData.seo,
		title: post.title,
	};

	return { local: post, seo };
};
