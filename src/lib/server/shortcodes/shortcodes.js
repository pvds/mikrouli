import { linkHandler } from "./handlers/handler.link.js";
import { youtubeHandler } from "./handlers/handler.youtube.js";
import { attrRegex, shortcodeRegex } from "./shortcodes.regex.js";

/**
 * Parses shortcodes in the given text and replaces them with corresponding HTML.
 *
 * @typedef {{ [key: string]: (attributes: Record<string, string>) => string }} Handlers
 * @param {string} text - The input text containing shortcodes.
 * @returns {string} - The text with shortcodes replaced by HTML.
 */
export const parseShortcodes = (text) => {
	/**
	 * Map shortcode names to their handler functions
	 * @type {Handlers} */
	const handlers = {
		youtube: /** @type {(attributes: Record<string, string>) => string} */ (youtubeHandler),
		link: /** @type {(attributes: Record<string, string>) => string} */ (linkHandler),
	};

	return text.replace(shortcodeRegex, (match, shortcode, attrString) => {
		const handler = handlers[shortcode];
		if (!handler) return ""; // If no handler found, remove shortcode

		// Parse attributes into an object
		/** @type {{[key: string]: string}} */
		const attributes = {};
		let attrMatch;
		while (true) {
			attrMatch = attrRegex.exec(attrString);
			if (attrMatch === null) break;
			attributes[attrMatch[1]] = attrMatch[2];
		}

		// Execute the handler and return the HTML
		return handler(attributes);
	});
};
