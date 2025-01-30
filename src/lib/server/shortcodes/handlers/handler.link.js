import { isExternalUrl } from "../../../helpers/url.js";

/**
 * Link shortcode handler
 * @param {{url: string, text: string, variant: string}} attributes
 * @return {string}
 */
export function linkHandler(attributes) {
	const { url, text, variant = "secondary" } = attributes;
	if (!url || !text) return "";

	const isExternal = isExternalUrl(url);
	if (isExternal === null) return "";
	const externalAttributes = isExternal ? ' target="_blank" rel="noopener noreferrer"' : "";
	const externalIcon = isExternal
		? `<svg class="inline h-[.8em] ml-[.4em] -mt-[3px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M352 0a32 32 0 0 0-23 55l42 41-170 169a32 32 0 0 0 46 46l169-170 41 42c10 9 23 12 35 7s20-17 20-30V32c0-18-14-32-32-32H352zM80 32C36 32 0 68 0 112v320c0 44 36 80 80 80h320c44 0 80-36 80-80V320a32 32 0 1 0-64 0v112c0 9-7 16-16 16H80c-9 0-16-7-16-16V112c0-9 7-16 16-16h112a32 32 0 1 0 0-64H80z"/></svg>`
		: "";

	/** @type {{[key: string]: string}} */
	const variants = {
		primary: "px-4 bg-accent-600 hover:bg-accent-700 text-white no-underline rounded-full",
		secondary: "hover:text-accent-600 underline underline-offset-2",
	};
	const baseClasses =
		"shortcode-link [&+a]:ml-4 inline-block py-2 font-semibold" + " transition-color";
	const variantClasses = variants[variant] || variants.secondary;
	const classes = `${baseClasses} ${variantClasses}`;

	return `<a href="${url}" class="${classes}" ${externalAttributes}><span>${text}</span>${externalIcon}</a>`.trim();
}
