/**
 * A simple logging utility with colored text and background options.
 */

/**
 * @typedef {'black' | 'red' | 'green' | 'yellow' | 'blue' | 'magenta' | 'cyan' | 'white'} Color
 * @typedef {{ black: string, red: string, green: string, yellow: string, blue: string, magenta: string, cyan: string, white: string }} ColorMap
 */

/**
 * @type {{ reset: string, text: ColorMap, background: ColorMap }}
 */
const colors = {
	reset: "\x1b[0m",
	text: {
		black: "\x1b[30m",
		red: "\x1b[31m",
		green: "\x1b[32m",
		yellow: "\x1b[33m",
		blue: "\x1b[34m",
		magenta: "\x1b[35m",
		cyan: "\x1b[36m",
		white: "\x1b[37m",
	},
	background: {
		black: "\x1b[40m",
		red: "\x1b[41m",
		green: "\x1b[42m",
		yellow: "\x1b[43m",
		blue: "\x1b[44m",
		magenta: "\x1b[45m",
		cyan: "\x1b[46m",
		white: "\x1b[47m",
	},
};

/**
 * Logs a message with customizable text and background colors.
 * @param {"log"|"info"|"warn"|"error"} type - The type of message to log.
 * @param {Color} [textColor='white'] - The color of the text.
 * @param {Color|null} [backgroundColor=null] - The background color.
 * @param  {...unknown} messages - Messages to log.
 * @returns {void}
 */
function log(
	type = "log",
	textColor = "white",
	backgroundColor = null,
	...messages
) {
	// Ensure only valid color keys are used
	const textCode = colors.text[textColor] || colors.text.white;
	const bgCode =
		backgroundColor && colors.background[backgroundColor]
			? colors.background[backgroundColor]
			: "";

	const startCode = bgCode + textCode;
	switch (type) {
		case "log":
			console.log(startCode, ...messages, colors.reset);
			break;
		case "info":
			console.info(startCode, ...messages, colors.reset);
			break;
		case "warn":
			console.warn(startCode, ...messages, colors.reset);
			break;
		case "error":
			console.error(startCode, ...messages, colors.reset);
			break;
		default:
			console.log(startCode, ...messages, colors.reset);
			break;
	}
}

/**
 * Logs a debug message with white text
 * @param {...unknown} messages
 */
export const logDebug = (...messages) => {
	if (process.env.DEBUG === "true") log("log", "white", null, ...messages);
};

/**
 * Logs a message with white text
 *
 * Always logs the message regardless of the DEBUG environment variable.
 * Use logDebug for messages that should only be logged when DEBUG is true.
 * @param {...unknown} messages
 */
export const logMessage = (...messages) =>
	log("log", "white", null, ...messages);

/**
 * Logs an informational message with cyan text.
 * @param  {...unknown} messages - Messages to log.
 */
export const logInfo = (...messages) => log("info", "cyan", null, ...messages);

/**
 * Logs a warning message with yellow text.
 * @param  {...unknown} messages - Messages to log.
 */
export const logWarn = (...messages) =>
	log("warn", "yellow", null, ...messages);

/**
 * Logs an error message with red text.
 * @param  {...unknown} messages - Messages to log.
 */
export const logError = (...messages) => log("error", "red", null, ...messages);

/**
 * Logs a success message with green text.
 * @param  {...unknown} messages - Messages to log. */
export const logSuccess = (...messages) =>
	log("log", "green", null, ...messages);

/**
 * Logs a header message with magenta text.
 * @param  {...unknown} messages - Messages to log.
 */
export const logHeader = (...messages) =>
	log("log", "magenta", null, ...["\n=============== ", ...messages, "\n"]);

/**
 * Logs a highlighted message with white text on a blue background.
 * @param  {...unknown} messages - Messages to log.
 */
export const logHighlight = (...messages) =>
	log("log", "blue", null, ...messages);
