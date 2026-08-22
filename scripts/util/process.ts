import { logInfo } from "$util/log";

export const setupGracefulShutdown = (): void => {
	const shutdown = (): void => {
		logInfo("Received termination signal. Shutting down gracefully...");
		process.exit(0);
	};

	process.on("SIGINT", shutdown);
	process.on("SIGTERM", shutdown);
};

export const runCommand = async (command: string): Promise<void> => {
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

export function safeIncrement(
	counts: Record<string, number>,
	key: string,
): void {
	if (typeof counts[key] !== "number") {
		console.warn(`Key "${key}" is not a number`);
	}

	counts[key]++;
}
