import { content } from "$lib/data/content.js";

// since there's no dynamic data here, we can prerender
// it so that it gets served as a static asset in production
export const prerender = true;

/** @type {import('./$types').EntryGenerator} */
export const entries = async () => {
	const data = await content();
	/** @type {import('$lib/types/contentful').PostEntry[]} */
	const posts = data.posts;
	return posts?.map((post) => ({ slug: post.fields.slug })) || [];
};
