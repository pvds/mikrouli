import { getService, getServiceEntries } from "$lib/server/content.js";

/** @type {import('./$types').EntryGenerator} */
export const entries = async () => {
	return getServiceEntries();
};

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ params, parent }) => {
	const { slug } = params;
	const service = getService(slug);

	const parentData = await parent();

	const seo = {
		...parentData?.seo,
		title: service.title,
		description: service.seoDescription,
		keywords: service.seoKeywords,
		index: service.seoIndex,
	};

	return { local: service, seo };
};
