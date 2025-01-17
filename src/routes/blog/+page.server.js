import { getPage, getPosts } from "$lib/server/content.js";

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ route, parent }) => {
	const slug = route.id.replace("/", "");
	const page = getPage(slug);
	const posts = getPosts();
	const parentData = await parent();

	const seo = {
		...parentData?.seo,
		title: page.title,
		description: page.seoDescription,
		keywords: page.seoKeywords,
		index: page.seoIndex,
	};

	return { local: { ...page, posts }, seo };
};
