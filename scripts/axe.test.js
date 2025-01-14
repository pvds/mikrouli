import fs from "node:fs";
import path from "node:path";
import { AxeBuilder } from "@axe-core/playwright";
import { chromium } from "playwright";
import { logError, logInfo, logSuccess } from "./log.js";

// Function to recursively find all HTML files in a directory
function getAllHtmlFiles(dir) {
	let htmlFiles = [];
	const files = fs.readdirSync(dir);

	for (const file of files) {
		const fullPath = path.join(dir, file);
		const stat = fs.statSync(fullPath);

		if (stat.isDirectory()) {
			// Recursively search subdirectories
			htmlFiles = htmlFiles.concat(getAllHtmlFiles(fullPath));
		} else if (file.endsWith(".html")) {
			// Add HTML files to the list
			htmlFiles.push(fullPath);
		}
	}

	return htmlFiles;
}

(async () => {
	let hasViolations = false; // Flag to track if violations are found

	// Path to your static site output directory
	const buildDir = path.resolve("./build");
	logInfo(`Analyzing files in: ${buildDir}`);

	// Get all HTML files in the build directory, including subdirectories
	const htmlFiles = getAllHtmlFiles(buildDir);
	logSuccess(`Found ${htmlFiles.length} HTML files`);

	if (htmlFiles.length === 0) {
		logInfo("No HTML files found. Exiting.");
		return;
	}

	const browser = await chromium.launch({ headless: true });

	try {
		for (const file of htmlFiles) {
			logInfo(`Starting analysis for file: ${file}`);
			const context = await browser.newContext();
			const page = await context.newPage();

			try {
				const filePath = `file://${file}`;
				logInfo(`Navigating to: ${filePath}`);
				await page.goto(filePath);

				const results = await new AxeBuilder({ page }).analyze();
				logSuccess(`Results for ${file}:`);
				if (results.violations.length > 0) {
					hasViolations = true; // Set flag if violations are found
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

	// Exit with a non-zero code if violations were found
	if (hasViolations) {
		logError("Accessibility violations were found.");
		process.exit(1);
	} else {
		logSuccess("No accessibility violations found.");
		process.exit(0);
	}
})();
