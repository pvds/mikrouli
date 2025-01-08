import { getGlobal } from "$lib/server/content.js";

export const prerender = true; // Ensure the site is statically generated

/** @type {import('./$types').LayoutServerLoad} */
export const load = async () => {
	return {
		global: getGlobal(),
	};
};
