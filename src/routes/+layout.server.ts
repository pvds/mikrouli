import { getNavigation, getSeo } from "$lib/server/content";
import type { LayoutServerLoad } from "./$types";

export const prerender = true;

export const load: LayoutServerLoad = async () => {
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
