import { PARAMS_PAGES_EXCLUDE } from "$config";
import {
	getPage,
	getPageEntries,
	getSeo,
	getServices,
} from "$lib/server/content";
import type { EntryGenerator, PageServerLoad } from "./$types";

export const entries: EntryGenerator = async () => {
	return getPageEntries(PARAMS_PAGES_EXCLUDE);
};

export const load: PageServerLoad = async ({ params }) => {
	const { slug } = params;
	const page = getPage(slug);
	const services = getServices();
	const seo = getSeo(page, "WebPage");

	return { page, services, seo };
};
