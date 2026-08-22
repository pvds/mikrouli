import {
	getSeo,
	getService,
	getServiceEntries,
	getServices,
} from "$lib/server/content";
import type { EntryGenerator, PageServerLoad } from "./$types";

export const entries: EntryGenerator = async () => {
	return getServiceEntries();
};

export const load: PageServerLoad = async ({ params }) => {
	const { slug } = params;
	const service = getService(slug);
	const services = getServices(slug);
	const seo = getSeo(service, "ServicePage");

	return { service, services, seo };
};
