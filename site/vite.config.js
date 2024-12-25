import { sveltekit } from "@sveltejs/kit/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
// TODO: importing from vitest/config breaks tailwindcss plugin auto-completion
// import { defineConfig } from "vitest/config";

export default defineConfig({
	plugins: [sveltekit(), tailwindcss()],
	test: {
		include: ["src/**/*.{test,spec}.{js,ts}"],
	},
});
