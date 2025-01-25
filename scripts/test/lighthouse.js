import path from "node:path";
import { playAudit } from "playwright-lighthouse";
import { getAllHtmlFiles } from "../util/file.js";
import { logError, logHeader, logInfo, logSuccess } from "../util/log.js";
import { measure } from "../util/measure.js";
import { closeBrowser, launchBrowser } from "../util/playwright.js";
import { startServer, stopServer, waitForServer } from "../util/server.js";

// Parse flags
const flags = ["--prod", "--minimal", "--all"];
const [productionFlag, minimalFlag, allPagesFlag] = flags.map((flag) =>
	process.argv.includes(flag),
);
const specificIndex = process.argv.indexOf("--specific");
const specificPath =
	specificIndex !== -1 && process.argv[specificIndex + 1]
		? process.argv[specificIndex + 1]
		: null;

// Constants
const BUILD_DIR = productionFlag ? "build/production" : "build/staging";
const SUBFOLDER = productionFlag ? "" : "/mikrouli";
const BUILD_CMD = productionFlag ? "build:production" : "build";
const PREVIEW_CMD = productionFlag ? "preview:production" : "preview";
const PORT = 4173;
const DEBUG_PORT = 9222;
const BASE_URL = `http://localhost:${PORT}${SUBFOLDER}`;
const THRESHOLDS = {
	performance: 99,
	accessibility: 100,
	"best-practices": 100,
	seo: 100,
};

const timeStamp = new Date().toISOString().replace(/[:.]/g, "-");
const reportDir = `${process.cwd()}/.tmp/lighthouse/${timeStamp}`;
const startTime = performance.now();
const serverProcess = startServer(BUILD_DIR, BUILD_CMD, PREVIEW_CMD, PORT);

waitForServer(BASE_URL)
	.then(() => {
		const pagesToAudit = gatherPagesToAudit();
		logSuccess(`Running tests for ${pagesToAudit.length} page(s)...`);
		return runPerformanceTests(pagesToAudit); // returns a promise, so `.then()` will wait for it to complete
	})
	.catch((error) => {
		logError("Error during setup:", error);
		process.exit(1);
	})
	.finally(() => {
		const totalTime = measure(startTime);
		logInfo(`Total time: ${totalTime} s`);
		stopServer(serverProcess);
	});

/**
 * Runs Lighthouse audits sequentially for each page URL.
 * @param {string[]} pageUrls - The list of URLs to audit.
 */
async function runPerformanceTests(pageUrls) {
	const { browser, page } = await launchBrowser();

	try {
		for (const pageUrl of pageUrls) await analyzePage(page, pageUrl);
	} catch (error) {
		logError("Error during audits:", error);
	} finally {
		await closeBrowser(browser);
	}
}

/**
 * Performs a Lighthouse audit on a single page.
 * @param {import('playwright').Page} page - The Playwright page instance.
 * @param {string} pageUrl - The URL to audit.
 */
async function analyzePage(page, pageUrl) {
	try {
		logHeader(`Auditing ${pageUrl}`);
		const reportName = createReportName(pageUrl);
		const reportFilePath = path.resolve(reportDir, reportName);

		await page.goto(pageUrl, { waitUntil: "load" });
		const auditResults = await playAudit({
			// @ts-ignore - weird playwright type error
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

		if (!auditResults?.lhr) {
			logError(`No valid results for ${pageUrl}`);
			return;
		}

		const {
			performance,
			accessibility,
			"best-practices": bestPractices,
			seo,
		} = auditResults.lhr.categories;

		logInfo("Results");
		validateScore("  - Performance", performance.score, THRESHOLDS.performance);
		validateScore("  - Accessibility", accessibility.score, THRESHOLDS.accessibility);
		validateScore("  - Best Practices", bestPractices.score, THRESHOLDS["best-practices"]);
		validateScore("  - SEO", seo.score, THRESHOLDS.seo);
		logInfo(`Report saved: file://${reportFilePath}`);
	} catch (error) {
		logError(`Error analyzing ${pageUrl}:`, error);
	}
}

/**
 * Identifies which pages to audit based on CLI flags.
 * @returns {string[]} - The list of URLs to audit.
 */
function gatherPagesToAudit() {
	if (specificPath) {
		// e.g., user runs: node script.js --specific blog.html
		logInfo(`Specific mode: testing only "${specificPath}"`);
		// Return that path appended to BASE_URL (removing any leading slash)
		const relative = specificPath.replace(/^\/+/, "");
		return [`${BASE_URL}/${relative}`];
	}
	if (allPagesFlag) {
		logInfo("All mode: testing all HTML files.");
		const files = getAllHtmlFiles(BUILD_DIR);
		return files.map(transformFileToUrl);
	}
	if (minimalFlag) {
		logInfo("Minimal mode: only first HTML file in each directory.");
		const files = getAllHtmlFiles(BUILD_DIR, true);
		return files.map(transformFileToUrl);
	}
	logInfo("No flags: testing homepage only.");
	return [BASE_URL];
}

/**
 * Convert a file path into a fully qualified URL
 * @param {string} filePath
 * @returns {string} - Formatted file URL.
 */
function transformFileToUrl(filePath) {
	return (
		BASE_URL +
		filePath
			.replace(BUILD_DIR, "")
			.replace(/\\/g, "/")
			.replace(/index\.html$/, "")
	);
}

/**
 * Creates a human-readable name for the Lighthouse report file.
 * @param {string} pageUrl
 * @returns {string} - The formatted report name.
 */
function createReportName(pageUrl) {
	const pathName = new URL(pageUrl).pathname;
	let url = pathName.replace(/^\/|\/$/g, "").replace(/\//g, "-");
	if (!url.endsWith(".html")) url += ".html";
	return url;
}

/**
 * Validates a Lighthouse score against thresholds.
 * @param {string} category - e.g. "Performance"
 * @param {number} score - The category score (0-1).
 * @param {number} threshold - Required minimum percentage.
 */
function validateScore(category, score, threshold) {
	const percentScore = Math.round(score * 100);
	if (percentScore >= threshold) logSuccess(`${category}: ${percentScore} (>= ${threshold})`);
	else logError(`${category}: ${percentScore} (< ${threshold})`);
}
