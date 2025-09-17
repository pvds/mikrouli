import { IS_CMS, IS_FORCE, IS_LOCAL } from "$util/dyn";
import { logError, logWarn } from "$util/log";
import { setupGracefulShutdown } from "$util/process";
import { processImages } from "./helpers/images";

setupGracefulShutdown();
await executeProcessing();

// Execute processing based on command-line args
async function executeProcessing() {
	console.time("Total image processing time");
	try {
		if (IS_LOCAL) await processImages("local", { force: IS_FORCE });
		if (IS_CMS) await processImages("cms", { force: IS_FORCE });
		if (!IS_LOCAL && !IS_CMS) {
			logWarn(
				"No image processing category specified. Use --local and/or --cms.",
			);
		}
	} catch (error) {
		logError("Error during image processing:", error);
	}
	console.timeEnd("Total image processing time");
}
