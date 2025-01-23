import path from "node:path";
import pLimit from "p-limit";
import { playAudit } from "playwright-lighthouse";
import { getAllHtmlFiles } from "../util/file.js";
import { logError, logInfo, logSuccess } from "../util/log.js";
import { closeBrowser, launchBrowser } from "../util/playwright.js";
import { startServer, stopServer, waitForServer } from "../util/server.js";

// TODO: run on multiple pages concurrently with a limit (see axe.test.js logic)

// Parse command-line arguments
const args = process.argv.slice(2);
const isProduction = args.includes("--prod");
const isMinimal = args.includes("--minimal");
const isAll = args.includes("--all");

const BUILD_DIR = isProduction ? "build/production" : "build/staging";
const SUBFOLDER = isProduction ? "" : "/mikrouli";
const BUILD_COMMAND = isProduction ? "build:production" : "build";
const PREVIEW_COMMAND = isProduction ? "preview:production" : "preview";
const PORT = 4173;
const DEBUG_PORT = 9222;
const BASE_URL = `http://localhost:${PORT}${SUBFOLDER}`;
const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
const reportDir = `${process.cwd()}/.tmp/lighthouse/${timestamp}`;

const THRESHOLDS = {
	performance: 99,
	accessibility: 100,
	"best-practices": 100,
	seo: 100,
};

// Limit concurrency for performance tests (using half of available CPUs)
const cpuCount = require("node:os").cpus().length;
const maxConcurrency = Math.max(2, Math.floor(cpuCount / 2));
const tasks = pLimit(1);

/**
 * Generate an array of URLs to audit based on the command-line flags.
 * @returns {string[]} - List of URLs to audit.
 */
const getPagesToAudit = () => {
	let htmlFiles = [];

	if (isMinimal) {
		logInfo("Running in minimal mode: testing only first HTML files in directories.");
		htmlFiles = getAllHtmlFiles(BUILD_DIR, true);
	} else if (isAll) {
		logInfo("Running in all pages mode: testing all HTML files.");
		htmlFiles = getAllHtmlFiles(BUILD_DIR);
	} else {
		logInfo("No flags provided: testing homepage only.");
		return [`${BASE_URL}`];
	}

	return htmlFiles.map(
		(file) =>
			`${BASE_URL}${file
				.replace(BUILD_DIR, "")
				.replace(/\\/g, "/")
				.replace(/index\.html$/, "")}`,
	);
};

/**
 * Validate audit scores against defined thresholds.
 * @param {string} category - Audit category.
 * @param {number} score - Achieved score (0-1).
 * @param {number} threshold - Minimum required score.
 */
const validateScore = (category, score, threshold) => {
	const percentageScore = score * 100;
	if (percentageScore >= threshold) {
		logSuccess(`${category}: ${percentageScore} (meets threshold of ${threshold})`);
	} else {
		logError(`${category}: ${percentageScore} (below threshold of ${threshold})`);
	}
};

/**
 * Extracts a user-friendly name from a URL (e.g., http://localhost:4173/mikrouli -> mikrouli).
 * @param {string} url - The page URL.
 * @returns {string} - The formatted page name.
 */
const formatReportName = (url) => {
	const pathname = new URL(url).pathname;
	return pathname.replace(/^\//, "").replace(/\//g, "-") || "home";
};

/**
 * Run a single Lighthouse performance audit.
 * @param {string} url - The URL to audit.
 * @returns {Promise<void>}
 */
const analyzePage = async (url) => {
	const browser = await launchBrowser();

	try {
		logInfo(`Launching Lighthouse audit for ${url}`);
		const reportName = formatReportName(url);
		const reportPath = path.resolve(reportDir, `${reportName}`);
		const page = await browser.newPage();
		await page.goto(url);

		page.on("console", (msg) => {
			const message = msg.text();
			logInfo(message);
		});

		const lighthouseResults = await playAudit({
			page,
			port: DEBUG_PORT,
			thresholds: THRESHOLDS,
			disableLogs: true,
			ignoreError: true,
			reports: {
				formats: { html: true, json: false },
				directory: reportDir,
				name: reportName,
			},
		});

		if (!lighthouseResults?.lhr) {
			logError("Lighthouse audit did not return valid results.");
			return;
		}

		logInfo("Lighthouse audit completed:");
		const {
			performance,
			accessibility,
			"best-practices": bestPractices,
			seo,
		} = lighthouseResults.lhr.categories;

		validateScore("  - Performance", performance.score, THRESHOLDS.performance);
		validateScore("  - Accessibility", accessibility.score, THRESHOLDS.accessibility);
		validateScore("  - Best Practices", bestPractices.score, THRESHOLDS["best-practices"]);
		validateScore("  - SEO", seo.score, THRESHOLDS.seo);

		logInfo("\n", `Lighthouse report saved to file://${reportPath}`);
	} catch (error) {
		logError(`Error running Lighthouse audit for ${url}:`, error);
	} finally {
		await closeBrowser(browser);
	}
};

/**
 * Run multiple Lighthouse performance audits concurrently with a limit.
 * @param {string[]} urls - Array of URLs to audit.
 */
const runPerformanceTests = async (urls) => {
	await Promise.all(urls.map((url) => tasks(() => analyzePage(url))));
};

(async () => {
	const startTotal = performance.now();
	const viteServer = startServer(BUILD_DIR, BUILD_COMMAND, PREVIEW_COMMAND, PORT);

	try {
		await waitForServer(BASE_URL);

		// Get pages to audit based on the command-line arguments
		const pagesToAudit = getPagesToAudit();
		logInfo(`Testing ${pagesToAudit.length} pages...`);

		await runPerformanceTests(pagesToAudit);
	} catch (error) {
		logError("Error during setup:", error);
		process.exit(1);
	} finally {
		const totalTime = ((performance.now() - startTotal) / 1000).toFixed(2);
		logInfo(`Total time: ${totalTime} s`);
		stopServer(viteServer);
	}
})();
