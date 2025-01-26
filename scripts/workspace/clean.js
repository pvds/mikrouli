// @ts-nocheck

import { exec } from "node:child_process";
import fs from "node:fs/promises";
import { promisify } from "node:util";
import { logError, logInfo, logSuccess } from "$util/log";

const runCommand = promisify(exec);

async function cleanDirectories() {
	const paths = ["node_modules", "build", ".svelte-kit"];

	logInfo("Cleaning caches and output...");
	for (const path of paths) {
		try {
			await fs.rm(path, { recursive: true, force: true });
		} catch (error) {
			logError(`Failed to delete ${path}:`, error.message);
		}
	}
	logSuccess("Caches and output cleaned.");

	logInfo("Reinstalling packages...");
	await runCommand("bun install --save-text-lockfile");
	logSuccess("Packages reinstalled.");
}

cleanDirectories().catch((error) => {
	logError("Clean script failed:", error.message);
	process.exit(1);
});
