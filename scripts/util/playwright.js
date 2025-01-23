import { chromium } from "playwright";
import { logDebug, logError, logSuccess } from "./log.js";

const chromeTestFlags = [
	// "--disable-gpu", // Disable GPU hardware acceleration to avoid rendering issues.
	// "--disable-features=IsolateOrigins,site-per-process", // Disables site isolation, reducing resource usage.
	// "--disable-site-isolation-trials", // Similar to the above, helps avoid cross-origin restrictions in testing.
	// "--disable-component-update", // Disables automatic updates of Chromium components.
	// "--disable-extensions", // Prevents unnecessary browser extensions from interfering.
	// "--disable-background-timer-throttling", // Prevents automatic throttling of background tasks.
	// "--disable-backgrounding-occluded-windows", // Ensures all browser operations run without hidden optimizations.
	// "--disable-renderer-backgrounding", // Keeps all renderer processes running at full performance.
	// "--password-store=basic", // Prevents Chromium from accessing OS keychain (avoids popups).
	// "--use-mock-keychain", // Further prevents the browser from triggering keychain popups.
	// "--deny-permission-prompts", // Denies all permission requests to avoid interruptions.
];

/**
 * Launch a headless Chromium browser.
 * @returns {Promise<import('playwright').Browser>} - The browser instance.
 */
export const launchBrowser = async (debugPort = 9222) => {
	logDebug("Launching browser...");

	return await chromium.launch({
		headless: true,
		// launchOptions: { args: ['--deny-permission-prompts'] }, //use this option to disable the prompt
		args: [`--remote-debugging-port=${debugPort}`, ...chromeTestFlags],
	});
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
