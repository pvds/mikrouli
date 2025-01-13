import { base } from "$app/paths";
import { page } from "$app/state";

/**
 * Check if the current page is the same as the href
 * @param {string} href
 * @return {boolean}
 */
export const isCurrentPage = (href) => {
	const currentPath = page.url.pathname;
	return href === `${base}/` ? href === currentPath : currentPath.includes(href);
};

/**
 * @summary Prepend the base URL to a path
 *
 * TODO: harden to ensure the path is a valid URL
 *
 * @param {string | undefined} url url path
 * @returns {string | undefined} full url
 */
export const prependURL = (url) => {
	if (url && !url.startsWith("http")) {
		return `${page.url.origin}${base}/${url}`;
	}
	return url;
};
