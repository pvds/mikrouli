import { spawn } from "node:child_process";
import { get } from "node:http";
import { setTimeout } from "node:timers/promises";
import { resolveIfExists, runCommand } from "./file.js";
import { logDebug, logInfo, logSuccess } from "./log.js";

/**
 * Start the server, build if necessary.
 * @param {string} buildDir - Path to the build directory.
 * @param {string} buildCommand - Command to build the project.
 * @param {string} previewCommand - Command to start the preview server.
 * @param {number} port - Server port number.
 * @returns {ChildProcessWithoutNullStreams} - The server process.
 */
export const startServer = (buildDir, buildCommand, previewCommand, port) => {
	const resolvedBuildDir = resolveIfExists(buildDir);
	if (!resolvedBuildDir) {
		logInfo("Building project...");
		runCommand(`bun run ${buildCommand} --logLevel error`);
	}
	logDebug("Starting server...");
	return spawn("bun", ["run", previewCommand, "--port", port]);
};

/**
 * Stop the running server process gracefully.
 * @param {ChildProcessWithoutNullStreams} server - The server process.
 */
export const stopServer = (server) => {
	logDebug("Stopping server...");
	server.kill("SIGTERM");
	server.on("close", () => {
		logSuccess("Server stopped");
		process.exit(0);
	});
};

/**
 * Wait until the server is ready.
 * @param {string} url - The server URL.
 * @param {number} timeout - Max wait time in milliseconds.
 * @param {number} initialDelay - Initial delay before first check.
 */
export const waitForServer = async (url, timeout = 10000, initialDelay = 100) => {
	const baseUrl = new URL(url).origin;
	await setTimeout(initialDelay);
	const deadline = Date.now() + timeout;

	while (Date.now() < deadline) {
		try {
			await new Promise((resolve, reject) =>
				get(baseUrl, ({ statusCode }) =>
					[200, 404].includes(statusCode) ? resolve() : reject(),
				).on("error", reject),
			);
			return logSuccess(`Server is ready at ${url}`);
		} catch {
			logDebug("Checking server status...");
			await setTimeout(200); // Retry after 200ms
		}
	}

	throw new Error(`Server at ${url} did not start within ${timeout}ms`);
};
