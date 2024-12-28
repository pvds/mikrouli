export const prerender = true; // Ensure the site is statically generated

/** @type {import('./$types').PageLoad} */
export async function load({ fetch, params }) {
	try {
		const res = await fetch("./siteData.json");

		// Check if the response status is ok (status code 200–299)
		if (!res.ok) {
			throw new Error(
				`Failed to fetch data: ${res.status} ${res.statusText}`,
			);
		}

		/** @type {import('$lib/types/contentful').ContentfulData} */
		const data = await res.json();

		return {
			navigation: data.navigation,
			pages: data.pages,
		};
	} catch (error) {
		console.error("Error loading data:", error);

		return {
			error: true,
			message: error.message,
		};
	}
}
