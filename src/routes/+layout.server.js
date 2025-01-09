import { getGlobal, getNavigation } from "$lib/server/content.js";

export const prerender = true;

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
