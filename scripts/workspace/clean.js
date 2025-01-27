import { exec } from "node:child_process";
import fs from "node:fs/promises";
import { promisify } from "node:util";
import { logDebug, logError, logInfo, logSuccess } from "../util/log.js";

const runCommand = promisify(exec);

await cleanDirectories().catch((error) => {
	logError("Clean script failed:", error.message);
	process.exit(1);
});

await installPackages().catch((error) => {
	logError("Package installation failed:", error.message);
	process.exit(1);
});

await syncSvelteKit().catch((error) => {
	logError("SvelteKit sync failed:", error.message);
	process.exit(1);
});

async function cleanDirectories() {
	const cleanupDirs = ["node_modules", "build", ".svelte-kit", ".tmp"];

	logInfo("Cleaning caches and output...");
	const deletePromises = cleanupDirs.map((dir) =>
		fs
			.rm(dir, { recursive: true, force: true })
			.then(() => logDebug(`Deleted ${dir}`))
			.catch((error) => logError(`Failed to delete ${dir}: ${error.message}`)),
	);

	await Promise.all(deletePromises);
	logSuccess("Caches and output cleaned.");
}

async function installPackages() {
	logInfo("Reinstalling packages...");
	await runCommand("bun install --save-text-lockfile");
	logSuccess("Packages reinstalled.");
}

async function syncSvelteKit() {
	logInfo("Syncing SvelteKit...");
	await runCommand("svelte-kit sync");
	logSuccess("SvelteKit synced.");
}
