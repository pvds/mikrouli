import { getPage } from "$lib/server/content.js";

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ route }) => {
	const slug = route.id.replace("/", "");
	const page = getPage(slug); // Fetch and process the specific page
	const seo = {
		index: false,
	};

	return { local: page, seo };
};
