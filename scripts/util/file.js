import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

/**
 * Read JSON from a file.
 * @param {string} filePath - Path to the JSON file.
 * @returns {Object} - Parsed JSON data.
 */
export const readJSON = (filePath) =>
	fs.existsSync(filePath) ? JSON.parse(fs.readFileSync(filePath, "utf-8")) : {};

/**
 * Write JSON data to a file.
 * @param {string} filePath - Path to the JSON file.
 * @param {Object} data - Data to write.
 */
export const writeJSON = (filePath, data) =>
	fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

/**
 * Prepare a directory by ensuring it exists and clearing it.
 * @param {string} dirPath - Directory path.
 */
export const prepareDir = (dirPath) => {
	if (fs.existsSync(dirPath)) {
		fs.rmSync(dirPath, { recursive: true, force: true });
	}
	fs.mkdirSync(dirPath, { recursive: true });
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

	return [...htmlFiles, ...directories.flatMap((subDir) => getAllHtmlFiles(subDir, isMinimal))];
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
