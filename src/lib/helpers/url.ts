import { URL_BASE_PRODUCTION, URL_BASE_STAGING } from "$config";

export const isExternalUrl = (url: string): boolean | null => {
	const INTERNAL_URL_BASES = [URL_BASE_STAGING, URL_BASE_PRODUCTION];

	try {
		const parsedUrl = new URL(url, INTERNAL_URL_BASES[0]);

		if (!["http:", "https:"].includes(parsedUrl.protocol)) {
			return true;
		}

		return !INTERNAL_URL_BASES.some((base) => {
			const baseUrl = new URL(base);
			return parsedUrl.origin === baseUrl.origin;
		});
	} catch {
		return null;
	}
};
