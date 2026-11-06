import adapterStatic from "@sveltejs/adapter-static";
import type { Config as SvelteKitConfig } from "@sveltejs/kit/vite";
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
} from "#config";

const target = process.env.DEPLOY_TARGET || "staging";
const production = target === "production";
type CspDirectives = NonNullable<
	NonNullable<SvelteKitConfig["csp"]>["directives"]
>;
const sitemapOptions = {
	attribution: false,
	domain: production ? URL_BASE_PRODUCTION : URL_BASE_STAGING,
	outDir: production ? BUILD_DIR_PRODUCTION : BUILD_DIR_STAGING,
};

const CSP_YOUTUBE = "https://www.youtube.com";
const CSP_SETMORE = "https://mikrouli.setmore.com";
const CSP_UMAMI = "https://cloud.umami.is/script.js";
const CSP_UMAMI_API = "https://gateway.umami.is/api/send";

const CSP_WHITELIST: {
	scriptElem: NonNullable<CspDirectives["script-src-elem"]>;
	connect: NonNullable<CspDirectives["connect-src"]>;
	frames: NonNullable<CspDirectives["frame-src"]>;
	media: NonNullable<CspDirectives["media-src"]>;
} = {
	scriptElem: [CSP_UMAMI] /* Ensures script attributes work */,
	connect: [CSP_UMAMI_API] /* Ensures Umami API works */,
	frames: [CSP_YOUTUBE, CSP_SETMORE] /* Ensures iframes work */,
	media: [CSP_YOUTUBE] /* Ensures video playback works */,
};

// TODO: Implement CSP reporting endpoint
const CSP_REPORT_ENDPOINT = production ? "/" : "/mikrouli";

const CSP: CspDirectives = {
	"default-src": ["self"] /* Default policy for loading resources */,
	"script-src": ["self", "unsafe-inline"] /* No external scripts */,
	"script-src-elem": [
		"self",
		...CSP_WHITELIST.scriptElem,
	] /* Only allow whitelisted script el */,
	"style-src": ["self", "unsafe-inline"] /* No external styles */,
	"img-src": ["self", "data:"] /* No external images */,
	"connect-src": [
		"self",
		...CSP_WHITELIST.connect,
	] /* Load urls using script interfaces */,
	"font-src": ["self"] /* No external fonts */,
	"object-src": ["none"] /* Blocks Flash, ActiveX, etc. */,
	"frame-src": [
		"self",
		...CSP_WHITELIST.frames,
	] /* Only allow frames from these sources */,
	"media-src": [
		"self",
		...CSP_WHITELIST.media,
	] /* Only allow media from these sources */,
	"frame-ancestors": ["none"] /* Prevents embedding in iframes */,
};

export default defineConfig({
	plugins: [
		VitePluginBrowserSync(),
		sveltekit({
			adapter: adapterStatic({
				pages: `build/${target}`,
				assets: `build/${target}`,
				fallback: undefined,
				precompress: false /* staging and production environments already pre-compress files */,
				strict: true,
			}),
			paths: {
				base: production ? "" : "/mikrouli",
				relative: false,
				origin: production
					? "https://mikrouli.org"
					: "https://pvds.github.io",
			},
			prerender: {
				handleHttpError: ({ path, referrer, message }) => {
					console.error(
						`[prerender] ${message} at ${path} (linked from ${referrer})`,
					);

					throw new Error(
						`Prerendering failed, see console for details`,
					);
				},
			},
			serviceWorker: { register: false },
			csp: {
				directives: production ? { ...CSP } : {},
				reportOnly: { ...CSP, "report-to": [CSP_REPORT_ENDPOINT] },
			},
		}),
		svelteSitemap(sitemapOptions),
		tailwindcss(),
	],
});
