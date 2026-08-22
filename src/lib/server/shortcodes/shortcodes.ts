import { linkHandler } from "./handlers/handler.link";
import { youtubeHandler } from "./handlers/handler.youtube";
import { attrRegex, shortcodeRegex } from "./shortcodes.regex";

type Handlers = {
	[key: string]: (attributes: Record<string, string>) => string;
};

export const parseShortcodes = (text: string): string => {
	const handlers: Handlers = {
		youtube: youtubeHandler,
		link: linkHandler,
	};

	return text.replace(
		shortcodeRegex,
		(_match, shortcode: string, attrString: string) => {
			const handler = handlers[shortcode];
			if (!handler) return ""; // If no handler found, remove shortcode

			// Parse attributes into an object
			const attributes: Record<string, string> = {};
			let attrMatch: RegExpExecArray | null;
			while (true) {
				attrMatch = attrRegex.exec(attrString);
				if (attrMatch === null) break;
				attributes[attrMatch[1]] = attrMatch[2];
			}

			// Execute the handler and return the HTML
			return handler(attributes);
		},
	);
};
