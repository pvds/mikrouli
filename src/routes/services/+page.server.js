import { getPage, getSeo, getServices } from "$lib/server/content.js";

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ route }) => {
	const slug = route.id.replace("/", "");
	const page = getPage(slug);
	const services = getServices();
	const seo = getSeo(page);

	return { local: { ...page, services }, seo };
};
