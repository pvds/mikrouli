import { getSeo, getService, getServiceEntries, getServices } from "$lib/server/content.js";

/** @type {import('./$types').EntryGenerator} */
export const entries = async () => {
	return getServiceEntries();
};

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ params }) => {
	const { slug } = params;
	const service = getService(slug);
	const services = getServices(slug);
	const seo = getSeo(service, "ServicePage");

	return { service, services, seo };
};
