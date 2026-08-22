import { sveltekit } from "@sveltejs/kit/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import VitePluginBrowserSync from "vite-plugin-browser-sync";

export default defineConfig({
	plugins: [VitePluginBrowserSync(), sveltekit(), tailwindcss()],
});
