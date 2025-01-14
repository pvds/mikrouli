import { getPage } from "$lib/server/content.js";

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ parent }) => {
	const slug = "home";
	const page = getPage(slug); // Fetch and process the specific page
	const parentData = await parent();

	const seo = {
		...parentData?.seo,
		description: "Mikrouli is a platform for systemic change",
		keywords:
			"systemic therapy, systemic change, systemic coaching, individual therapy, family therapy, organizational therapy, online therapy",
	};

	return { local: page, seo };
};
