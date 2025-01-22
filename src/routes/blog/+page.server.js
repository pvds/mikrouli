import { getPage, getPosts, getSeo } from "$lib/server/content.js";

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ route }) => {
	const slug = route.id.replace("/", "");
	const page = getPage(slug);
	const posts = getPosts();
	const seo = getSeo(page);

	return { local: { ...page, posts }, seo };
};
