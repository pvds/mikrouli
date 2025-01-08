import { getPage, getServices } from "$lib/server/content.js";

export const prerender = true; // Ensure the site is statically generated

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	const slug = "services";
	const page = getPage(slug);
	const services = getServices();

	return { local: { ...page, services } };
}
