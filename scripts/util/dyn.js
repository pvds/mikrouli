// ##################################################
// Derived constants
// - only add dynamic values
// - only imports from `const.js` and node
// - for static values use `const.js`
// - for functions add a new utility file
// ##################################################

import { cpus } from "node:os";
import { resolve } from "node:path";
import {
	BUILD_DIR_PRODUCTION,
	BUILD_DIR_STAGING,
	IMAGES_FILE,
	IMAGE_INPUT_DIR,
	IMAGE_OUTPUT_DIR,
	JSON_OUTPUT_DIR,
	REPORTS_DIR,
} from "$config";

// Paths
const BASE_DIR = process.env.BASE_DIR || process.cwd();
export const IMAGES_METADATA_OUTPUT_PATH_RESOLVED = resolve(BASE_DIR, JSON_OUTPUT_DIR, "meta");
export const IMAGES_JSON_OUTPUT_PATH_RESOLVED = resolve(BASE_DIR, JSON_OUTPUT_DIR, IMAGES_FILE);
export const IMAGE_INPUT_PATH_RESOLVED = resolve(BASE_DIR, IMAGE_INPUT_DIR);
export const IMAGE_OUTPUT_PATH_RESOLVED = resolve(BASE_DIR, IMAGE_OUTPUT_DIR);
export const REPORTS_PATH_RESOLVED = resolve(BASE_DIR, REPORTS_DIR);
export const BUILD_PATH_STAGING_RESOLVED = resolve(BASE_DIR, BUILD_DIR_PRODUCTION);
export const BUILD_PATH_PRODUCTION_RESOLVED = resolve(BASE_DIR, BUILD_DIR_STAGING);

// System
export const CPU_COUNT = Math.max(2, Math.floor(cpus().length / 2));

// Environment
export const CONTENTFUL_SPACE_ID = process.env.CONTENTFUL_SPACE_ID;
export const CONTENTFUL_ACCESS_TOKEN = process.env.CONTENTFUL_ACCESS_TOKEN;

// CLI args
const CLI_ARGS = process.argv.slice(2);
export const IS_CMS = CLI_ARGS.includes("--cms");
export const IS_LOCAL = CLI_ARGS.includes("--local");
export const IS_PROD = CLI_ARGS.includes("--prod");
export const IS_FORCE = CLI_ARGS.includes("--force");
export const IS_MINIMAL = CLI_ARGS.includes("--minimal");
export const IS_ALL = CLI_ARGS.includes("--all");
