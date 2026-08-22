import {
	BUILD_DIR_PRODUCTION,
	BUILD_DIR_STAGING,
	URL_BASE_PRODUCTION,
	URL_BASE_STAGING,
} from "$config";
import { logError, logInfo, logSuccess } from "$util/log.js";
import { runCommand } from "$util/process.js";

async function generateSitemap(): Promise<void> {
	const isProduction = process.env.DEPLOY_TARGET === "production";
	const baseUrl = isProduction ? URL_BASE_PRODUCTION : URL_BASE_STAGING;
	const outputDir = isProduction ? BUILD_DIR_PRODUCTION : BUILD_DIR_STAGING;
	const command = `bunx svelte-sitemap -d ${baseUrl} -o ${outputDir} --attribution false`;

	try {
		logInfo(
			`Generating sitemap for ${isProduction ? "Production" : "Staging"}...`,
		);
		await runCommand(command);
		logSuccess("Sitemap generated successfully.");
	} catch (error) {
		logError("Failed to generate sitemap:", error);
		process.exit(1);
	}
}

await generateSitemap();
