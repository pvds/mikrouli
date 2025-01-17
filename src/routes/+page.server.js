import { getPage } from "$lib/server/content.js";

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ parent }) => {
	const slug = "home";
	const page = getPage(slug); // Fetch and process the specific page
	const parentData = await parent();

	const seo = {
		...parentData?.seo,
		description: page.seoDescription,
		keywords: page.seoKeywords,
		index: page.seoIndex,
	};

	return { local: page, seo };
};
