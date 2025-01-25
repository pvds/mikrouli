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

	const envContent = fs.readFileSync(envFilePath, { encoding: "utf8" });
	const lines = envContent.split("\n");
	const missingKeys = [];

	for (const line of lines) {
		const trimmed = line.trim();
		// Skip empty or comment lines
		if (!trimmed || trimmed.startsWith("#")) continue;

		// Expect KEY=VALUE format
		const [rawKey, ...rest] = trimmed.split("=");
		const key = rawKey.trim();

		// Re-join the rest in case there's an '=' in the value
		let value = rest.join("=").trim();

		// Strip surrounding quotes if any
		if (
			(value.startsWith('"') && value.endsWith('"')) ||
			(value.startsWith("'") && value.endsWith("'"))
		) {
			value = value.slice(1, -1);
		}

		// Consider it missing if there's no non-empty value
		if (!value) {
			missingKeys.push(key);
		}
	}

	return missingKeys;
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
		const regex = new RegExp(`^${key}=["']?.*["']?$`, "m");
		const newLine = `${key}=${value}`;

		if (regex.test(envContent)) {
			envContent = envContent.replace(regex, newLine);
		} else {
			envContent += `\n${newLine}`;
		}
		// Reflect changes into process.env immediately
		process.env[key] = value;
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
	const missingRequiredVars = requiredVars.filter(
		(key) => emptyVars.includes(key) || !process.env[key],
	);
	const promptVars = new Set([...missingRequiredVars, ...emptyVars]);
	const missingVars = Array.from(promptVars);

	if (missingVars.length === 0) {
		logInfo("No missing environment variables found.");
		return;
	}

	logInfo("The following environment variables are missing values:");
	for (const key of missingVars) {
		logInfo(`- ${key}`);
	}

	const envUpdates = {};
	for (const key of missingVars) {
		envUpdates[key] = await askQuestion(`Please enter a value for ${key}: `, {
			required: false,
		});
	}

	// Update the .env file with the newly provided values
	updateEnvFile(envUpdates, envFilePath);
	logInfo(`Updated ${envFilePath} with missing environment variables.`);
};

export { getEmptyEnvVariables, updateEnvFile, promptForMissingVariables };
