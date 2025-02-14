import { URL_BASE_PRODUCTION, URL_BASE_STAGING } from "$config";

const staticRules = `
# Block private directories
Disallow: /admin/
Disallow: /private/
Disallow: /tracking/
`;

export const prerender = true;

export function GET() {
	const isProduction = process.env.DEPLOY_TARGET === "production";

	// Apply dynamic indexing rules
	// TODO: remove "Disallow: /" for production when site is ready to launch
	const indexingRule = isProduction ? "Disallow: /" : "Disallow: /";
	const sitemapRule = isProduction
		? `Sitemap: ${URL_BASE_PRODUCTION}/sitemap.xml`
		: `Sitemap: ${URL_BASE_STAGING}/sitemap.xml`;

	// Define an array of dynamic rules
	const dynamicRules = [indexingRule, sitemapRule];

	// Combine the static rules with dynamic rules
	const content = `User-agent: *\n${dynamicRules.join("\n")}\n\n${staticRules.trim()}`;

	return new Response(content, {
		headers: { "Content-Type": "text/plain" },
	});
}
