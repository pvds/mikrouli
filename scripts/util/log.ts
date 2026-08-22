type Color =
	| "black"
	| "red"
	| "green"
	| "yellow"
	| "blue"
	| "magenta"
	| "cyan"
	| "white";

type ColorMap = Record<Color, string>;

interface ColorConfig {
	reset: string;
	text: ColorMap;
	background: ColorMap;
}

const colors: ColorConfig = {
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

function log(
	type: "log" | "info" | "warn" | "error" = "log",
	textColor: Color = "white",
	backgroundColor: Color | null = null,
	...messages: unknown[]
): void {
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

export const logDebug = (...messages: unknown[]): void => {
	if (process.env.DEBUG === "true") log("log", "white", null, ...messages);
};

export const logMessage = (...messages: unknown[]): void =>
	log("log", "white", null, ...messages);

export const logInfo = (...messages: unknown[]): void =>
	log("info", "cyan", null, ...messages);

export const logWarn = (...messages: unknown[]): void =>
	log("warn", "yellow", null, ...messages);

export const logError = (...messages: unknown[]): void =>
	log("error", "red", null, ...messages);

export const logSuccess = (...messages: unknown[]): void =>
	log("log", "green", null, ...messages);

export const logHeader = (...messages: unknown[]): void =>
	log("log", "magenta", null, ...["\n=============== ", ...messages, "\n"]);

export const logHighlight = (...messages: unknown[]): void =>
	log("log", "blue", null, ...messages);
