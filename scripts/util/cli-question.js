import readline from "node:readline";

/**
 * Prompts the user with a question and returns their input.
 * If required = true, the user is re-prompted until they provide a non-empty answer.
 *
 * @param {string} query - The question to display to the user.
 * @param {object} [options]
 * @param {boolean} [options.required=false] - Whether to insist on a non-empty answer.
 * @returns {Promise<string>} - The user's (trimmed) input. Returns "" if not required and user simply hits enter.
 */
export const askQuestion = (query, { required = false } = {}) => {
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	});

	return new Promise((resolve) => {
		const ask = () => {
			rl.question(query, (answer) => {
				const trimmed = answer.trim();

				if (required && !trimmed) {
					console.log("Value cannot be empty. Please try again.");
					ask(); // re-ask until a non-empty answer is given
				} else {
					rl.close();
					resolve(trimmed);
				}
			});
		};

		ask();
	});
};
