import { base } from "$app/paths";
import { marked } from "marked";

/**
 * Prepend base path to relative links
 * @param {string} content - The original Markdown text.
 * @return {string} - The updated Markdown text with absolute links.
 */
export const prependBasePath = (content) => {
	return content.replace(/href="\/(?!\/)(.*?)"/g, `href="${base}/$1"`);
};

/**
 * Convert Markdown to HTML
 *
 * Also prepends base path to relative links
 * @param {string} markdown - The Markdown text to convert.
 * @return {string} - The HTML content.
 */
export const markdownToHtml = (markdown) => {
	const html = marked(markdown, { async: false });
	return prependBasePath(html);
};
