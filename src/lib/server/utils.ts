import type { MarkedExtension } from "marked";
import { marked } from "marked";
import { gfmHeadingId } from "marked-gfm-heading-id";
import { resolve } from "$app/paths";
import { parseShortcodes } from "./shortcodes/shortcodes";

export const processSync = <T>(
	...functions: ((arg: T) => T)[]
): ((input: T) => T) => {
	return (input: T): T =>
		functions.reduce((value: T, fn: (arg: T) => T) => fn(value), input);
};

export const prependBasePath = (content: string): string => {
	return content.replace(/href="\/(?!\/)(.*?)"/g, `href="${resolve("/")}$1"`);
};

export const splitText = (text: string, identifier = "<hr>"): string[] => {
	if (!text) return [];
	const regex = new RegExp(`^${identifier}$`, "m");

	return text
		.split(regex)
		.map((section: string) => section.trim())
		.filter((section: string) => section.length > 0);
};

export const markdownToHtml = (
	markdown: string | undefined,
	breaks = false,
): string => {
	if (!markdown) return "";

	const heading_extension = gfmHeadingId({
		prefix: "heading-",
	}) as MarkedExtension;
	marked.use(heading_extension);
	const htmlProcessor = processSync(
		parseShortcodes,
		(input: string) => marked(input, { async: false, breaks }),
		obfuscateEmails,
		prependBasePath,
	);
	return htmlProcessor(markdown);
};

const encodeEmail = (email: string): string => {
	let encoded = "";
	for (let i = 0, len = email.length; i < len; i++) {
		encoded += `&#${email.charCodeAt(i)};`;
	}
	return encoded;
};

const obfuscateEmails = (markdown: string): string => {
	const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;
	return markdown.replace(emailRegex, (match: string) => encodeEmail(match));
};
