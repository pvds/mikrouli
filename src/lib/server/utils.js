import { base } from "$app/paths";
import { marked } from "marked";
import { gfmHeadingId } from "marked-gfm-heading-id";

/**
 * Compose multiple functions into a single function.
 *
 * First argument is used as the input.
 * Each function takes the output of the previous function.
 * Use currying to process multiple arguments.
 *
 * @template T - The type of the input
 * @param {...(arg: T) => T} functions - The functions to compose, each taking the output of the previous function.
 * @return {(input: T) => T} - The composed function.
 * @example
 * const foo = (i) => i + 1;
 * const bar = (i) => i * 2;
 * const fooBar = (i, n) => i + n; // Curried function
 * const addOneThenDouble = compose(foo, bar, (i) => fooBar(i, 1));
 */
const processSync =
	(...functions) =>
	(input) =>
		functions.reduce((value, fn) => fn(value), input);

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
 * @param {string|undefined} markdown - The Markdown text to convert.
 * @return {string} - The HTML content.
 */
export const markdownToHtml = (markdown) => {
	if (!markdown) return "";
	marked.use(gfmHeadingId({ prefix: "heading-" }));
	const html = marked(markdown, { async: false });
	return prependBasePath(html);
};
