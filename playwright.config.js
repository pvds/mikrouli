import os from "node:os";
import { defineConfig } from "@playwright/test";

/**
 * Returns half the CPU cores (rounded down), with a minimum of 2.
 */
function halfCoresAtLeastTwo() {
	const cores = os.cpus().length;
	return Math.max(2, Math.floor(cores / 2));
}

export default defineConfig({
	testDir: "e2e",
	webServer: {
		command: "bun run build && bun run preview",
		port: 4173,
		reuseExistingServer: true,
	},
	workers: halfCoresAtLeastTwo(),
	reporter: "list",
	use: {
		headless: true,
		// baseURL: 'http://localhost:4173', // optional if you want page.goto('/something')
	},
});
