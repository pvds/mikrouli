import { getPage, getPosts, getSeo } from "$lib/server/content.js";

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ route }) => {
	const slug = route.id.replace("/", "");
	const page = getPage(slug);
	const posts = getPosts(4);
	const seo = getSeo(page, "ContactPage");

	return { page, posts, seo };
};
