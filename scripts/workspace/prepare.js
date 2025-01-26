/**
 * Prepare the project for development
 * 1. Copy the .env.example file to .env
 * 2. Prompt for empty env variables (can be skipped)
 * 3. Fetch content from Contentful
 * 4. Fetch images from Contentful
 * 5. Generate processed images and base64 placeholders
 */

import fs from "node:fs";
import path from "node:path";
import { getEmptyEnvVariables, promptForMissingVariables } from "$util/env";
import {
	logError,
	logHeader,
	logHighlight,
	logInfo,
	logMessage,
	logSuccess,
	logWarn,
} from "$util/log";
import { runCommand } from "$util/process";

/**
 * Main asynchronous function to prepare the project
 */
const main = async () => {
	/**
	 * 1. Copy the .env.example file to .env
	 */
	const envFile = path.resolve(process.cwd(), ".env");
	const envExampleFile = path.resolve(process.cwd(), ".env.example");

	logHeader("Checking for missing .env file");
	if (!fs.existsSync(envFile)) {
		logInfo("Missing .env file. Copying .env.example to .env...");
		fs.copyFileSync(envExampleFile, envFile);
		logSuccess("Copied .env.example to .env.");
	} else {
		logSuccess(".env file already exists.");
	}

	/**
	 * 2. Prompt for empty env variables (can be skipped)
	 */
	logHeader("Checking for missing environment variables");
	const requiredVariables = ["CONTENTFUL_SPACE_ID", "CONTENTFUL_ACCESS_TOKEN"];
	await promptForMissingVariables(envFile, requiredVariables);
	logSuccess(
		"Environment variables have been checked and updated according to to provided values.",
	);

	const missingRequiredVariables = getEmptyEnvVariables(envFile, requiredVariables);
	const fetchContent = missingRequiredVariables.length === 0;

	if (!fetchContent) {
		logHeader("Project is ready for development");
		logWarn(
			"Preparation cannot be completed because the following required environment variables are missing:",
		);
		for (const key of missingRequiredVariables) logMessage(`- ${key}`);
		logInfo(
			"\n",
			"Without these variables, you won't be able to fetch content from Contentful.",
		);
		logInfo("Don't panic! We regularly check-in a snapshot of the content to the repository.");
	}

	/**
	 * 3. Fetch content from Contentful
	 */

	if (fetchContent) {
		logHeader("Fetching content from Contentful");
		runCommand("bun run content:fetch --force");
		logSuccess("Fetched content from Contentful.");
	}

	/**
	 * 4. Fetch images from Contentful
	 */

	if (fetchContent) {
		logHeader("Fetching images from Contentful");
		runCommand("bun run images:fetch --cms");
		logSuccess("Fetched images from Contentful.");
	}

	/**
	 * 5. Generate processed images and base64 placeholders
	 */
	logHeader("Generating processed images and base64 placeholders");
	runCommand("bun run images:process --local --cms");
	logSuccess("Generated processed images and base64 placeholders.");

	/**
	 * 6. Ready for development
	 */
	logHeader("Project is ready for development.");
	logHighlight(
		"Run `bun start` to start the development server and open the project in your browser.",
	);
};

main().catch((error) => {
	logError("An unexpected error occurred:", error);
	process.exit(1);
});
