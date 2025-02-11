import { getPage, getPosts, getSeo } from "$lib/server/content.js";

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ route }) => {
	const slug = route.id.replace("/", "");
	const page = getPage(slug);
	const posts = getPosts(3);
	const seo = getSeo(page, "AboutPage");

	return { page, posts, seo };
};
