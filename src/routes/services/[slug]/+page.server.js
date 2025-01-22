import { getSeo, getService, getServiceEntries } from "$lib/server/content.js";

/** @type {import('./$types').EntryGenerator} */
export const entries = async () => {
	return getServiceEntries();
};

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ params }) => {
	const { slug } = params;
	const service = getService(slug);
	const seo = getSeo(service);

	return { local: service, seo };
};
