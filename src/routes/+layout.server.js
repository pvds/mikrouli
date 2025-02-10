import { getNavigation, getSeo } from "$lib/server/content.js";

export const prerender = true;

/** @type {import('./$types').LayoutServerLoad} */
export const load = async () => {
	const nav = {
		primary: getNavigation("primary"),
		footerPages: getNavigation("footer-pages"),
		footerContact: getNavigation("footer-contact"),
	};
	const seo = getSeo();
	return {
		nav,
		seo,
	};
};
