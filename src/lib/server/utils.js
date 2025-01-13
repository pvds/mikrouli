import { base } from "$app/paths";
import { marked } from "marked";
import { gfmHeadingId } from "marked-gfm-heading-id";

/**
 * Prepend base path to relative links
 * @param {string} content - The content to apply the changes to.
 * @return {string} - The updated content with absolute links.
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
	marked.use(gfmHeadingId({ prefix: "heading-" }));
	const html = marked(markdown, { async: false });
	return prependBasePath(html);
};
