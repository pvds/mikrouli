/** @typedef {import('./Seo.svelte.types').SEOProps} SEOProps */

/**
 * Check if the SEO properties are set
 * @param {SEOProps} seo
 * @param {string|null} routeId
 */
export const checkSeo = (seo, routeId) => {
	/** @type {(keyof SEOProps)[]} */
	const propertiesToCheck = ["description", "keywords"];
	const missingProperties = propertiesToCheck.filter((property) => !seo[property]);
	if (missingProperties.length && routeId) {
		const formattedList = missingProperties.map((property) => `  - ${property}`).join("\n");
		console.warn(
			`SEO: Route "${routeId}" missing properties:\n${formattedList}`,
			`\n\nAdd properties to the 'routes${routeId}/+page.js' or it's parent's '+layout.js' file`,
		);
	}
};
