import fs from "node:fs/promises";
import { errMsg } from "$util/error.js";
import { logDebug, logError, logInfo, logSuccess } from "$util/log.js";

const GENERATED_DIRS = ["node_modules", "build", ".svelte-kit", ".tmp"];
const GENERATED_FILES = ["bun.lock"];

await main();

async function main(): Promise<void> {
	try {
		await cleanGenerated(GENERATED_DIRS, GENERATED_FILES);
		await installPackages();
		await syncSvelteKit();
	} catch (error) {
		logError("Clean install failed:", errMsg(error));
		process.exit(1);
	}
}

interface Target {
	path: string;
	kind: "folder" | "file";
	opts: { recursive: boolean; force: boolean } | { force: boolean };
}

export async function cleanGenerated(
	dirs: string[] = [],
	files: string[] = [],
): Promise<void> {
	const DIR_OPTS = { recursive: true, force: true };
	const FILE_OPTS = { force: true };
	const targets: Target[] = [
		...dirs.map((path) => ({
			path,
			kind: "folder" as const,
			opts: DIR_OPTS,
		})),
		...files.map((path) => ({
			path,
			kind: "file" as const,
			opts: FILE_OPTS,
		})),
	];

	logInfo("Cleaning generated artifacts...");
	for (const t of targets) {
		try {
			await fs.rm(t.path, t.opts as Parameters<typeof fs.rm>[1]);
			logDebug(`Deleted ${t.kind} ${t.path}`);
		} catch (error) {
			logError(`Failed to delete ${t.kind} ${t.path}: ${errMsg(error)}`);
		}
	}
	logSuccess("Generated artifacts cleaned.");
}

async function installPackages(): Promise<void> {
	logInfo("Reinstalling packages...");
	await Bun.$`bun install`;
	logSuccess("Packages reinstalled.");
}

async function syncSvelteKit(): Promise<void> {
	logInfo("Syncing SvelteKit...");
	await Bun.$`svelte-kit sync`;
	logSuccess("SvelteKit synced.");
}
