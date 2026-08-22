interface FormatDateOptions {
	year?: "numeric" | "2-digit";
	month?: "numeric" | "2-digit" | "long" | "short" | "narrow";
	day?: "numeric" | "2-digit";
	hour?: "numeric" | "2-digit";
	minute?: "numeric" | "2-digit";
	hour12?: boolean;
	weekday?: "long" | "short" | "narrow";
}

/**
 * Formats an ISO date string into a localized string based on the provided locale and options.
 *
 * @example
 * const date = '2024-12-28T06:00:03.222Z';
 * const formatted = formatDate(date);
 * console.log(formatted); // Outputs: "December 28, 2024, 6:00 AM"
 *
 * @example
 * const date = '2024-12-28T06:00:03.222Z';
 * const options = {
 *   year: 'numeric',
 *   month: 'long',
 *   day: 'numeric',
 *   hour: '2-digit',
 *   minute: '2-digit',
 *   hour12: true,
 *   weekday: 'long',
 * };
 * const formatted = formatDate(date, options);
 * console.log(formatted); // Outputs: "Saturday, December 28, 2024, 6:00 AM"
 */
export const formatDate = (
	dateString: string,
	options: FormatDateOptions = {},
): string => {
	const date = new Date(dateString);
	const userLocale =
		typeof navigator !== "undefined" ? navigator.language : "en-US";

	const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

	const defaultOptions = {
		year: "numeric",
		month: "long",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
		hour12: true,
		timeZone: userTimeZone,
		...options,
	} as const;

	return date.toLocaleString(
		userLocale,
		defaultOptions as Intl.DateTimeFormatOptions,
	);
};
