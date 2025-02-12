const baseRules = `
# Sitemap: https://mikrouli.nl/sitemap.xml # TODO: Uncomment when sitemap is available

# Block private directories
Disallow: /admin/
Disallow: /private/

# Example of blocking a specific bot
User-agent: BadBot
Disallow: /
`;

export const prerender = true;

export function GET() {
	const isProduction = process.env.DEPLOY_TARGET === "production";

	// Apply dynamic indexing rule
	// const indexingRule = isProduction ? "Allow: /" : "Disallow: /";
	const indexingRule = "Disallow: /";

	// Combine the dynamic rule with the static rules
	const content = `User-agent: *\n${indexingRule}\n\n${baseRules.trim()}`;

	return new Response(content, {
		headers: { "Content-Type": "text/plain" },
	});
}
