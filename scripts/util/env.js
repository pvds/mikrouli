import fs from "node:fs";
import { askQuestion } from "./cli-question.js";
import { logError, logInfo } from "./log.js";

/**
 * Retrieves the value of a specific environment variable from the .env file.
 *
 * @param {string} key - The environment variable key.
 * @param {string} envFilePath - The path to the .env file.
 * @returns {string|null} - The value if found, otherwise null.
 */
const getEnvVariable = (key, envFilePath) => {
	if (!fs.existsSync(envFilePath)) return null;
	const envContent = fs.readFileSync(envFilePath, { encoding: "utf8" });
	const regex = new RegExp(`^${key}=["']?(.*?)["']?$`, "m");
	const match = envContent.match(regex);
	logInfo(`Match: ${match}`);
	return match ? match[1] : null;
};

/**
 * Updates or appends environment variables in the .env file.
 *
 * @param {Object} envUpdates - An object containing key-value pairs of environment variables.
 * @param {string} envFilePath - The path to the .env file.
 */
const updateEnvFile = (envUpdates, envFilePath) => {
	let envContent = "";
	if (fs.existsSync(envFilePath)) {
		envContent = fs.readFileSync(envFilePath, { encoding: "utf8" });
	}

	for (const [key, value] of Object.entries(envUpdates)) {
		const regex = new RegExp(`^${key}=["']?.*["']?$`, "m");
		const newLine = `${key}=${value}`;
		if (regex.test(envContent)) {
			// Replace existing variable
			envContent = envContent.replace(regex, newLine);
		} else {
			// Append new variable
			envContent += `\n${newLine}`;
		}
		// Also set the variable in process.env for the current script
		process.env[key] = value;
	}

	fs.writeFileSync(envFilePath, envContent, { encoding: "utf8" });
};

/**
 * Checks which required environment variables are missing.
 *
 * @param {string[]} requiredEnvVariables - An array of required environment variable names.
 * @param {string} envFilePath - The path to the .env file.
 * @returns {string[]} - An array of missing environment variable names.
 */
const getMissingEnvVariables = (requiredEnvVariables, envFilePath) => {
	return requiredEnvVariables.filter((envVar) => {
		return !process.env[envVar] && !getEnvVariable(envVar, envFilePath);
	});
};

/**
 * Prompts the user for each missing environment variable and collects their inputs.
 *
 * @param {string[]} missingEnvVariables - An array of missing environment variable names.
 * @returns {Promise<Object>} - An object containing key-value pairs of the environment variables.
 */
const promptForMissingVariables = async (missingEnvVariables) => {
	const envUpdates = {};
	for (const envVar of missingEnvVariables) {
		let value = "";
		while (!value) {
			// Ensure that the user provides a non-empty value
			value = await askQuestion(`Please enter a value for ${envVar}: `);
			if (!value) {
				logError(`Value for ${envVar} cannot be empty. Please try again.`);
			}
		}
		envUpdates[envVar] = value;
	}
	return envUpdates;
};

export { getEnvVariable, updateEnvFile, getMissingEnvVariables, promptForMissingVariables };
