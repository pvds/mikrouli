import { getPage, getPageEntries, getSeo, getServices } from "$lib/server/content.js";

/** @type {import('./$types').EntryGenerator} */
export const entries = async () => {
	return getPageEntries();
};

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ params }) => {
	const { slug } = params;
	const page = getPage(slug);
	const services = getServices();
	const seo = getSeo(page, "WebPage");

	return { page, services, seo };
};
