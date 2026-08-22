import fs from "node:fs";
import path from "node:path";

/**
 * Read JSON from a file.
 * @param {string} filePath - Path to the JSON file.
 * @returns {Object} - Parsed JSON data.
 */
export const readJSON = (filePath) =>
	fs.existsSync(filePath)
		? JSON.parse(fs.readFileSync(filePath, "utf-8"))
		: {};

/**
 * Write JSON data to a file.
 * @param {string} filePath - Path to the JSON file.
 * @param {Object} data - Data to write.
 */
export const writeJSON = (filePath, data) =>
	fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

/**
 * Prepare a directory by ensuring it exists and optionally clearing it.
 * @param {string} dirPath - Directory path.
 * @param {boolean} remove - Whether to remove the directory.
 */
export const prepareDir = (dirPath, remove = false) => {
	if (fs.existsSync(dirPath) && remove) {
		fs.rmSync(dirPath, { recursive: true, force: true });
	}
	fs.mkdirSync(dirPath, { recursive: true });
};

/**
 * Checks if a file exists.
 * @param {string} filePath - Path to the file.
 * @returns {Promise<boolean>} - True if exists, else false.
 */
export const fileExists = async (filePath) => {
	try {
		await fs.promises.access(filePath);
		return true;
	} catch {
		return false;
	}
};

/**
 * Checks if a directory exists.
 * @param {string} dirPath - Path to the directory.
 * @returns {Promise<boolean>} - True if exists, else false.
 */
export const directoryExists = async (dirPath) => {
	try {
		const stats = await fs.promises.stat(dirPath);
		return stats.isDirectory();
	} catch {
		return false;
	}
};

/**
 * Check if a directory exists and return its resolved path.
 * @param {string} dirPath - Path to the directory.
 * @returns {string|null} - Resolved path if it exists, otherwise null.
 */
export const resolveIfExists = (dirPath) => {
	const resolvedPath = path.resolve(dirPath);
	return fs.existsSync(resolvedPath) ? resolvedPath : null;
};

/**
 * Recursively find all HTML files in a directory.
 * Supports an optional minimal mode to get the first file from subdirectories.
 *
 * @param {string} dir - The directory path to search.
 * @param {boolean} isMinimal - Whether to get only the first HTML file per subdirectory.
 * @returns {string[]} - Array of found HTML file paths.
 */
export const getAllHtmlFiles = (dir, isMinimal = false) => {
	const entries = fs.readdirSync(dir, { withFileTypes: true });

	const htmlFiles = [];
	const directories = [];

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
