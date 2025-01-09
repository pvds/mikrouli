import adapterStatic from "@sveltejs/adapter-static";

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		// adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://svelte.dev/docs/kit/adapters for more information about adapters.
		adapter: adapterStatic({
			pages: "build",
			assets: "build",
			fallback: undefined,
			precompress: false, // GitHub pages already pre compresses files
			strict: true,
		}),
		paths: {
			base: "/mikrouli",
		},
		prerender: {
			origin: "https://pvds.github.io",
		},
		env: {
			publicPrefix: "PUBLIC_",
			privatePrefix: "",
		},
		serviceWorker: {
			register: false,
		},
	},
};

export default config;
