import path from "node:path";
import { test as base } from "@playwright/test";
import getPort from "get-port";
import { chromium } from "playwright";
import { playAudit } from "playwright-lighthouse";
import { getAllHtmlFiles } from "../util/file.js";
import { logError, logHeader, logInfo, logSuccess } from "../util/log.js";
import { startServer, stopServer, waitForServer } from "../util/server.js";

const mode = process.env.MODE || null;
const specificPath = process.env.SPECIFIC || null;
const productionFlag = process.env.PRODUCTION === "true";

const PORT = 4173;
const BUILD_DIR = productionFlag ? "build/production" : "build/staging";
const BUILD_CMD = productionFlag ? "build:production" : "build";
const PREVIEW_CMD = productionFlag ? "preview:production" : "preview";
const SUBFOLDER = productionFlag ? "" : "/mikrouli";
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

// Gather pages to audit
const pagesToAudit = gatherPagesToAudit();

// Reference to the server process
let serverProcess;

/**
 * Gathers the pages to audit WITHOUT logging (so we don't log from main process).
 * @returns {string[]} - The list of URLs to audit.
 */
function gatherPagesToAudit() {
	if (specificPath) {
		// e.g., SPECIFIC=blog.html
		const relative = specificPath.replace(/^\/+/, "");
		return [`${BASE_URL}/${relative}`];
	}
	if (mode === "all") {
		const files = getAllHtmlFiles(BUILD_DIR);
		return files.map(transformFileToUrl);
	}
	if (mode === "minimal") {
		const files = getAllHtmlFiles(BUILD_DIR, true);
		return files.map(transformFileToUrl);
	}

	// default: homepage only
	return [BASE_URL];
}

/**
 * Converts a file path into a fully qualified URL.
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
 */
function createReportName(pageUrl) {
	const pathName = new URL(pageUrl).pathname;
	let url = pathName.replace(/^\/|\/$/g, "").replace(/\//g, "-");
	if (!url.endsWith(".html")) url += ".html";
	return url;
}

/**
 * Validates a Lighthouse score against thresholds.
 */
function validateScore(category, score, threshold) {
	const percentScore = Math.round(score * 100);
	if (percentScore >= threshold) {
		logSuccess(`${category}: ${percentScore} (>= ${threshold})`);
	} else {
		logError(`${category}: ${percentScore} (< ${threshold})`);
	}
}

/**
 * Custom test fixture with a unique debugging port and a persistent context.
 */
const test = base.extend({
	port: [
		// biome-ignore lint/correctness/noEmptyPattern: <explanation>
		async ({}, use) => {
			const port = await getPort();
			await use(port);
		},
		{ scope: "worker" },
	],

	context: [
		async ({ port }, use) => {
			const context = await chromium.launch({
				headless: true,
				args: [`--remote-debugging-port=${port}`],
			});
			await use(context);
			await context.close();
		},
		{ scope: "test" },
	],

	page: async ({ context }, use) => {
		const page = await context.newPage();
		await use(page);
	},
});

// We start/stop the server from the main process. That is typical.
test.beforeAll(async () => {
	serverProcess = startServer(BUILD_DIR, BUILD_CMD, PREVIEW_CMD, PORT);
	await waitForServer(BASE_URL);
});

test.afterAll(async () => stopServer(serverProcess));

/**
 * Because we want each test in parallel, use `test.describe.parallel`.
 * We define a single `beforeAll` inside the describe to log "mode" from the worker side.
 */
test.describe
	.parallel("Lighthouse audits", () => {
		for (const pageUrl of pagesToAudit) {
			test(`Lighthouse audit for: ${pageUrl}`, async ({ page, port }) => {
				try {
					const reportName = createReportName(pageUrl);
					const reportFilePath = path.resolve(reportDir, reportName);

					await page.goto(pageUrl, { waitUntil: "load" });

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
					}

					const {
						performance,
						accessibility,
						"best-practices": bestPractices,
						seo,
					} = auditResults.lhr.categories;

					logHeader(`Auditing ${pageUrl}`);
					logInfo("Results");
					validateScore("  - Performance", performance.score, THRESHOLDS.performance);
					validateScore(
						"  - Accessibility",
						accessibility.score,
						THRESHOLDS.accessibility,
					);
					validateScore(
						"  - Best Practices",
						bestPractices.score,
						THRESHOLDS["best-practices"],
					);
					validateScore("  - SEO", seo.score, THRESHOLDS.seo);
					logInfo(`Report saved: file://${reportFilePath}`);
				} catch (err) {
					logError(`Error analyzing ${pageUrl}:`, err);
					throw err;
				}
			});
		}
	});
