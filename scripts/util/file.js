import fs from "node:fs";

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
