import { exec } from "node:child_process";
import fs from "node:fs/promises";
import { promisify } from "node:util";
import { logDebug, logError, logInfo, logSuccess } from "../util/log.js";

const runCommand = promisify(exec);

const GENERATED_DIRS = ["node_modules", "build", ".svelte-kit", ".tmp"];
const GENERATED_FILES = ["bun.lock"];

await cleanDirectories().catch((error) => {
	logError("Clean directories script failed:", error.message);
	process.exit(1);
});

await cleanFiles().catch((error) => {
	logError("Clean files script failed:", error.message);
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
	logInfo("Cleaning generated folders...");
	const deletePromises = GENERATED_DIRS.map((dir) =>
		fs
			.rm(dir, { recursive: true, force: true })
			.then(() => logDebug(`Deleted ${dir}`))
			.catch((error) =>
				logError(`Failed to delete ${dir}: ${error.message}`),
			),
	);

	await Promise.all(deletePromises);
	logSuccess("Generated folders cleaned.");
}

async function cleanFiles() {
	logInfo("Cleaning generated files...");
	const deletePromises = GENERATED_FILES.map((file) =>
		fs
			.rm(file, { force: true })
			.then(() => logDebug(`Deleted ${file}`))
			.catch((error) =>
				logError(`Failed to delete ${file}: ${error.message}`),
			),
	);

	await Promise.all(deletePromises);
	logSuccess("Generated files cleaned.");
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
