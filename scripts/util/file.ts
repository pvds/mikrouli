import fs from "node:fs";
import path from "node:path";

export const readJSON = async (
	filePath: string,
): Promise<Record<string, unknown>> => {
	if (!(await Bun.file(filePath).exists())) return {};
	return Bun.file(filePath).json() as Promise<Record<string, unknown>>;
};

export const writeJSON = (filePath: string, data: unknown): Promise<number> =>
	Bun.write(filePath, JSON.stringify(data, null, 2));

export const prepareDir = (dirPath: string, remove: boolean = false): void => {
	if (fs.existsSync(dirPath) && remove) {
		fs.rmSync(dirPath, { recursive: true, force: true });
	}
	fs.mkdirSync(dirPath, { recursive: true });
};

export const fileExists = (filePath: string): Promise<boolean> =>
	Bun.file(filePath).exists();

export const directoryExists = async (dirPath: string): Promise<boolean> => {
	try {
		const stats = await fs.promises.stat(dirPath);
		return stats.isDirectory();
	} catch {
		return false;
	}
};

export const resolveIfExists = (dirPath: string): string | null => {
	const resolvedPath = path.resolve(dirPath);
	return fs.existsSync(resolvedPath) ? resolvedPath : null;
};

export const getAllHtmlFiles = (
	dir: string,
	isMinimal: boolean = false,
): string[] => {
	const entries = fs.readdirSync(dir, { withFileTypes: true });

	const htmlFiles: string[] = [];
	const directories: string[] = [];

	for (const entry of entries) {
		if (entry.isFile() && entry.name.endsWith(".html")) {
			htmlFiles.push(path.join(dir, entry.name));
		} else if (entry.isDirectory()) {
			directories.push(path.join(dir, entry.name));
		}
	}

	if (isMinimal) {
		const firstHtmlInDirs = directories.flatMap((subDir) => {
			const subEntries = fs.readdirSync(subDir, { withFileTypes: true });
			const firstHtml = subEntries.find(
				(entry) => entry.isFile() && entry.name.endsWith(".html"),
			);
			return firstHtml ? [path.join(subDir, firstHtml.name)] : [];
		});
		return [...htmlFiles, ...firstHtmlInDirs];
	}

	return [
		...htmlFiles,
		...directories.flatMap((subDir) => getAllHtmlFiles(subDir, isMinimal)),
	];
};
