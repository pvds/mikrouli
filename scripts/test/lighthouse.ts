import path from "node:path";
import type { Page } from "playwright";
import { playAudit } from "playwright-lighthouse";
import {
	DEBUG_PORT,
	PORT,
	THRESHOLDS,
	URL_SUBFOLDER_PRODUCTION,
	URL_SUBFOLDER_STAGING,
} from "$config";
import {
	BUILD_PATH_PRODUCTION_RESOLVED,
	BUILD_PATH_STAGING_RESOLVED,
	IS_ALL,
	IS_MINIMAL,
	IS_PROD,
	REPORTS_PATH_RESOLVED,
} from "$util/dyn";
import { getAllHtmlFiles } from "$util/file";
import { logError, logHeader, logInfo, logSuccess, logWarn } from "$util/log";
import { measure } from "$util/measure";
import { closeBrowser, launchBrowser } from "$util/playwright";
import { startServer, stopServer, waitForServer } from "$util/server";

const specificIndex = process.argv.indexOf("--specific");
const specificPath =
	specificIndex !== -1 && process.argv[specificIndex + 1]
		? process.argv[specificIndex + 1]
		: null;

const BUILD_DIR = IS_PROD
	? BUILD_PATH_PRODUCTION_RESOLVED
	: BUILD_PATH_STAGING_RESOLVED;
const SUBFOLDER = IS_PROD ? URL_SUBFOLDER_PRODUCTION : URL_SUBFOLDER_STAGING;
const BASE_URL = `http://localhost:${PORT}${SUBFOLDER}`;
const BUILD_CMD = IS_PROD ? "build:prod" : "build";
const PREVIEW_CMD = IS_PROD ? "preview:prod" : "preview";

const timeStamp = new Date().toISOString().replace(/[:.]/g, "-");
const reportDir = path.join(REPORTS_PATH_RESOLVED, "lighthouse", timeStamp);
const startTime = performance.now();
const serverProcess = await startServer(
	BUILD_DIR,
	BUILD_CMD,
	PREVIEW_CMD,
	PORT,
);

interface AuditResults {
	lhr?: {
		categories: {
			performance: { score: number };
			accessibility: { score: number };
			"best-practices": { score: number };
			seo: { score: number };
		};
	};
}

const hasAuditResults = (value: unknown): value is AuditResults => {
	if (!value || typeof value !== "object" || !("lhr" in value)) return false;
	const lhr = (value as { lhr?: unknown }).lhr;
	if (!lhr || typeof lhr !== "object" || !("categories" in lhr)) return false;
	const categories = (lhr as { categories?: unknown }).categories;
	return categories !== null && typeof categories === "object";
};

await waitForServer(BASE_URL)
	.then(() => {
		const pagesToAudit = gatherPagesToAudit();
		logSuccess(`Running tests for ${pagesToAudit.length} page(s)...`);
		return runPerformanceTests(pagesToAudit);
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

async function runPerformanceTests(pageUrls: string[]): Promise<void> {
	const { browser, page } = await launchBrowser();

	try {
		for (const pageUrl of pageUrls) await analyzePage(page, pageUrl);
	} catch (error) {
		logError("Error during audits:", error);
	} finally {
		await closeBrowser(browser);
	}
}

async function analyzePage(page: Page, pageUrl: string): Promise<void> {
	try {
		logHeader(`Auditing ${pageUrl}`);
		const reportName = createReportName(pageUrl);
		const reportFilePath = path.resolve(reportDir, reportName);

		await page.goto(pageUrl, { waitUntil: "load" });
		const auditResultsRaw = await playAudit({
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

		if (!hasAuditResults(auditResultsRaw) || !auditResultsRaw.lhr) {
			logError(`No valid results for ${pageUrl}`);
			return;
		}

		const {
			performance,
			accessibility,
			"best-practices": bestPractices,
			seo,
		} = auditResultsRaw.lhr.categories;

		logInfo("Results");
		validateScore(
			"  - Performance",
			performance.score,
			THRESHOLDS.performance as number,
		);
		validateScore(
			"  - Accessibility",
			accessibility.score,
			THRESHOLDS.accessibility as number,
		);
		validateScore(
			"  - Best Practices",
			bestPractices.score,
			THRESHOLDS["best-practices"] as number,
		);
		validateScore("  - SEO", seo.score, THRESHOLDS.seo as number);
		logInfo(`Report saved: file://${reportFilePath}`);
	} catch (error) {
		logError(`Error analyzing ${pageUrl}:`, error);
	}
}

function gatherPagesToAudit(): string[] {
	if (specificPath) {
		logInfo(`Specific mode: testing only "${specificPath}"`);
		const relative = specificPath.replace(/^\/+/, "");
		return [`${BASE_URL}/${relative}`];
	}
	if (IS_ALL) {
		logInfo("All mode: testing all HTML files.");
		const files = getAllHtmlFiles(BUILD_DIR);
		return files.map(transformFileToUrl);
	}
	if (IS_MINIMAL) {
		logInfo("Minimal mode: only first HTML file in each directory.");
		const files = getAllHtmlFiles(BUILD_DIR, true);
		return files.map(transformFileToUrl);
	}
	logInfo("No flags: testing homepage only.");
	return [BASE_URL];
}

function transformFileToUrl(filePath: string): string {
	return (
		BASE_URL +
		filePath
			.replace(BUILD_DIR, "")
			.replace(/\\/g, "/")
			.replace(/index\.html$/, "")
	);
}

function createReportName(pageUrl: string): string {
	const pathName = new URL(pageUrl).pathname;
	let url = pathName.replace(/^\/|\/$/g, "").replace(/\//g, "-");
	if (!url.endsWith(".html")) url += ".html";
	return url;
}

function validateScore(
	category: string,
	score: number | null,
	threshold: number,
): void {
	if (score === null) {
		logWarn(`${category}: No score available`);
		return;
	}
	const percentScore = Math.round(score * 100);
	if (percentScore >= threshold)
		logSuccess(`${category}: ${percentScore} (>= ${threshold})`);
	else logError(`${category}: ${percentScore} (< ${threshold})`);
}
