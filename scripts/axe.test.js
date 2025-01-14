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

// Analyze a single page
async function analyzePage(browser, file, dir) {
	const context = await browser.newContext();
	const page = await context.newPage();
	const results = { file, violations: [] };

	try {
		const filePath = `file://${file}`;
		const relativePath = path.relative(dir, file); // Get the relative path from the build
		logInfo(`Navigating to: ${relativePath}`);
		await page.goto(filePath);

		const axeResults = await new AxeBuilder({ page }).analyze();
		results.violations = axeResults.violations;
	} catch (error) {
		logError(`Error processing file ${file}:`, error);
	} finally {
		await page.close();
		await context.close();
	}

	return results;
}

(async () => {
	let hasViolations = false;
	const violationsSummary = [];

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
		const maxConcurrency = 5; // Limit concurrency to avoid overloading
		const chunks = Array.from(
			{ length: Math.ceil(htmlFiles.length / maxConcurrency) },
			(_, i) => htmlFiles.slice(i * maxConcurrency, i * maxConcurrency + maxConcurrency),
		);

		for (const chunk of chunks) {
			const results = await Promise.all(
				chunk.map((file) => analyzePage(browser, file, buildDir)),
			);
			for (const result of results) {
				if (result.violations.length > 0) {
					hasViolations = true;
					violationsSummary.push(
						...result.violations.map((violation) => ({
							...violation,
							file: result.file,
						})),
					);
				}
			}
		}
	} catch (iterationError) {
		logError("Error during file iteration:", iterationError);
	} finally {
		logInfo("Closing browser...");
		await browser.close();
		logInfo("Browser closed.");
	}

	// Report all violations at the end
	if (hasViolations) {
		logInfo("Accessibility violations found across the following pages:");
		for (const violation of violationsSummary) {
			logError(`Page: ${violation.file}`);
			logError(`  - Rule: ${violation.id}`);
			logError(`  - Description: ${violation.description}`);
			for (const node of violation.nodes) {
				logError(`    Element: ${node.target}`);
			}
		}
		process.exit(1);
	} else {
		logSuccess("No accessibility violations found.");
		process.exit(0);
	}
})();
