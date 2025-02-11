import { getPage, getPosts, getSeo, getServices } from "$lib/server/content.js";

/** @type {import('./$types').PageServerLoad} */
export const load = async () => {
	const slug = "home";
	const page = getPage(slug);
	const posts = getPosts(3);
	const services = getServices();
	const seo = getSeo(page, "HomePage");

	return { page, services, posts, seo };
};
