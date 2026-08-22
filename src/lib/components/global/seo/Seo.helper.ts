import type { SEOProps } from "./Seo.svelte.types.js";

export const checkSeo = (seo: SEOProps, routeId: string | null): void => {
	const propertiesToCheck: (keyof SEOProps)[] = ["description", "keywords"];
	const missingProperties = propertiesToCheck.filter(
		(property) => !seo[property],
	);
	if (missingProperties.length && routeId) {
		const formattedList = missingProperties
			.map((property) => `  - ${property}`)
			.join("\n");
		console.warn(
			`SEO: Route "${routeId}" missing properties:\n${formattedList}`,
			`\n\nAdd properties to the 'routes${routeId}/+page.js' or it's parent's '+layout.js' file`,
		);
	}
};
