import path from "node:path";
import { playAudit } from "playwright-lighthouse";
import { getAllHtmlFiles } from "../util/file.js";
import { logError, logInfo, logSuccess } from "../util/log.js";
import { closeBrowser, launchBrowser } from "../util/playwright.js";
import { startServer, stopServer, waitForServer } from "../util/server.js";

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
 * Run Lighthouse audit for a single page.
 * @param {import('playwright').Page} page - The Playwright page instance.
 * @param {string} url - The URL to audit.
 * @returns {Promise<void>}
 */
const analyzePage = async (page, url) => {
	try {
		logInfo(`Launching Lighthouse audit for ${url}`);
		const reportName = formatReportName(url);
		const reportPath = path.resolve(reportDir, `${reportName}`);

		await page.goto(url, { waitUntil: "load" });

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
			logError(`Lighthouse audit for ${url} did not return valid results.`);
			return;
		}

		logInfo(`Lighthouse audit completed for ${url}`);
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

		logInfo(`Lighthouse report saved to file://${reportPath}`);
	} catch (error) {
		logError(`Error analyzing page ${url}:`, error);
	}
};

/**
 * Run Lighthouse audits sequentially by navigating to different pages using the same browser instance.
 * @param {string[]} urls - List of URLs to audit.
 */
const runPerformanceTests = async (urls) => {
	logInfo(`Running tests sequentially for ${urls.length} pages...`);

	const browser = await launchBrowser();
	const page = await browser.newPage();

	try {
		for (const url of urls) {
			await analyzePage(page, url);
		}
	} catch (error) {
		logError("Error during sequential audits:", error);
	} finally {
		await closeBrowser(browser);
	}
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
