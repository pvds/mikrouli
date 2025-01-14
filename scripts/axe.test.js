import fs from "node:fs";
import path from "node:path";
import { AxeBuilder } from "@axe-core/playwright";
import { chromium } from "playwright";
import { logError, logInfo, logSuccess } from "./log.js";

(async () => {
	// Path to your static site output directory
	const buildDir = path.resolve("./build");
	logInfo(`Analyzing files in: ${buildDir}`);

	const htmlFiles = fs.readdirSync(buildDir).filter((file) => file.endsWith(".html"));
	logSuccess(`Found ${htmlFiles.length} HTML files`);

	if (htmlFiles.length === 0) {
		logInfo("No HTML files found. Exiting.");
		return;
	}

	const browser = await chromium.launch({ headless: true });

	try {
		for (const file of htmlFiles) {
			console.log(`Starting analysis for file: ${file}`);
			const context = await browser.newContext();
			const page = await context.newPage();

			try {
				const filePath = `file://${path.join(buildDir, file)}`;
				logInfo(`Navigating to: ${filePath}`);
				await page.goto(filePath);

				const results = await new AxeBuilder({ page }).analyze();
				logSuccess(`Results for ${file}:`);
				if (results.violations.length > 0) {
					logInfo(`Accessibility issues found on ${filePath}:`);
					for (const violation of results.violations) {
						logError(`- ${violation.id}: ${violation.description}`);
						for (const node of violation.nodes) {
							logError(`  Element: ${node.target}`);
						}
					}
				} else {
					logSuccess(`No accessibility issues found on ${filePath}`);
				}
			} catch (pageError) {
				logError(`Error processing file ${file}:`, pageError);
			} finally {
				await page.close();
				await context.close();
			}
		}
	} catch (iterationError) {
		logError("Error during file iteration:", iterationError);
	} finally {
		logInfo("Closing browser...");
		await browser.close();
		logInfo("Browser closed.");
	}
})();
