import readline from "node:readline";

/**
 * Prompts the user with a question and returns their input.
 *
 * @param {string} query - The question to display to the user.
 * @returns {Promise<string>} - The user's input.
 */
export const askQuestion = (query) => {
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	});

	return new Promise((resolve) => {
		rl.question(query, (answer) => {
			rl.close();
			resolve(answer.trim());
		});
	});
};
