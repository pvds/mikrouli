import { IS_CMS, IS_LOCAL } from "../util/const.js";
import { processImages } from "../util/images.js";
import { logError } from "../util/log.js";
import { setupGracefulShutdown } from "../util/process.js";

setupGracefulShutdown();
await executeProcessing();

// Execute processing based on command-line args
async function executeProcessing() {
	try {
		if (IS_LOCAL) await processImages("local");
		if (IS_CMS) await processImages("cms");
	} catch (err) {
		logError("Error during image processing:", err);
	}
}
