import { getGlobal, getNavigation, getSeo } from "$lib/server/content.js";

export const prerender = true;
export const ssr = false;

/** @type {import('./$types').LayoutServerLoad} */
export const load = async () => {
	const nav = {
		primary: getNavigation("primary"),
		footer: getNavigation("footer"),
	};
	return {
		global: getGlobal(),
		local: { nav },
		seo: getSeo(),
	};
};
