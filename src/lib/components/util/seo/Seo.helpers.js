import { base } from "$app/paths";
import { page } from "$app/state";

/**
 * Construct the title of the current page
 * @param {string|undefined} pageTitle title of the current page
 * @param {string|undefined} siteSlogan site slogan
 * @param {string|undefined} siteName site name
 * @param {string} [separator] separator between parts of the title
 * @returns {string|undefined} the constructed title
 */
export function constructTitle(pageTitle, siteSlogan, siteName, separator = " - ") {
	if (!siteName || !siteSlogan) return "";
	const isHome = page.url.pathname === `${base}/`;
	return isHome || !pageTitle
		? `${siteName}${separator}${siteSlogan}`
		: `${pageTitle}${separator}${siteName}`;
}

/**
 * Prepend the base URL to a path
 * @param {string | undefined} url url path
 * @returns {string | undefined} full url
 */
export const prependURL = (url) =>
	url?.startsWith("http") ? url : `${page.url.origin}${base}/${url}`;
