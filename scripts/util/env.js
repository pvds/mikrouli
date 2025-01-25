import fs from "node:fs";
import { askQuestion } from "./cli-question.js";
import { logInfo } from "./log.js";

/**
 * Reads the .env file and returns an array of variables that have an empty or missing value.
 *
 * @param {string} envFilePath - The path to the .env file.
 * @returns {string[]} - Array of variable names that lack a value.
 */
const getEmptyEnvVariables = (envFilePath) => {
	if (!fs.existsSync(envFilePath)) return [];

	const lines = fs.readFileSync(envFilePath, "utf8").split("\n");
	return lines
		.map((line) => line.trim())
		.filter((l) => l && !l.startsWith("#")) // skip empty or comment lines
		.map((l) => {
			const [k, ...vParts] = l.split("="); // expect KEY=VALUE format
			const v = vParts
				.join("=")
				.trim()
				.replace(/^["']|["']$/g, ""); // strip surrounding quotes
			return { key: k.trim(), value: v };
		})
		.filter(({ value }) => !value) // only those with empty value
		.map(({ key }) => key);
};

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
	const allVarsToPrompt = new Set([...requiredVars.filter((k) => !process.env[k]), ...emptyVars]);

	if (allVarsToPrompt.size === 0) {
		logInfo("No missing environment variables found.");
		return;
	}

	logInfo("The following environment variables need values:");
	for (const key of allVarsToPrompt) {
		logInfo(`- ${key}`);
	}

	const envUpdates = {};
	for (const key of allVarsToPrompt) {
		envUpdates[key] = await askQuestion(`Please enter a value for ${key}: `, {
			required: false,
			mask: !key.toLowerCase().startsWith("public"),
		});
	}

	updateEnvFile(envUpdates, envFilePath);
	logInfo(`Updated ${envFilePath} with missing environment variables.`);
};

export { getEmptyEnvVariables, updateEnvFile, promptForMissingVariables };
