import { existsSync } from "node:fs";
import { chromium } from "playwright";
import { logDebug, logError, logSuccess } from "$util/log";
import { runCommand } from "./process.js";

const chromeTestFlags = [
	"--password-store=basic", // Prevents Chromium from accessing OS keychain (avoids popups).
	"--use-mock-keychain", // Further prevents the browser from triggering keychain popups.
	"--deny-permission-prompts", // Denies all permission requests to avoid interruptions.
];

/**
 * Ensure Playwright's Chromium shell is installed.
 * Uses chromium.executablePath() and falls back to install if path is absent or lookup fails.
 */
export const ensureChromiumInstalled = async () => {
	const command = "bunx playwright install chromium --only-shell";
	try {
		// Works cross-platform and across Playwright versions that expose this API.
		// If the path resolves but the file isn't on disk, we install.
		const exePath = chromium.executablePath?.() ?? null;
		if (!exePath || !existsSync(exePath)) {
			logDebug("[playwright] Chromium shell not found. Installing…");
			await runCommand(command);
		}
	} catch {
		// If executablePath() isn't available or throws for any reason, just install.
		logDebug("[playwright] Could not resolve Chromium path. Installing…");
		await runCommand(command);
	}
};

/**
 * Launch a headless Chromium browser and attach global event listeners.
 * @param {number} [debugPort=9222]
 * @returns {Promise<{ browser: import('playwright').Browser, page: import('playwright').Page }>}
 */
export const launchBrowser = async (debugPort = 9222) => {
	await ensureChromiumInstalled();

	logDebug("Launching browser...");

	const browser = await chromium.launch({
		headless: true,
		args: [`--remote-debugging-port=${debugPort}`, ...chromeTestFlags],
	});

	const page = await browser.newPage();

	// Attach inline event listeners for page errors, network issues, console logs
	page.on("pageerror", (error) => {
		logError(`Page JS error: ${error.message}`);
	});
	page.on("requestfailed", (request) => {
		const failure = request.failure();
		const errorText = failure ? failure.errorText : "unknown error";
		logError(`Request failed: ${request.url()} - ${errorText}`);
	});
	page.on("console", (msg) => {
		if (msg.type() === "error") logError(`Console error: ${msg.text()}`);
		else logDebug(`Console ${msg.type()}: ${msg.text()}`);
	});

	return { browser, page };
};

/**
 * Close the given browser instance.
 * @param {import('playwright').Browser} browser - The browser instance to close.
 */
export const closeBrowser = async (browser) => {
	if (browser) {
		logDebug("Closing browser...");
		await browser.close();
		logSuccess("Browser closed.");
	}
};

/**
 * Navigate to a specified URL and return the page instance.
 * @param {import('playwright').Browser} browser - The browser instance.
 * @param {string} url - The URL to navigate to.
 * @returns {Promise<import('playwright').Page>} - The page instance.
 */
export const navigateToPage = async (browser, url) => {
	const context = await browser.newContext();
	const page = await context.newPage();
	logDebug(`Navigating to: ${url}`);

	try {
		await page.goto(url);
		return page;
	} catch (error) {
		logError(`Error navigating to ${url}:`, error);
		throw error;
	}
};
