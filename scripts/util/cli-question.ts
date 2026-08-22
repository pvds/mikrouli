import readline from "node:readline";
import { logWarn } from "$util/log";

interface AskQuestionOptions {
	required?: boolean;
	mask?: boolean;
}

type ReadlineInterface = readline.Interface & {
	_writeToOutput?: (text: string) => void;
};

export const askQuestion = (
	query: string,
	{ required = false, mask = false }: AskQuestionOptions = {},
): Promise<string> => {
	const rl: ReadlineInterface = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	});

	const ask = (resolve: (value: string) => void): void => {
		rl.question(query, (answerRaw) => {
			const answer = answerRaw.trim();
			if (required && !answer) {
				logWarn("Value cannot be empty. Please try again.");
				ask(resolve);
			} else {
				rl.close();
				resolve(answer);
			}
		});
	};

	if (mask) {
		const originalWrite = rl._writeToOutput;
		rl._writeToOutput = (stringToWrite: string) => {
			if (stringToWrite.trim() && !stringToWrite.startsWith(query)) {
				originalWrite?.call(rl, "*".repeat(stringToWrite.length));
			} else {
				originalWrite?.call(rl, stringToWrite);
			}
		};
	}

	return new Promise((resolve) => ask(resolve));
};
