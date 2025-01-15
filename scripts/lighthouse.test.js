import { execSync, spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { get } from "node:http";
import path from "node:path";
import { setTimeout } from "node:timers/promises";
import { chromium } from "playwright";
import { playAudit } from "playwright-lighthouse";
import { logDebug, logError, logInfo, logSuccess } from "./log.js";

const PORT = 4173;
const SUBFOLDER = "/mikrouli";
const BASE_URL = `http://localhost:${PORT}${SUBFOLDER}`;
const THRESHOLDS = {
	performance: 99,
	accessibility: 100,
	"best-practices": 100,
	seo: 100,
};
const REPORT_DIR = "./.tmp/performance-reports";

const startServer = () => {
	const buildDir = path.resolve("./build");
	if (!existsSync(buildDir)) {
		logInfo("Building project...");
		execSync("vite build --logLevel error", { stdio: "inherit" });
	}
	logDebug("Starting server...");
	return spawn("bun", ["vite", "preview", "--port", PORT]);
};

const stopServer = (server) => {
	logDebug("Stopping server...");
	server.kill("SIGTERM");
	server.on("close", () => {
		logSuccess("Server stopped");
		process.exit(0);
	});
};

const waitForServer = async (url, timeout = 10000, initialDelay = 100) => {
	const baseUrl = new URL(url).origin;
	await setTimeout(initialDelay);
	const deadline = Date.now() + timeout;

	while (Date.now() < deadline) {
		try {
			await new Promise((resolve, reject) =>
				get(baseUrl, ({ statusCode }) =>
					[200, 404].includes(statusCode) ? resolve() : reject(),
				).on("error", reject),
			);
			return logSuccess(`Server is ready at ${url}`);
		} catch {
			logDebug("Checking server status...");
			await setTimeout(200); // Retry after 200ms
		}
	}

	throw new Error(`Server at ${url} did not start within ${timeout}ms`);
};

const validateScore = (category, score, threshold) => {
	const percentageScore = score * 100;
	if (percentageScore >= threshold) {
		logSuccess(`${category}: ${percentageScore} (meets threshold of ${threshold})`);
	} else {
		logError(`${category}: ${percentageScore} (below threshold of ${threshold})`);
	}
};

const runPerformanceTest = async (url, port) => {
	const browser = await chromium.launch({
		headless: true,
		args: [`--remote-debugging-port=${port}`],
	});

	try {
		logInfo(`Launching Lighthouse audit for ${url}`);
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
				name: `lighthouse-report-${new Date().toISOString()}`,
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
	} catch (error) {
		logError("Error running Lighthouse audit:", error);
	} finally {
		await browser.close();
	}
};

(async () => {
	const viteServer = startServer();

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
