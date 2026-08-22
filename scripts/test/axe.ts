import path from "node:path";
import { AxeBuilder } from "@axe-core/playwright";
import type { AxeResults } from "axe-core";
import type { Browser } from "playwright";
import {
	BUILD_PATH_PRODUCTION_RESOLVED,
	BUILD_PATH_STAGING_RESOLVED,
	CPU_COUNT,
	IS_MINIMAL,
	IS_PROD,
} from "$util/dyn";
import { getAllHtmlFiles, resolveIfExists } from "$util/file";
import { pLimit } from "$util/limit";
import { logDebug, logError, logInfo, logSuccess } from "$util/log";
import { measure } from "$util/measure";
import { closeBrowser, launchBrowser, navigateToPage } from "$util/playwright";
import { runCommand } from "$util/process";

const BUILD_DIR = IS_PROD
	? BUILD_PATH_PRODUCTION_RESOLVED
	: BUILD_PATH_STAGING_RESOLVED;

interface Timings {
	file_discovery: string;
	analysis: string;
	total: string;
}

interface AnalysisResults {
	file: string;
	violations: AxeResults["violations"];
}

interface ViolationSummary {
	file: string;
	id: string;
	description: string;
	nodes: Array<{ target: string }>;
}

const timings: Timings = {
	file_discovery: "",
	analysis: "",
	total: "",
};
let exitCode = 0;

const analyzePage = async (
	browser: Browser,
	file: string,
	dir: string,
): Promise<AnalysisResults> => {
	const relativePath = path.relative(dir, file);
	const results: AnalysisResults = { file: relativePath, violations: [] };
	logDebug(`Checking: ${relativePath}`);

	try {
		const page = await navigateToPage(browser, `file://${file}`);
		const axeBuilder = new AxeBuilder({
			page,
		}).options({
			runOnly: {
				type: "tag",
				values: [
					"wcag2a",
					"wcag2aa",
					"wcag21a",
					"wcag21aa",
					"best-practice",
				],
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

(async (): Promise<void> => {
	const startTotal = performance.now();

	let buildDir = resolveIfExists(BUILD_DIR);
	if (!buildDir) {
		await runCommand("vite build --logLevel error");
		buildDir = resolveIfExists(BUILD_DIR);
	}

	if (!buildDir) throw new Error("Build directory could not be created.");

	logDebug(`Analyzing files in: ${buildDir}`);

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
	const violationsSummary: ViolationSummary[] = [];
	let hasViolations = false;

	try {
		const startAnalysis = performance.now();
		const results = await Promise.all(
			htmlFiles.map((file) =>
				tasks(() => analyzePage(browser, file, buildDir)),
			),
		);
		timings.analysis = measure(startAnalysis);

		for (const { file, violations } of results) {
			if (violations.length) {
				hasViolations = true;
				for (const violation of violations) {
					violationsSummary.push({
						file,
						id: violation.id,
						description: violation.description,
						nodes: violation.nodes.map((node) => ({
							target: node.target.join(" "),
						})),
					});
				}
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
