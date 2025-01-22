import { getPage, getSeo } from "$lib/server/content.js";

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ route }) => {
	const slug = route.id.replace("/", "");
	const page = getPage(slug); // Fetch and process the specific page
	const seo = getSeo(page);

	return { local: page, seo };
};
