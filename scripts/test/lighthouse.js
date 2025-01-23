import path from "node:path";
import { chromium } from "playwright";
import { playAudit } from "playwright-lighthouse";
import { logError, logInfo, logSuccess } from "../util/log.js";
import { closeBrowser } from "../util/playwright.js";
import { startServer, stopServer, waitForServer } from "../util/server.js";

// TODO: run on multiple pages concurrently with a limit (see axe.test.js logic)

// Parse command-line arguments
const args = process.argv.slice(2);
const isProduction = args.includes("--prod");
const BUILD_DIR = isProduction ? "./build/production" : "./build/staging";
const SUBFOLDER = isProduction ? "" : "/mikrouli";
const BUILD_COMMAND = isProduction ? "build:production" : "build";
const PREVIEW_COMMAND = isProduction ? "preview:production" : "preview";
const PORT = 4173;
const BASE_URL = `http://localhost:${PORT}${SUBFOLDER}`;
const THRESHOLDS = {
	performance: 99,
	accessibility: 100,
	"best-practices": 100,
	seo: 100,
};
const REPORT_DIR = "./.tmp/performance-reports";

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
 * Run Lighthouse performance audits.
 * @param {string} url - The URL to audit.
 * @param {number} port - Remote debugging port.
 */
const runPerformanceTest = async (url, port) => {
	const browser = await chromium.launch({
		headless: true,
		args: [`--remote-debugging-port=${port}`],
	});

	try {
		logInfo(`Launching Lighthouse audit for ${url}`);
		const timestamp = new Date().toISOString().split(".")[0]; // Removes milliseconds and 'Z'
		const reportName = `lighthouse-report-${timestamp}`;
		const reportPath = path.resolve(REPORT_DIR, `${reportName}.html`);
		const page = await browser.newPage();
		await page.goto(url);

		const lighthouseResults = await playAudit({
			page,
			port,
			thresholds: THRESHOLDS,
			disableLogs: true,
			ignoreError: true,
			reports: {
				formats: { html: true, json: true },
				directory: REPORT_DIR,
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
		logError("Error running Lighthouse audit:", error);
	} finally {
		await closeBrowser(browser);
	}
};

(async () => {
	const viteServer = startServer(BUILD_DIR, BUILD_COMMAND, PREVIEW_COMMAND, PORT);

	try {
		await waitForServer(BASE_URL);
		await runPerformanceTest(BASE_URL, 9222);
	} catch (error) {
		logError("Error during setup:", error);
		process.exit(1);
	} finally {
		stopServer(viteServer);
	}
})();
