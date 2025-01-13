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
