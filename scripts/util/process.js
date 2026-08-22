import { logInfo } from "$util/log";

/**
 * Handles graceful shutdown on process termination signals.
 */
export const setupGracefulShutdown = () => {
	const shutdown = () => {
		logInfo("Received termination signal. Shutting down gracefully...");
		process.exit(0);
	};

	process.on("SIGINT", shutdown);
	process.on("SIGTERM", shutdown);
};

/**
 * Execute a shell command with inherited stdio.
 * @param {string} command - The shell command to execute.
 */
export const runCommand = async (command) => {
	const proc = Bun.spawn(command.split(/\s+/).filter(Boolean), {
		stdout: "inherit",
		stderr: "inherit",
		stdin: "inherit",
	});
	const exitCode = await proc.exited;
	if (exitCode !== 0)
		throw new Error(
			`Command failed with exit code ${exitCode}: ${command}`,
		);
};

/**
 * Safely increments a numeric property within an object.
 * Ensures thread-safe behavior within the event loop async code.
 * @param {Record<string, number>} counts - The counts object to update.
 * @param {string} key - The key to increment.
 */
export function safeIncrement(counts, key) {
	if (typeof counts[key] !== "number") {
		console.warn(`Key "${key}" is not a number`);
	}

	counts[key]++; // Atomic-like synchronous increment
}
