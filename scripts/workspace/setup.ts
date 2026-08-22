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

const main = async (): Promise<void> => {
	/**
	 * 1. Copy the .env.example file to .env
	 */
	const envFile = path.resolve(process.cwd(), ".env");
	const envExampleFile = path.resolve(process.cwd(), ".env.example");

	logHeader("Checking for missing .env file");
	if (!(await Bun.file(envFile).exists())) {
		logInfo("Missing .env file. Copying .env.example to .env...");
		await Bun.write(envFile, Bun.file(envExampleFile));
		logSuccess("Copied .env.example to .env.");
	} else {
		logSuccess(".env file already exists.");
	}

	/**
	 * 2. Prompt for empty env variables (can be skipped)
	 */
	logHeader("Checking for missing environment variables");
	const requiredVariables = [
		"CONTENTFUL_SPACE_ID",
		"CONTENTFUL_ACCESS_TOKEN",
	];
	await promptForMissingVariables(envFile, requiredVariables);
	logSuccess(
		"Environment variables have been checked and updated according to to provided values.",
	);

	const missingRequiredVariables = await getEmptyEnvVariables(
		envFile,
		requiredVariables,
	);
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
		logInfo(
			"Don't panic! We regularly check-in a snapshot of the content to the repository.",
		);
	}

	/**
	 * 3. Fetch content from Contentful
	 */

	if (fetchContent) {
		logHeader("Fetching content from Contentful");
		await runCommand("bun run content:fetch --force");
		logSuccess("Fetched content from Contentful.");
	}

	/**
	 * 4. Fetch images from Contentful
	 */

	if (fetchContent) {
		logHeader("Fetching images from Contentful");
		await runCommand("bun run assets:fetch --cms");
		logSuccess("Fetched images from Contentful.");
	}

	/**
	 * 5. Generate processed images
	 */
	logHeader("Generating processed images");
	await runCommand("bun run assets:process --local --cms");
	logSuccess("Generated processed images.");

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
