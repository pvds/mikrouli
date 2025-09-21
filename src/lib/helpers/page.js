import { resolve } from "$app/paths";
import { page } from "$app/state";

/**
 * Check if the current page is the same as the href
 * @param {string} href
 * @param {boolean} exactMatch
 * @return {boolean}
 */
export const isCurrentPage = (href, exactMatch = false) => {
	const currentPath = page.url.pathname;
	return href === resolve("/")
		? href === currentPath
		: exactMatch
			? currentPath.endsWith(href)
			: currentPath.includes(href);
};
