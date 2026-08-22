import { existsSync } from "node:fs";
import type { Browser, Page } from "playwright";
import { chromium } from "playwright";
import { logDebug, logError, logSuccess } from "$util/log";
import { runCommand } from "./process";

const chromeTestFlags = [
	"--password-store=basic",
	"--use-mock-keychain",
	"--deny-permission-prompts",
];

export const ensureChromiumInstalled = async (): Promise<void> => {
	const command = "bunx playwright install chromium --only-shell";
	try {
		const exePath = chromium.executablePath?.() ?? null;
		if (!exePath || !existsSync(exePath)) {
			logDebug("[playwright] Chromium shell not found. Installing…");
			await runCommand(command);
		}
	} catch {
		logDebug("[playwright] Could not resolve Chromium path. Installing…");
		await runCommand(command);
	}
};

export const launchBrowser = async (
	debugPort: number = 9222,
): Promise<{ browser: Browser; page: Page }> => {
	await ensureChromiumInstalled();

	logDebug("Launching browser...");

	const browser = await chromium.launch({
		headless: true,
		args: [`--remote-debugging-port=${debugPort}`, ...chromeTestFlags],
	});

	const page = await browser.newPage();

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

export const closeBrowser = async (browser: Browser): Promise<void> => {
	if (browser) {
		logDebug("Closing browser...");
		await browser.close();
		logSuccess("Browser closed.");
	}
};

export const navigateToPage = async (
	browser: Browser,
	url: string,
): Promise<Page> => {
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
