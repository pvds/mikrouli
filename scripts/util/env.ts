import { askQuestion } from "$util/cli-question";
import { logInfo, logMessage } from "$util/log";
import { escapeRegex } from "$util/regex";

async function getEmptyEnvVariables(
	envFilePath: string,
	requiredVars: string[] = [],
): Promise<string[]> {
	if (!(await Bun.file(envFilePath).exists())) return [];

	const emptyVariables = (await Bun.file(envFilePath).text())
		.split("\n")
		.map((lineRaw) => {
			const line = lineRaw.trim();
			if (!line || line.startsWith("#")) return null;

			const [rawKey, ...valueParts] = line.split("=");
			const key = rawKey.trim();
			const value = valueParts
				.join("=")
				.trim()
				.replace(/^["']|["']$/g, "");

			return !value ? key : null;
		})
		.filter((key): key is string => key !== null);

	if (requiredVars.length > 0) {
		return emptyVariables.filter((key) => requiredVars.includes(key));
	}

	return emptyVariables;
}

const updateEnvFile = async (
	envUpdates: Record<string, string>,
	envFilePath: string,
): Promise<void> => {
	let envContent = (await Bun.file(envFilePath).exists())
		? await Bun.file(envFilePath).text()
		: "";

	for (const [key, value] of Object.entries(envUpdates)) {
		const escapedKey = escapeRegex(key);
		const regex = new RegExp(`^${escapedKey}(?:=["']?.*["']?)?$`, "m");
		const newLine = `${key}=${value}`;

		if (regex.test(envContent)) {
			envContent = envContent.replace(regex, newLine);
		} else {
			envContent += `\n${newLine}`;
		}
		process.env[key] = value.toString();
	}

	await Bun.write(envFilePath, envContent);
};

const promptForMissingVariables = async (
	envFilePath: string,
	requiredVars: string[] = [],
): Promise<void> => {
	const emptyVars = await getEmptyEnvVariables(envFilePath);

	const allVarsToPrompt = new Set([
		...requiredVars.filter((k) => !process.env[k]),
		...emptyVars,
	]);

	if (allVarsToPrompt.size === 0) {
		logInfo("No missing environment variables found.");
		return;
	}

	logInfo("The following environment variables need values:");
	for (const key of allVarsToPrompt) {
		logInfo(`- ${key}`);
	}
	logMessage(
		"You can skip the prompts by pressing Enter without providing a value",
	);

	const envUpdates: Record<string, string> = {};
	for (const key of allVarsToPrompt) {
		envUpdates[key] = await askQuestion(
			`Please enter a value for ${key}: `,
			{
				required: false,
				mask: !key?.toLowerCase()?.startsWith("public") || true,
			},
		);
	}

	await updateEnvFile(envUpdates, envFilePath);
	logInfo(`Updated ${envFilePath} with missing environment variables.`);
};

export { getEmptyEnvVariables, promptForMissingVariables, updateEnvFile };
