import { getPage, getSeo } from "$lib/server/content.js";

/** @type {import('./$types').PageServerLoad} */
export const load = async () => {
	const slug = "home";
	const page = getPage(slug);
	const seo = getSeo(page);

	return { local: page, seo };
};
