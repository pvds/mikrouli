/**
 * Prepare the project for development
 * 1. Copy the .env.example file to .env
 * 2. Check if the env variables are set
 * 3. Fetch content from Contentful
 * 4. Fetch images from Contentful
 * 5. Generate processed images and base64 placeholders
 */

import fs from "node:fs";
import path from "node:path";
import { runCommand } from "./util/file.js";
import { logError, logHeader, logHighlight, logInfo, logSuccess } from "./util/log.js";

/**
 * 1. Copy the .env.example file to .env
 */

const envFile = path.resolve(process.cwd(), ".env");
const envExampleFile = path.resolve(process.cwd(), ".env.example");

logHeader("Copy .env.example to .env");
if (!fs.existsSync(envFile)) {
	logInfo("Missing .env file. Copying .env.example to .env...");
	fs.copyFileSync(envExampleFile, envFile);
	logSuccess("Copied .env.example to .env, please fill in the empty variables.");
} else {
	logSuccess(".env file already exists.");
}

/**
 * 2. Check if the env variables are set
 */

const requiredEnvVariables = ["CONTENTFUL_SPACE_ID", "CONTENTFUL_ACCESS_TOKEN"];
const missingEnvVariables = requiredEnvVariables.filter((envVar) => !process.env[envVar]);

logHeader("Check if required env variables are set");
if (missingEnvVariables.length) {
	logError("Missing required environment variables:", missingEnvVariables);
	process.exit(1);
}
logSuccess("All required environment variables are set.");

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
