/**
 * A simple logging utility with colored text and background options.
 */

/**
 *
 * @type {{reset: string, text: {black: string, red: string, green: string, yellow: string, blue: string, magenta: string, cyan: string, white: string}, background: {black: string, red: string, green: string, yellow: string, blue: string, magenta: string, cyan: string, white: string}}}
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
 * @param {string} [textColor='white'] - The color of the text.
 * @param {string|null} [backgroundColor=undefined] - The background color.
 * @param  {...any} messages - Messages to log.
 */
function log(textColor = "white", backgroundColor = null, ...messages) {
	const textCode = colors.text[textColor] || colors.text.white;
	const bgCode = backgroundColor ? colors.background[backgroundColor] || "" : "";
	console.log(`${bgCode}${textCode}`, ...messages, colors.reset);
}

/**
 * Logs a debug message with white text
 * @param messages
 */
const logDebug = (...messages) => {
	if (process.env.DEBUG === "true") log("white", "null", ...messages);
};

/**
 * Logs an informational message with cyan text.
 * @param  {...any} messages - Messages to log.
 */
const logInfo = (...messages) => log("cyan", null, ...messages);

/**
 * Logs a warning message with yellow text.
 * @param  {...any} messages - Messages to log.
 */
const logWarn = (...messages) => log("yellow", null, ...messages);

/**
 * Logs an error message with red text.
 * @param  {...any} messages - Messages to log.
 */
const logError = (...messages) => log("red", null, ...messages);

/**
 * Logs a success message with green text.
 * @param  {...any} messages - Messages to log. */
const logSuccess = (...messages) => log("green", null, ...messages);

/**
 * Logs a header message with magenta text.
 * @param  {...any} [messages] - Messages to log.
 */
const logHeader = (...messages) =>
	log("magenta", null, ...["\n=============== ", ...messages, "\n"]);

/**
 * Logs a highlighted message with white text on a blue background.
 * @param  {...any} messages - Messages to log.
 */
const logHighlight = (...messages) => log("blue", null, ...messages);

export { logDebug, logInfo, logWarn, logError, logSuccess, logHeader, logHighlight };
