import { base } from "$app/paths";

/**
 * Replace occurrences of {base} with the base path
 *
 * TODO: consider not using {base}; instead regex replace all internal markdown links
 * @param {string} content
 * @return {string}
 */
export const replaceBasePath = (content) => {
	return content.replaceAll(/{base}/g, base);
};
