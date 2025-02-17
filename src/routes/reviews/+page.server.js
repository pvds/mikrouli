import { getPage, getPosts, getReviews, getSeo, getServices } from "$lib/server/content.js";

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ route }) => {
	const slug = route.id.replace("/", "");
	const page = getPage(slug);
	const posts = getPosts(4);
	const services = getServices();
	const reviews = getReviews();
	const seo = getSeo(page);

	return { page, reviews, services, posts, seo };
};
