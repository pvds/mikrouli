import { getPage, getReviews, getSeo } from "$lib/server/content.js";

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ route }) => {
	const slug = route.id.replace("/", "");
	const page = getPage(slug);
	const reviews = getReviews();
	const seo = getSeo(page);

	return { page, reviews, seo };
};
