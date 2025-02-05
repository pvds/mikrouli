import { getPage, getSeo, getServices } from "$lib/server/content.js";

/** @type {import('./$types').PageServerLoad} */
export const load = async () => {
	const slug = "home";
	const page = getPage(slug);
	const services = getServices();
	const seo = getSeo(page, "HomePage");

	return { page, services, seo };
};
