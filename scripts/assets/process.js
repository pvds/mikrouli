import { IS_CMS, IS_LOCAL } from "../util/const.js";
import { logError } from "../util/log.js";
import { setupGracefulShutdown } from "../util/process.js";
import { processImages } from "./images.js";

setupGracefulShutdown();
await executeProcessing();

// Execute processing based on command-line args
async function executeProcessing() {
	try {
		if (IS_LOCAL) await processImages("local");
		if (IS_CMS) await processImages("cms");
	} catch (error) {
		logError("Error during image processing:", error);
	}
}
