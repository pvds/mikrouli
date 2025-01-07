import { getPage } from "$lib/server/content.js";

export const prerender = true; // Ensure the site is statically generated

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	const slug = "about";
	const page = getPage(slug); // Fetch and process the specific page
	return { local: page };
}
