import { content } from "$lib/data/content.js";

export const prerender = true; // Ensure the site is statically generated

/** @type {import('./$types').LayoutLoad} */
export async function load() {
	return await content();
}
