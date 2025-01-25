import readline from "node:readline";
import { logWarn } from "./log.js";

/**
 * Prompts the user with a question and returns their input.
 *
 * @typedef {import('node:readline').Interface} ReadlineInterface
 * @typedef {ReadlineInterface & { _writeToOutput?: (text: string) => void }} ExtendedReadlineInterface
 *
 * @param {string} query The question to display to the user.
 * @param {object} [options]
 * @param {boolean} [options.required=false] Require non-empty answer
 * @param {boolean} [options.mask=false] Mask input characters
 * @returns {Promise<string>}
 */
export const askQuestion = (query, { required = false, mask = false } = {}) => {
	/** @type {ExtendedReadlineInterface} */
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	});
	const ask = (resolve) => {
		rl.question(query, (answerRaw) => {
			const answer = answerRaw.trim();
			if (required && !answer) {
				logWarn("Value cannot be empty. Please try again.");
				ask(); // Re-ask until we get a non-empty answer
			} else {
				rl.close();
				resolve(answer);
			}
		});
	};

	// Only override output if masked input is requested
	if (mask) {
		/**
		 * Preserve the original _writeToOutput method.
		 * @type {(text: string) => void}
		 */
		const originalWrite = rl._writeToOutput;
		rl._writeToOutput = (stringToWrite) => {
			// Replace actual typed characters with "*"
			if (stringToWrite.trim() && !stringToWrite.startsWith(query)) {
				originalWrite.call(rl, "*".repeat(stringToWrite.length));
			} else {
				originalWrite.call(rl, stringToWrite);
			}
		};
	}

	return new Promise((resolve) => ask(resolve));
};
