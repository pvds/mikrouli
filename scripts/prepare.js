/**
 * Prepare the project for development
 * 1. Copy the .env.example file to .env
 * 2. Prompt for empty env variables
 * 3. Fetch content from Contentful
 * 4. Fetch images from Contentful
 * 5. Generate processed images and base64 placeholders
 */

import fs from "node:fs";
import path from "node:path";
import { getMissingEnvVariables, promptForMissingVariables, updateEnvFile } from "./util/env.js";
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
	 * 2. Prompt for missing env variables
	 */
	const requiredEnvVariables = ["CONTENTFUL_SPACE_ID", "CONTENTFUL_ACCESS_TOKEN"];

	logHeader("Check if required env variables are set");

	// Identify missing environment variables
	const missingEnvVariables = getMissingEnvVariables(requiredEnvVariables, envFile);

	if (missingEnvVariables.length === 0) {
		logSuccess("All required environment variables are set.");
	} else {
		logError("Missing required environment variables:", missingEnvVariables);

		// Prompt the user for each missing variable using the utility function
		const envUpdates = await promptForMissingVariables(missingEnvVariables);

		// Update the .env file with the new variables
		updateEnvFile(envUpdates, envFile);
		logSuccess("Updated .env file with the provided environment variables.");
	}

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
main().catch((error) => {
	logError("An unexpected error occurred:", error);
	process.exit(1);
});
