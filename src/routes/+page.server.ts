import { getPage, getPosts, getSeo, getServices } from "$lib/server/content";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
	const slug = "home";
	const page = getPage(slug);
	const posts = getPosts(4);
	const services = getServices();
	const seo = getSeo(page, "HomePage");

	return { page, services, posts, seo };
};
