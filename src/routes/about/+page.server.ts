import { getPage, getPosts, getSeo } from "$lib/server/content";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ route }) => {
	const slug = route.id.replace("/", "");
	const page = getPage(slug);
	const posts = getPosts(4);
	const seo = getSeo(page, "AboutPage");

	return { page, posts, seo };
};
