import path from "node:path";
import {
	BUILD_DIR_PRODUCTION,
	BUILD_DIR_STAGING,
	PORT,
	URL_SUBFOLDER_PRODUCTION,
	URL_SUBFOLDER_STAGING,
} from "$config";
import { getAllHtmlFiles } from "$util/file.js";
import { logError, logHeader, logInfo, logSuccess, logWarn } from "$util/log.js";
import { startServer, stopServer, waitForServer } from "$util/server.js";
import { test as base } from "@playwright/test";
import getPort from "get-port";
import { chromium } from "playwright";
import { playAudit } from "playwright-lighthouse";

const mode = process.env.MODE || null;
const specificPath = process.env.SPECIFIC || null;
const productionFlag = process.env.PRODUCTION === "true";

const BUILD_DIR = productionFlag ? BUILD_DIR_PRODUCTION : BUILD_DIR_STAGING;
const BUILD_CMD = productionFlag ? "build:prod" : "build";
const PREVIEW_CMD = productionFlag ? "preview:prod" : "preview";
const SUBFOLDER = productionFlag ? URL_SUBFOLDER_PRODUCTION : URL_SUBFOLDER_STAGING;
const BASE_URL = `http://localhost:${PORT}${SUBFOLDER}`;

// Lighthouse thresholds
const THRESHOLDS = {
	performance: 99,
	accessibility: 100,
	"best-practices": 100,
	seo: 100,
};

// Directory for Lighthouse reports
const timeStamp = new Date().toISOString().replace(/[:.]/g, "-");
const reportDir = `${process.cwd()}/.tmp/lighthouse/${timeStamp}`;

/**
 * Gathers pages to audit WITHOUT logging from the main process.
 * @returns {string[]} URLs of pages to audit.
 */
function gatherPagesToAudit() {
	// If specific page path is set: e.g., SPECIFIC=blog.html
	if (specificPath) {
		const relative = specificPath.replace(/^\/+/, "");
		return [`${BASE_URL}/${relative}`];
	}

	// If we want "all" mode
	if (mode === "all") {
		const files = getAllHtmlFiles(BUILD_DIR);
		return files.map(transformFileToUrl);
	}

	// If "minimal" mode (only first HTML file in each directory)
	if (mode === "minimal") {
		const files = getAllHtmlFiles(BUILD_DIR, true);
		return files.map(transformFileToUrl);
	}

	// Default: homepage only
	return [BASE_URL];
}

/**
 * Converts a file path into a fully qualified URL.
 * @param {string} filePath - A file path like "/path/to/build/page.html"
 * @returns {string} - The fully qualified URL, e.g. "http://localhost:4173/page.html"
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
 * @param {string} pageUrl - e.g. "http://localhost:4173/page.html"
 * @returns {string} - The formatted report name, e.g. "page.html"
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
 * @param {number|null} score - The category score (0-1).
 * @param {number} threshold - Required min percentage.
 */
function validateScore(category, score, threshold) {
	if (score === null) {
		logWarn(`${category}: No score available`);
		return;
	}
	const percentScore = Math.round(score * 100);
	if (percentScore >= threshold) {
		logSuccess(`${category}: ${percentScore} (>= ${threshold})`);
	} else {
		logError(`${category}: ${percentScore} (< ${threshold})`);
	}
}

/**
 * Performs the actual Lighthouse audit and logs results.
 * @param {import('playwright').Page} page - Playwright page.
 * @param {number} port - Debugging port used by Lighthouse.
 * @param {string} pageUrl - The URL to audit.
 */
async function auditSinglePage(page, port, pageUrl) {
	const reportName = createReportName(pageUrl);
	const reportFilePath = path.resolve(reportDir, reportName);

	// Navigate to the page
	await page.goto(pageUrl, { waitUntil: "load" });

	// Perform Lighthouse audit
	const auditResults = await playAudit({
		page,
		port,
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

	// Logging
	logHeader(`Auditing ${pageUrl}`);
	logInfo("Results");
	validateScore("  - Performance", performance.score, THRESHOLDS.performance);
	validateScore("  - Accessibility", accessibility.score, THRESHOLDS.accessibility);
	validateScore("  - Best Practices", bestPractices.score, THRESHOLDS["best-practices"]);
	validateScore("  - SEO", seo.score, THRESHOLDS.seo);
	logInfo(`Report saved: file://${reportFilePath}`);
}

// Gather pages (synchronously) so tests are known at discovery time.
const pagesToAudit = gatherPagesToAudit();

/**
 * Create a custom test fixture with a unique debugging port and a standard context.
 * (Persistent context is not required if you don't need to share state across pages.)
 */
const test = base.extend({
	// Unique port per worker
	port: [
		// biome-ignore lint/correctness/noEmptyPattern: <explanation>
		async ({}, use) => {
			const port = await getPort();
			await use(port);
		},
		{ scope: "worker" },
	],

	// Launch one browser context per test
	context: [
		async ({ port }, use) => {
			const browser = await chromium.launch({
				headless: true,
				args: [`--remote-debugging-port=${port}`],
			});
			// The "context" will actually be the "browser" in this example
			// because we only need a single page. If needed, you can do
			// "browser.newContext()" for more advanced usage.
			await use(browser);
			await browser.close();
		},
		{ scope: "test" },
	],

	// Provide a "page" from that context
	page: async ({ context }, use) => {
		const page = await context.newPage();
		await use(page);
		await page.close();
	},
});

let serverProcess;

// Start/stop the server in the main process
test.beforeAll(async () => {
	serverProcess = startServer(BUILD_DIR, BUILD_CMD, PREVIEW_CMD, PORT);
	await waitForServer(`http://localhost:${PORT}${SUBFOLDER}`);
});

test.afterAll(async () => {
	stopServer(serverProcess);
});

/**
 * Run tests in parallel for all pages
 */
test.describe
	.parallel("Lighthouse audits", () => {
		for (const pageUrl of pagesToAudit) {
			test(`Lighthouse audit for: ${pageUrl}`, async ({ page, port }) => {
				try {
					await auditSinglePage(page, port, pageUrl);
				} catch (err) {
					logError(`Error analyzing ${pageUrl}:`, err);
					throw err;
				}
			});
		}
	});
