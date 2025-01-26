import { execSync } from "node:child_process";
import { logInfo } from "./log.js";

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
 * Execute a shell command and log output.
 * @param {string} command - The shell command to execute.
 */
export const runCommand = (command) => {
	try {
		execSync(command, { stdio: "inherit", env: process.env });
	} catch (error) {
		throw new Error(error.message);
	}
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
