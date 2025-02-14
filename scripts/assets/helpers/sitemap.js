/**
 * @file Generates a sitemap using svelte-sitemap for staging and production environments.
 * @module generateSitemap
 *
 * TODO: consider moving to https://github.com/jasongitmail/super-sitemap for more control
 */

import {
	BUILD_DIR_PRODUCTION,
	BUILD_DIR_STAGING,
	URL_BASE_PRODUCTION,
	URL_BASE_STAGING,
} from "$config";
import { logError, logInfo, logSuccess } from "$util/log.js";
import { runCommand } from "$util/process.js";

/**
 * Run the sitemap generation command with the appropriate environment settings.
 */
function generateSitemap() {
	const isProduction = process.env.DEPLOY_TARGET === "production";
	const baseUrl = isProduction ? URL_BASE_PRODUCTION : URL_BASE_STAGING;
	const outputDir = isProduction ? BUILD_DIR_PRODUCTION : BUILD_DIR_STAGING;
	const command = `bunx svelte-sitemap -d ${baseUrl} -o ${outputDir} --attribution false`;

	try {
		logInfo(`Generating sitemap for ${isProduction ? "Production" : "Staging"}...`);
		runCommand(command);
		logSuccess("Sitemap generated successfully.");
	} catch (error) {
		logError("Failed to generate sitemap:", error);
		process.exit(1);
	}
}

generateSitemap();
