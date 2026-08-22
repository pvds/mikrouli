import { sveltekit } from "@sveltejs/kit/vite";
import tailwindcss from "@tailwindcss/vite";
import { svelteSitemap } from "svelte-sitemap/vite";
import { defineConfig } from "vite";
import VitePluginBrowserSync from "vite-plugin-browser-sync";
import {
	BUILD_DIR_PRODUCTION,
	BUILD_DIR_STAGING,
	URL_BASE_PRODUCTION,
	URL_BASE_STAGING,
} from "./src/config.js";

const target = process.env.DEPLOY_TARGET || "staging";
const production = target === "production";
const sitemapOptions = {
	attribution: false,
	domain: production ? URL_BASE_PRODUCTION : URL_BASE_STAGING,
	outDir: production ? BUILD_DIR_PRODUCTION : BUILD_DIR_STAGING,
};

export default defineConfig({
	plugins: [
		VitePluginBrowserSync(),
		sveltekit(),
		svelteSitemap(sitemapOptions),
		tailwindcss(),
	],
});
