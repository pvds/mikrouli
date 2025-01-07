import { content } from "$lib/data/content.js";

// since there's no dynamic data here, we can prerender
// it so that it gets served as a static asset in production
export const prerender = true;

/** @type {import('./$types').EntryGenerator} */
export const entries = async () => {
	const data = await content();
	/** @type {import('$lib/types/contentful').ServiceEntry[]} */
	const services = data.services;
	return services?.map((service) => ({ slug: service.fields.slug })) || [];
};
