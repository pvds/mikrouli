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
import { promptForMissingVariables } from "./util/env.js";
import { runCommand } from "./util/file.js";
import { logError, logHeader, logHighlight, logInfo, logSuccess } from "./util/log.js";

/**
 * Main asynchronous function to prepare the project
 */
const main = async () => {
	/**
	 * 1. Copy the .env.example file to .env
	 */
	const envFile = path.resolve(process.cwd(), ".env");
	const envExampleFile = path.resolve(process.cwd(), ".env.example");

	logHeader("Copy .env.example to .env");
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
	logHeader("Prompt for missing environment variables");
	await promptForMissingVariables(envFile);
	logSuccess("Environment variables have been checked and updated if needed.");

	/**
	 * 3. Fetch content from Contentful
	 */
	logHeader("Fetching content from Contentful");
	runCommand("bun run fetch:content --force");
	logSuccess("Fetched content from Contentful.");

	/**
	 * 4. Fetch images from Contentful
	 */
	logHeader("Fetching images from Contentful");
	runCommand("bun run fetch:images --cms");
	logSuccess("Fetched images from Contentful.");

	/**
	 * 5. Generate processed images and base64 placeholders
	 */
	logHeader("Generating processed images and base64 placeholders");
	runCommand("bun run gen:images --local --cms");
	logSuccess("Generated processed images and base64 placeholders.");

	/**
	 * 6. Ready for development
	 */
	logHeader("Project is ready for development.");
	logHighlight(
		"Run `bun start` to start the development server and open the project in your browser.",
	);
};

// Execute the main function
main()
	.catch((error) => {
		logError("An unexpected error occurred:", error);
		process.exit(1);
	})
	.finally(() => {
		process.exit(0);
	});
