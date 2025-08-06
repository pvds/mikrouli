import fs from "node:fs";
import { askQuestion } from "$util/cli-question";
import { logInfo, logMessage } from "$util/log";
import { escapeRegex } from "$util/regex";

/**
 * Reads the .env file at `envFilePath` and returns an array of variable names
 * that have an empty (or missing) value.
 *
 * @param {string} envFilePath - The path to the .env file.
 * @param {string[]} requiredVars - If used only these variables will be checked.
 * @returns {string[]} - An array of variable names that lack a value.
 */
function getEmptyEnvVariables(envFilePath, requiredVars = []) {
	if (!fs.existsSync(envFilePath)) return [];

	const emptyVariables = fs
		.readFileSync(envFilePath, "utf8")
		.split("\n") // split file into lines
		.map((lineRaw) => {
			const line = lineRaw.trim();
			if (!line || line.startsWith("#")) return null; // skip empty or commented lines

			// Split into key and value
			const [rawKey, ...valueParts] = line.split("=");
			const key = rawKey.trim();
			const value = valueParts
				.join("=") // re-join in case there are "=" characters in the value
				.trim()
				.replace(/^["']|["']$/g, ""); // remove surrounding quotes

			return !value ? key : null;
		})
		.filter((key) => key !== null); // filter out empty keys

	if (requiredVars.length > 0) {
		return emptyVariables.filter((key) => requiredVars.includes(key));
	}

	return emptyVariables;
}

/**
 * Updates or appends environment variables in the .env file, then syncs them into process.env.
 *
 * @param {Object} envUpdates - Key-value pairs of environment variables to update/append.
 * @param {string} envFilePath - Path to the .env file.
 */
const updateEnvFile = (envUpdates, envFilePath) => {
	let envContent = fs.existsSync(envFilePath)
		? fs.readFileSync(envFilePath, { encoding: "utf8" })
		: "";

	for (const [key, value] of Object.entries(envUpdates)) {
		const escapedKey = escapeRegex(key);
		// Match the key at the start of a line, with optional `=` and quotes and value
		const regex = new RegExp(`^${escapedKey}(?:=["']?.*["']?)?$`, "m");
		const newLine = `${key}=${value}`;

		if (regex.test(envContent)) {
			envContent = envContent.replace(regex, newLine);
		} else {
			envContent += `\n${newLine}`;
		}
		// Reflect changes into process.env immediately
		process.env[key] = value.toString();
	}

	fs.writeFileSync(envFilePath, envContent, { encoding: "utf8" });
};

/**
 * Finds all missing environment variables from the .env file and prompts the user for them.
 * Then updates the .env file with the provided values.
 *
 * @param {string} envFilePath - Path to the .env file.
 * @param {string[]} [requiredVars] - List of required environment variables.
 */
const promptForMissingVariables = async (envFilePath, requiredVars = []) => {
	const emptyVars = getEmptyEnvVariables(envFilePath);

	// Convert everything to a Set so we don't prompt duplicates
	const allVarsToPrompt = new Set([
		...requiredVars.filter((k) => !process.env[k]),
		...emptyVars,
	]);

	if (allVarsToPrompt.size === 0) {
		logInfo("No missing environment variables found.");
		return;
	}

	logInfo("The following environment variables need values:");
	for (const key of allVarsToPrompt) {
		logInfo(`- ${key}`);
	}
	logMessage(
		"You can skip the prompts by pressing Enter without providing a value",
	);

	/** @type {Record<string, string>} */
	const envUpdates = {};
	for (const key of allVarsToPrompt) {
		envUpdates[key] = await askQuestion(
			`Please enter a value for ${key}: `,
			{
				required: false,
				mask: !key?.toLowerCase()?.startsWith("public") || true,
			},
		);
	}

	updateEnvFile(envUpdates, envFilePath);
	logInfo(`Updated ${envFilePath} with missing environment variables.`);
};

export { getEmptyEnvVariables, updateEnvFile, promptForMissingVariables };
