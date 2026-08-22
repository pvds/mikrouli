import { getPage, getSeo } from "$lib/server/content";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ route }) => {
	const slug = route.id.replace("/", "");
	const page = getPage(slug);
	const seo = getSeo(page, "WebPage");

	return { page, seo };
};
