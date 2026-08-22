import type { Subprocess } from "bun";
import { resolveIfExists } from "$util/file";
import { logDebug, logInfo, logSuccess } from "$util/log";
import { runCommand } from "$util/process";

export const startServer = async (
	buildDir: string,
	buildCommand: string,
	previewCommand: string,
	port: number,
): Promise<Subprocess> => {
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

export const stopServer = (server: Subprocess): void => {
	logDebug("Stopping server...");
	server.kill();
	server.exited.then(() => {
		logSuccess("Server stopped");
		process.exit(0);
	});
};

export const waitForServer = async (
	url: string,
	timeout: number = 10000,
	initialDelay: number = 100,
): Promise<void> => {
	const baseUrl = new URL(url).origin;
	await Bun.sleep(initialDelay);
	const deadline = Date.now() + timeout;

	while (Date.now() < deadline) {
		try {
			const { status } = await fetch(baseUrl);
			if ([200, 404].includes(status))
				return logSuccess(`Server is ready at ${url}`);
			logDebug(`Server not ready yet (status: ${status})`);
			await Bun.sleep(200);
		} catch {
			logDebug("Checking server status...");
			await Bun.sleep(200);
		}
	}

	throw new Error(`Server at ${url} did not start within ${timeout}ms`);
};
