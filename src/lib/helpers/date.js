/**
 * Formatting options for the formatDate function.
 *
 * @typedef {Object} FormatDateOptions
 * @property {'numeric' | '2-digit'} [year='numeric'] - The representation of the year.
 * @property {'numeric' | '2-digit' | 'long' | 'short' | 'narrow'} [month='long'] - The representation of the month.
 * @property {'numeric' | '2-digit'} [day='numeric'] - The representation of the day.
 * @property {'numeric' | '2-digit'} [hour='2-digit'] - The representation of the hour.
 * @property {'numeric' | '2-digit'} [minute='2-digit'] - The representation of the minute.
 * @property {boolean} [hour12=true] - Whether to use a 12-hour time format.
 * @property {'long' | 'short' | 'narrow'} [weekday] - The representation of the weekday.
 */

/**
 * Formats an ISO date string into a localized string based on the provided locale and options.
 *
 * @param {string} dateString - The date to format.
 * @param {FormatDateOptions} [options] - An object with formatting options.
 * @returns {string} The formatted date string.
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
export const formatDate = (dateString, options = {}) => {
	const date = new Date(dateString);
	const userLocale = navigator.language || "en-US";

	// Calculate the user's time zone internally
	const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

	// Define default formatting options, including the calculated time zone
	/** @type {FormatDateOptions & { timeZone: string }} */
	const defaultOptions = {
		year: "numeric",
		month: "long",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
		hour12: true,
		timeZone: userTimeZone,
		...options, // Override defaults with any provided options (except timeZone)
	};

	return date.toLocaleString(userLocale, defaultOptions);
};
