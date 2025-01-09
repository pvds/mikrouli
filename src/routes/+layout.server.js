import { getGlobal, getNavigation } from "$lib/server/content.js";

export const prerender = true; // Ensure the site is statically generated

/** @type {import('./$types').LayoutServerLoad} */
export const load = async () => {
	const nav = {
		primary: getNavigation("primary"),
		footer: getNavigation("footer"),
	};
	return {
		global: getGlobal(),
		local: { nav },
	};
};
