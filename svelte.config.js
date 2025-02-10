import adapterStatic from "@sveltejs/adapter-static";

const target = process.env.DEPLOY_TARGET || "staging";
const production = target === "production";

const CSP_YOUTUBE = "https://www.youtube.com";
const CSP_SETMORE = "https://mikrouli.setmore.com";
const CSP_UMAMI = "https://cloud.umami.is/script.js";
const CSP_WHITELIST = {
	frames: [CSP_YOUTUBE, CSP_SETMORE],
	scriptAttr: [CSP_UMAMI], // Ensures script attributes work
	media: [CSP_YOUTUBE], // Ensures video playback works
};
const CSP_REPORT_URI = production ? "/" : "/mikrouli";
/** @type {import('@sveltejs/kit').CspDirectives} */
const CSP = {
	"default-src": ["self"], // Default policy for loading resources
	"script-src": ["self", "unsafe-inline"], // No external scripts
	"script-src-elem": ["self", ...CSP_WHITELIST.scriptAttr], // Only allow whitelisted script attributes
	"style-src": ["self", "unsafe-inline"], // No external styles
	"img-src": ["self", "data:"], // No external images
	"connect-src": ["self"], // No external fetch requests
	"font-src": ["self"], // No external fonts
	"object-src": ["none"], // Blocks Flash, ActiveX, etc.
	"frame-src": ["self", ...CSP_WHITELIST.frames], // Only allow frames from these sources
	"media-src": ["self", ...CSP_WHITELIST.media], // Only allow media from these sources
	"frame-ancestors": ["none"], // Prevents embedding in iframes
};

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapterStatic({
			pages: `build/${target}`,
			assets: `build/${target}`,
			fallback: undefined,
			precompress: false, // staging and production environments already pre-compress files
			strict: true,
		}),
		paths: {
			base: production ? "" : "/mikrouli",
		},
		prerender: {
			origin: production ? "https://mikrouli.nl" : "https://pvds.github.io",
		},
		env: {
			publicPrefix: "PUBLIC_",
			privatePrefix: "",
		},
		alias: {
			$config: "src/config",
			$data: "src/data",
			$global: "src/lib/components/global",
			$layout: "src/lib/components/layout",
			$ui: "src/lib/components/ui",
			$visuals: "src/lib/components/visuals",
			$types: "src/lib/types",
			$util: "scripts/util",
		},
		serviceWorker: {
			register: false,
		},
		csp: {
			directives: { ...CSP },
			reportOnly: { ...CSP, "report-uri": [CSP_REPORT_URI] },
		},
	},
};

export default config;
