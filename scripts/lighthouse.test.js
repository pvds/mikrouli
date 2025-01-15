import { spawn } from "node:child_process";
import http from "node:http";
import { chromium } from "playwright";
import { playAudit } from "playwright-lighthouse";
import { logDebug, logError, logInfo, logSuccess } from "./log.js";

const PORT = 4173;
const SUBFOLDER = "/mikrouli";
const BASE_URL = `http://localhost:${PORT}${SUBFOLDER}`;
const thresholds = {
	performance: 100,
	accessibility: 80,
	bestPractices: 80,
	seo: 80,
};

const startVitePreview = () => {
	logInfo("Starting Vite preview server...");
	const server = spawn("bun", ["vite", "preview", "--port", PORT], {
		stdio: ["pipe", "pipe", "pipe"],
		shell: true,
	});

	server.on("close", (code) => logSuccess("Vite server closed"));

	return server;
};

const waitForServer = async (url, timeout = 10000) => {
	const baseUrl = new URL(url).origin; // Extract the base URL (e.g., http://localhost:4173)
	const start = Date.now();
	while (Date.now() - start < timeout) {
		try {
			await new Promise((resolve, reject) => {
				const req = http.get(baseUrl, (res) => {
					if (res.statusCode === 200 || res.statusCode === 404)
						resolve(); // Ready if 200 or 404
					else reject(new Error(`Status Code: ${res.statusCode}`));
				});
				req.on("error", reject);
			});
			logSuccess(`Server is available at ${url}`);
			return true; // Server is ready
		} catch (err) {
			logDebug(`Retrying server readiness check: ${err.message}`);
			await new Promise((resolve) => setTimeout(resolve, 1000)); // Retry after 500ms
		}
	}
	throw new Error(`Server at ${url} did not start within ${timeout}ms`);
};

const runPerformanceTest = async (url, port) => {
	const browser = await chromium.launch({
		headless: true,
		args: [`--remote-debugging-port=${port}`],
	});

	try {
		logInfo(`Launching Lighthouse audit for ${url}...`);
		const page = await browser.newPage();
		await page.goto(url);

		const lighthouseResults = await playAudit({
			page,
			port,
			thresholds: {
				performance: thresholds.performance,
				accessibility: thresholds.accessibility,
				"best-practices": thresholds.bestPractices,
				seo: thresholds.seo,
			},
			disableLogs: true,
			ignoreError: true,
			reports: {
				formats: { html: true, json: true },
				directory: "./.tmp/performance-reports",
				name: `lighthouse-report-${new Date().toISOString()}`,
			},
		});

		if (!lighthouseResults?.lhr) {
			logError("Lighthouse audit did not return valid results.");
		} else {
			const {
				performance,
				accessibility,
				"best-practices": bestPractices,
				seo,
			} = lighthouseResults.lhr.categories;
			logSuccess("Lighthouse audit completed:");
			logInfo(
				`  - Performance: ${performance.score * 100} (minimum: ${thresholds.performance})`,
			);
			logInfo(
				`  - Accessibility: ${accessibility.score * 100} (minimum: ${thresholds.accessibility})`,
			);
			logInfo(
				`  - Best Practices: ${bestPractices.score * 100} (minimum: ${thresholds.bestPractices})`,
			);
			logInfo(`  - SEO: ${seo.score * 100} (minimum: ${thresholds.seo})`);
		}
	} catch (error) {
		logError("Error running Lighthouse audit:", error);
	} finally {
		await browser.close();
		logSuccess("Browser closed.");
	}
};

(async () => {
	const viteServer = startVitePreview();

	try {
		logInfo(`Waiting for Vite server to be ready at ${BASE_URL}...`);
		await waitForServer(BASE_URL);
		logSuccess("Vite server is ready.");

		await runPerformanceTest(BASE_URL, 9222);
	} catch (error) {
		logError("Error during setup:", error);
		process.exit(1);
	} finally {
		logInfo("Stopping Vite preview server...");
		viteServer.kill();
	}
})();
