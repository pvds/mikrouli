import path from "node:path";
import {
	BUILD_PATH_PRODUCTION_RESOLVED,
	BUILD_PATH_STAGING_RESOLVED,
	CPU_COUNT,
	IS_MINIMAL,
	IS_PROD,
} from "$util/dyn";
import { getAllHtmlFiles, resolveIfExists } from "$util/file";
import { logDebug, logError, logInfo, logSuccess } from "$util/log";
import { measure } from "$util/measure";
import { closeBrowser, launchBrowser, navigateToPage } from "$util/playwright";
import { runCommand } from "$util/process";
import { AxeBuilder } from "@axe-core/playwright";
import pLimit from "p-limit";

const BUILD_DIR = IS_PROD ? BUILD_PATH_PRODUCTION_RESOLVED : BUILD_PATH_STAGING_RESOLVED;
const timings = {
	file_discovery: "",
	analysis: "",
	total: "",
};
let exitCode = 0;

/**
 * Analyze a single page for accessibility violations.
 * @typedef {import('axe-core').AxeResults['violations']} Violations
 * @typedef {{file: string, violations: Violations}} AnalysisResults
 *
 * @param {import('playwright').Browser} browser - The browser instance.
 * @param {string} file - Path to the HTML file to analyze.
 * @param {string} dir - The base directory.
 * @returns {Promise<AnalysisResults>} - The analysis results.
 */
const analyzePage = async (browser, file, dir) => {
	const relativePath = path.relative(dir, file);
	/** @type AnalysisResults */
	const results = { file: relativePath, violations: [] };
	logDebug(`Checking: ${relativePath}`);

	try {
		const page = await navigateToPage(browser, `file://${file}`);
		const axeBuilder = new AxeBuilder({
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
		results.violations = axeResults.violations;

		return results;
	} catch (error) {
		logError(`Error processing file ${relativePath}:`, error);
		return results;
	}
};

(async () => {
	const startTotal = performance.now();

	const buildDir =
		resolveIfExists(BUILD_DIR) ||
		(() => {
			runCommand("vite build --logLevel error");
			return resolveIfExists(BUILD_DIR);
		})();

	if (!buildDir) throw new Error("Build directory could not be created.");

	logDebug(`Analyzing files in: ${buildDir}`);

	// Measure file discovery time
	const startFileDiscovery = performance.now();
	const htmlFiles = getAllHtmlFiles(buildDir, IS_MINIMAL);
	timings.file_discovery = measure(startFileDiscovery);

	logSuccess(`Found ${htmlFiles.length} HTML files`);

	if (htmlFiles.length === 0) {
		logInfo("No HTML files found. Exiting.");
		return;
	}

	const { browser } = await launchBrowser();
	const tasks = pLimit(CPU_COUNT);
	const violationsSummary = [];
	let hasViolations = false;

	try {
		// Measure analysis time
		const startAnalysis = performance.now();
		const results = await Promise.all(
			htmlFiles.map((file) => tasks(() => analyzePage(browser, file, buildDir))),
		);
		timings.analysis = measure(startAnalysis);

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
	timings.total = measure(startTotal);
	for (const [key, value] of Object.entries(timings)) {
		logInfo(`  ${key}: ${value}`);
	}

	process.exit(exitCode);
})();
