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
export const processSync =
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
 * Split text into sections based on an identifier.
 * Ensures no empty sections in the result.
 * @param {string} text - The text to split.
 * @param {string} [identifier='<hr>'] - The identifier to split the Markdown by.
 * @return {string[]} - An array of sections split by the identifier.
 */
export const splitText = (text, identifier = "<hr>") => {
	if (!text) return [];
	const regex = new RegExp(`^${identifier}$`, "m");

	return text
		.split(regex)
		.map((section) => section.trim())
		.filter((section) => section.length > 0);
};

/**
 * Convert Markdown to HTML
 *
 * Also prepends base path to relative links
 * @param {string|undefined} markdown - The Markdown text to convert.
 * @param {boolean} breaks - Whether to convert newlines to <br> tags.
 * @return {string} - The HTML content.
 */
export const markdownToHtml = (markdown, breaks = false) => {
	if (!markdown) return "";

	marked.use(gfmHeadingId({ prefix: "heading-" }));
	const htmlProcessor = processSync(
		(input) => marked(input, { async: false, breaks }),
		obfuscateEmails,
		prependBasePath,
	);
	return htmlProcessor(markdown);
};

/**
 * Encodes an email address into its HTML character entities.
 * Each character is replaced with its corresponding numeric entity.
 *
 * @param {string} email - The email string to encode.
 * @returns {string} The encoded email address.
 */
const encodeEmail = (email) => {
	let encoded = "";
	for (let i = 0, len = email.length; i < len; i++) {
		encoded += `&#${email.charCodeAt(i)};`;
	}
	return encoded;
};

/**
 * Finds all email addresses in a markdown string using a regex,
 * then replaces each email with its encoded version.
 *
 * @param {string} markdown - The markdown string that may contain email addresses.
 * @returns {string} The markdown string with all email addresses obfuscated.
 */
const obfuscateEmails = (markdown) => {
	const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;
	return markdown.replace(emailRegex, (match) => encodeEmail(match));
};
