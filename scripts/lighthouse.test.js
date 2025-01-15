import { spawn } from "node:child_process";
import http from "node:http";
import { chromium } from "playwright";
import { playAudit } from "playwright-lighthouse";
import { logDebug, logError, logInfo, logSuccess } from "./log.js";

const PORT = 4173;
const SUBFOLDER = "/mikrouli";
const BASE_URL = `http://localhost:${PORT}${SUBFOLDER}`;
const THRESHOLDS = {
	performance: 100,
	accessibility: 80,
	"best-practices": 80,
	seo: 80,
};
const REPORT_DIR = "./.tmp/performance-reports";

const startVitePreview = () => {
	logInfo("Starting Vite preview server...");
	return spawn("bun", ["vite", "preview", "--port", PORT], {
		stdio: ["pipe", "pipe", "pipe"],
		shell: true,
	});
};

const waitForServer = async (url, timeout = 10000, initialDelay = 500) => {
	await new Promise((resolve) => setTimeout(resolve, initialDelay)); // Initial delay
	const baseUrl = new URL(url).origin;
	const start = Date.now();
	while (Date.now() - start < timeout) {
		try {
			await new Promise((resolve, reject) => {
				const req = http.get(baseUrl, (res) => {
					if ([200, 404].includes(res.statusCode)) resolve();
					else reject(new Error(`Status Code: ${res.statusCode}`));
				});
				req.on("error", reject);
			});
			logDebug(`Vite server is available at ${url}`);
			return;
		} catch (err) {
			logDebug("Checking server status...");
			await new Promise((resolve) => setTimeout(resolve, 200));
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
		// logDebug("Browser closed.");
	}
};

(async () => {
	const viteServer = startVitePreview();

	try {
		// logDebug(`Waiting for Vite server to be ready at ${BASE_URL}...`);
		await waitForServer(BASE_URL);
		await runPerformanceTest(BASE_URL, 9222);
	} catch (error) {
		logError("Error during setup:", error);
		process.exit(1);
	} finally {
		logInfo("Stopping Vite preview server...");
		viteServer.kill();
	}
})();
