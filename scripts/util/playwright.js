import { chromium } from "playwright";
import { logDebug, logError, logSuccess } from "./log.js";

/**
 * Launch a headless Chromium browser.
 * @returns {Promise<import('playwright').Browser>} - The browser instance.
 */
export const launchBrowser = async () => {
	logDebug("Launching browser...");
	return await chromium.launch({ headless: true });
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
