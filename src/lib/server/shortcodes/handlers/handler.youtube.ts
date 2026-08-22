interface Attributes {
	url: string;
	title?: string;
	width?: string;
	height?: string;
	priority?: string;
	controls?: string;
}

export function youtubeHandler(attributes: Record<string, string>): string {
	const { url, title, width, height, priority, controls } =
		attributes as unknown as Attributes;
	if (!url) return "";

	// Simple check to see if the URL is already an embed link
	let embedUrl = url;
	if (!url.includes("youtube.com/embed")) {
		// Extract YouTube video ID from standard URL
		const regex =
			/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/;
		const match = url.match(regex);
		const videoId = match ? match[1] : null;

		if (!videoId) return ""; // If video ID is not found, return empty string

		embedUrl = `https://www.youtube.com/embed/${videoId}`;
	}

	// Attribute values with defaults
	const iframeWidth = width || "560";
	const iframeHeight = height || "315";
	const controlsParam = controls === "true" ? "" : "controls=0";
	const loading = priority === "true" ? "eager" : "lazy";

	// Append controls parameter to the embed URL
	// Check if the embedUrl already has query parameters
	if (embedUrl.includes("?")) {
		embedUrl += `&${controlsParam}`;
	} else {
		embedUrl += `?${controlsParam}`;
	}

	// Return the iframe HTML as a single line to render correctly
	return `<iframe class="shortcode-youtube" width="${iframeWidth}" height="${iframeHeight}" src="${embedUrl}" title="${title || "YouTube video player"}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen loading="${loading}"></iframe>`.trim();
}
