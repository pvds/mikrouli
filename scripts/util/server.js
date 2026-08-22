import { resolveIfExists } from "$util/file";
import { logDebug, logInfo, logSuccess } from "$util/log";
import { runCommand } from "$util/process";

/**
 * Start the server, build if necessary.
 * @param {string} buildDir - Path to the build directory.
 * @param {string} buildCommand - Command to build the project.
 * @param {string} previewCommand - Command to start the preview server.
 * @param {number} port - Server port number.
 * @returns {Promise<import('bun').Subprocess>} - The server process.
 */
export const startServer = async (
	buildDir,
	buildCommand,
	previewCommand,
	port,
) => {
	const resolvedBuildDir = resolveIfExists(buildDir);
	if (!resolvedBuildDir) {
		logInfo("Building project...");
		await runCommand(`bun run ${buildCommand} --logLevel error`);
	}
	logDebug("Starting server...");
	return Bun.spawn(
		["bun", "run", previewCommand, "--port", port.toString()],
		{
			stdout: "inherit",
			stderr: "inherit",
		},
	);
};

/**
 * Stop the running server process gracefully.
 * @param {import('bun').Subprocess} server - The server process.
 */
export const stopServer = (server) => {
	logDebug("Stopping server...");
	server.kill();
	server.exited.then(() => {
		logSuccess("Server stopped");
		process.exit(0);
	});
};

/**
 * Wait until the server is ready.
 * @param {string} url - The server URL.
 * @param {number} timeout - Max wait time in milliseconds.
 * @param {number} initialDelay - Initial delay before first check.
 * @return {Promise<void>} - Resolves when server is ready.
 */
export const waitForServer = async (
	url,
	timeout = 10000,
	initialDelay = 100,
) => {
	const baseUrl = new URL(url).origin;
	await Bun.sleep(initialDelay);
	const deadline = Date.now() + timeout;

	while (Date.now() < deadline) {
		try {
			const { status } = await fetch(baseUrl);
			if ([200, 404].includes(status))
				return logSuccess(`Server is ready at ${url}`);
		} catch {
			logDebug("Checking server status...");
			await Bun.sleep(200);
		}
	}

	throw new Error(`Server at ${url} did not start within ${timeout}ms`);
};
