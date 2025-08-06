import { URL_BASE_PRODUCTION, URL_BASE_STAGING } from "$config";

/**
 * Checks if a URL is external based on predefined internal base URLs.
 * @param {string} url - The URL to check.
 * @return {boolean|null} - Returns true if the URL is external, false otherwise.
 */
export const isExternalUrl = (url) => {
	const INTERNAL_URL_BASES = [URL_BASE_STAGING, URL_BASE_PRODUCTION];

	try {
		// The base URL doesn't matter for relative URLs
		const parsedUrl = new URL(url, INTERNAL_URL_BASES[0]);

		// If the protocol is not HTTP or HTTPS, treat it as external
		if (!["http:", "https:"].includes(parsedUrl.protocol)) {
			return true;
		}

		// Check if the origin matches any of the internal base URLs
		return !INTERNAL_URL_BASES.some((base) => {
			const baseUrl = new URL(base);
			return parsedUrl.origin === baseUrl.origin;
		});
	} catch (_e) {
		// If URL parsing fails, treat the link as external to be safe
		return null;
	}
};
