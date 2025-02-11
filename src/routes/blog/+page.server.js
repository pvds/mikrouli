import { getPage, getPosts, getSeo, getServices } from "$lib/server/content.js";

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ route }) => {
	const slug = route.id.replace("/", "");
	const page = getPage(slug);
	const posts = getPosts();
	const services = getServices();
	const seo = getSeo(page, "BlogPage", posts);

	return { page, posts, services, seo };
};
