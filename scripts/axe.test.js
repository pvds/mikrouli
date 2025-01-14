import fs from "node:fs";
import path from "node:path";
import { AxeBuilder } from "@axe-core/playwright";
import { chromium } from "playwright";
import { logDebug, logError, logInfo, logSuccess } from "./log.js";

// Function to recursively find all HTML files in a directory
const getAllHtmlFiles = (dir) =>
	fs.readdirSync(dir).flatMap((file) => {
		const fullPath = path.join(dir, file);
		return fs.statSync(fullPath).isDirectory()
			? getAllHtmlFiles(fullPath)
			: file.endsWith(".html")
				? [fullPath]
				: [];
	});

// Analyze a single page
const analyzePage = async (browser, file, dir) => {
	const context = await browser.newContext();
	const page = await context.newPage();
	const relativePath = path.relative(dir, file); // Get the relative path from the build
	logDebug(`Checking: ${relativePath}`);

	try {
		await page.goto(`file://${file}`);
		const axeResults = await new AxeBuilder({ page }).analyze();
		return { file: relativePath, violations: axeResults.violations };
	} catch (error) {
		logError(`Error processing file ${relativePath}:`, error);
		return { file: relativePath, violations: [] };
	} finally {
		await page.close();
		await context.close();
	}
};

(async () => {
	const buildDir = path.resolve("./build");
	logDebug(`Analyzing files in: ${buildDir}`);

	// Get all HTML files in the build directory, including subdirectories
	const htmlFiles = getAllHtmlFiles(buildDir);
	logSuccess(`Found ${htmlFiles.length} HTML files`);

	if (htmlFiles.length === 0) {
		logInfo("No HTML files found. Exiting.");
		return;
	}

	const browser = await chromium.launch({ headless: true });
	const violationsSummary = [];
	let hasViolations = false;

	try {
		const maxConcurrency = 5; // Limit concurrency to avoid overloading
		const results = await Promise.all(
			htmlFiles
				.map((file, index) =>
					// Group tasks into chunks of maxConcurrency
					index % maxConcurrency === 0
						? Promise.all(
								htmlFiles
									.slice(index, index + maxConcurrency)
									.map((chunkFile) => analyzePage(browser, chunkFile, buildDir)),
							)
						: null,
				)
				.filter(Boolean), // Remove null values from non-chunk indices
		);

		// Collect and summarize violations
		for (const { file, violations } of results.flat()) {
			if (violations.length) {
				hasViolations = true;
				for (const violation of violations) violationsSummary.push({ file, ...violation });
			}
		}
	} catch (error) {
		logError("Error during file iteration:", error);
	} finally {
		logDebug("Closing browser...");
		await browser.close();
		logSuccess("Browser closed.");
	}

	// Report all violations at the end
	if (hasViolations) {
		logInfo("Accessibility violations found across the following pages:");
		for (const { file, id, description, nodes } of violationsSummary) {
			logError(`Page: ${file}`);
			logError(`  - Rule: ${id}`);
			logError(`  - Description: ${description}`);
			for (const { target } of nodes) logError(`    Element: ${target}`);
		}
		process.exit(1);
	} else {
		logSuccess("No accessibility violations found.");
		process.exit(0);
	}
})();
