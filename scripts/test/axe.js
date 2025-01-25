import { cpus } from "node:os";
import path from "node:path";
import { AxeBuilder } from "@axe-core/playwright";
import pLimit from "p-limit";
import { getAllHtmlFiles, resolveIfExists, runCommand } from "../util/file.js";
import { logDebug, logError, logInfo, logSuccess } from "../util/log.js";
import { measure } from "../util/measure.js";
import { closeBrowser, launchBrowser, navigateToPage } from "../util/playwright.js";

// Parse command-line arguments
const args = process.argv.slice(2);
const isMinimal = args.includes("--minimal");
const BUILD_DIR = args.includes("--prod") ? "./build/production" : "./build/staging";

const cpuCount = cpus().length;
const maxConcurrency = Math.max(2, Math.floor(cpuCount / 2));
const timings = {};
let exitCode = 0;

/**
 * Analyze a single page for accessibility violations.
 * @param {import('playwright').Browser} browser - The browser instance.
 * @param {string} file - Path to the HTML file to analyze.
 * @param {string} dir - The base directory.
 * @returns {Promise<Object>} - Analysis results.
 */
const analyzePage = async (browser, file, dir) => {
	const relativePath = path.relative(dir, file);
	logDebug(`Checking: ${relativePath}`);

	try {
		const page = await navigateToPage(browser, `file://${file}`);
		const axeBuilder = new AxeBuilder({
			// @ts-ignore - weird playwright type error
			page,
		}).options({
			runOnly: {
				type: "tag",
				values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "best-practice"],
			},
		});

		if (!file.endsWith("index.html")) {
			axeBuilder.include("main");
		}

		const axeResults = await axeBuilder.analyze();
		return { file: relativePath, violations: axeResults.violations };
	} catch (error) {
		logError(`Error processing file ${relativePath}:`, error);
		return { file: relativePath, violations: [] };
	}
};

(async () => {
	const startTotal = performance.now();

	const buildDir = resolveIfExists(BUILD_DIR);
	if (!buildDir) {
		runCommand("vite build --logLevel error");
	}
	logDebug(`Analyzing files in: ${buildDir}`);

	// Measure file discovery time
	const startFileDiscovery = performance.now();
	const htmlFiles = getAllHtmlFiles(buildDir, isMinimal);
	timings["File Discovery Time"] = measure(startFileDiscovery);

	logSuccess(`Found ${htmlFiles.length} HTML files`);

	if (htmlFiles.length === 0) {
		logInfo("No HTML files found. Exiting.");
		return;
	}

	const { browser } = await launchBrowser();
	const tasks = pLimit(maxConcurrency);
	const violationsSummary = [];
	let hasViolations = false;

	try {
		// Measure analysis time
		const startAnalysis = performance.now();
		const results = await Promise.all(
			htmlFiles.map((file) => tasks(() => analyzePage(browser, file, buildDir))),
		);
		timings["Analysis Time"] = measure(startAnalysis);

		// Collect and summarize violations
		for (const { file, violations } of results) {
			if (violations.length) {
				hasViolations = true;
				for (const violation of violations) violationsSummary.push({ file, ...violation });
			}
		}
	} catch (error) {
		logError("Error during file iteration:", error);
	} finally {
		await closeBrowser(browser);
	}

	if (hasViolations) {
		logInfo("Accessibility violations found across the following pages:");
		for (const { file, id, description, nodes } of violationsSummary) {
			logError(`Page: ${file}`);
			logError(`  - Rule: ${id}`);
			logError(`  - Description: ${description}`);
			for (const { target } of nodes) logError(`    Element: ${target}`);
		}
		exitCode = 1;
	} else {
		logSuccess("No accessibility violations found.");
	}

	logInfo("Timing Summary:");
	timings["Total Execution Time"] = measure(startTotal);
	for (const [key, value] of Object.entries(timings)) {
		logInfo(`  ${key}: ${value}`);
	}

	process.exit(exitCode);
})();
