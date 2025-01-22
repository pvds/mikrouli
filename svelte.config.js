import adapterStatic from "@sveltejs/adapter-static";

const target = process.env.DEPLOY_TARGET || "github";
const isNetlify = target === "netlify";

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapterStatic({
			pages: `build/${target}`,
			assets: `build/${target}`,
			fallback: undefined,
			precompress: false, // GitHub Pages already pre-compresses files
			strict: true,
		}),
		paths: {
			base: isNetlify ? "" : "/mikrouli",
		},
		prerender: {
			origin: isNetlify ? "https://mikrouli.nl" : "https://pvds.github.io",
		},
		env: {
			publicPrefix: "PUBLIC_",
			privatePrefix: "",
		},
		alias: {
			$data: "data",
			$const: "src/const.js",
		},
		serviceWorker: {
			register: false,
		},
	},
};

export default config;
