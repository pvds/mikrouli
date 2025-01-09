import { getPage } from "$lib/server/content.js";

/** @type {import('./$types').PageServerLoad} */
export const load = async () => {
	const slug = "home";
	const page = getPage(slug); // Fetch and process the specific page
	return { local: page };
};
