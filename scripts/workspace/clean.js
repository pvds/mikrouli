import { exec } from "node:child_process";
import fs from "node:fs/promises";
import { promisify } from "node:util";
import { logError, logInfo, logSuccess } from "../util/log.js";

const runCommand = promisify(exec);

async function cleanDirectories() {
	const cleanupDirs = ["node_modules", "build", ".svelte-kit", ".tmp"];

	logInfo("Cleaning caches and output...");
	for (const dir of cleanupDirs) {
		try {
			await fs.rm(dir, { recursive: true, force: true });
		} catch (error) {
			logError(`Failed to delete ${dir}:`, error);
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
