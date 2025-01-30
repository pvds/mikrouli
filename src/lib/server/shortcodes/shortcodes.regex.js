/**
 * Matches shortcodes enclosed with two or more braces, allowing whitespace.
 *
 * 1. `{{2,}\s*`: Matches two or more opening braces with optional whitespace.
 * 2. `(\w+)`: Captures the shortcode name consisting of word characters.
 * 3. `([^}]*)`: Captures any attributes within the shortcode, excluding closing braces.
 * 4. `}{2,}`: Matches two or more closing braces with optional whitespace.
 *
 * @type {RegExp}
 */
export const shortcodeRegex = /{{2,}\s*(\w+)([^}]*)}{2,}/g;

/**
 * Matches attributes within a shortcode.
 *
 * 1. `(\w+)`: Captures the attribute name consisting of word characters.
 * 2. `=["']([^["']+)["']`: Matches the attribute value enclosed in double quotes.
 *
 * @type {RegExp}
 */
export const attrRegex = /(\w+)=["']([^["']+)["']/g;
