import adapterStatic from "@sveltejs/adapter-static";

const target = process.env.DEPLOY_TARGET || "staging";
const production = target === "production";

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
	},
};

export default config;
