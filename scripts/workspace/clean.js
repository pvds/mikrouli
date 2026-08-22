import { exec } from "node:child_process";
import fs from "node:fs/promises";
import { promisify } from "node:util";
import { errMsg } from "$util/error.js";
import { logDebug, logError, logInfo, logSuccess } from "$util/log.js";

const runCommand = promisify(exec);

const GENERATED_DIRS = ["node_modules", "build", ".svelte-kit", ".tmp"];
const GENERATED_FILES = ["bun.lock"];

await main();

async function main() {
	try {
		await cleanGenerated(GENERATED_DIRS, GENERATED_FILES);
		await installPackages();
		await syncSvelteKit();
	} catch (error) {
		logError("Clean install failed:", errMsg(error));
		process.exit(1);
	}
}

/**
 * Clean generated artifacts
 * @param {string[]} dirs
 * @param {string[]} files
 */
export async function cleanGenerated(dirs = [], files = []) {
	const DIR_OPTS = { recursive: true, force: true };
	const FILE_OPTS = { force: true };
	const targets = [
		...dirs.map((path) => ({ path, kind: "folder", opts: DIR_OPTS })),
		...files.map((path) => ({ path, kind: "file", opts: FILE_OPTS })),
	];

	logInfo("Cleaning generated artifacts...");
	for (const t of targets) {
		try {
			await fs.rm(t.path, t.opts);
			logDebug(`Deleted ${t.kind} ${t.path}`);
		} catch (error) {
			logError(`Failed to delete ${t.kind} ${t.path}: ${errMsg(error)}`);
		}
	}
	logSuccess("Generated artifacts cleaned.");
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
