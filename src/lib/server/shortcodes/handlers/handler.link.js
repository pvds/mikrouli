import { BUTTON_THEME } from "$config";
import { svgIcon } from "../../../helpers/icon.js";
import { isExternalUrl } from "../../../helpers/url.js";

/**
 * Link shortcode handler
 *
 * @typedef {import('$types/content').CtaTheme} CtaTheme
 *
 * @typedef {Object} Attributes
 * @property {string} url
 * @property {string} text
 * @property {CtaTheme} [variant="secondary"]
 *
 * @param {Attributes} attributes
 * @return {string}
 * @example
 * [link url="https://example.com" text="Example" variant="primary"]
 */
export function linkHandler(attributes) {
	const { url, text, variant = "secondary" } = attributes;
	if (!url || !text) return "";

	const isExternal = isExternalUrl(url);
	if (isExternal === null) return "";
	const externalAttributes = isExternal
		? ' target="_blank" rel="noopener noreferrer"'
		: "";
	const externalIcon = isExternal ? svgIcon("external") : svgIcon("internal");

	/** @type {{[key: string]: string}} */
	const variants = {
		primary: `px-4 no-underline ${BUTTON_THEME.primary}`,
		secondary: `px-4 no-underline ${BUTTON_THEME.secondary}`,
		tertiary: `${BUTTON_THEME.tertiary}`,
	};
	const baseClasses =
		"shortcode-link group [&+a]:ml-4 inline-block py-2 text-base font-semibold transition-all";
	const variantClasses = variants[variant] || variants.secondary;
	const classes = `${baseClasses} ${variantClasses}`;

	return `<a href="${url}" class="${classes}" ${externalAttributes}>${text}${externalIcon}</a>`.trim();
}
