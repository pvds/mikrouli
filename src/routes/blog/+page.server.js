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
		description: "These articles offer insights and tools to support your journey.",
	};

	return { local: { ...page, posts }, seo };
};
