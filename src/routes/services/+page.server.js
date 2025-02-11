import { getPage, getPosts, getSeo, getServices } from "$lib/server/content.js";

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ route }) => {
	const slug = route.id.replace("/", "");
	const page = getPage(slug);
	const posts = getPosts(3);
	const services = getServices();
	const seo = getSeo(page, "ServicesPage", services);

	return { page, services, posts, seo };
};
