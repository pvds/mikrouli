import { error } from "@sveltejs/kit";

export const prerender = true; // Ensure the site is statically generated
const contentPath = "./data/content.json";

/** @type {import('./$types').LayoutLoad} */
export async function load({ fetch, params }) {
	try {
		const res = await fetch(contentPath);
		if (!res.ok) error(res.status, res.statusText);

		/** @type {import('$lib/types/contentful').ContentfulData} */
		const data = await res.json();
		return {
			navigation: data.navigation,
			pages: data.pages,
		};
	} catch (error) {
		console.error("Error loading data:", error);

		return {
			navigation: [],
			pages: [],
		};
	}
}
