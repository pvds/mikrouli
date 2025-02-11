/**
 * SVG icon
 * @param {import('$types/content').CtaIcon} name
 * @return {string}
 */
export const svgIcon = (name) => {
	const classes =
		"inline h-[1em] ml-[0.4em] -mt-[3px] group-hover:scale-110 transition-transform";
	switch (name) {
		case "external":
			return `<svg class="${classes}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M352 0a32 32 0 0 0-23 55l42 41-170 169a32 32 0 0 0 46 46l169-170 41 42c10 9 23 12 35 7s20-17 20-30V32c0-18-14-32-32-32H352zM80 32C36 32 0 68 0 112v320c0 44 36 80 80 80h320c44 0 80-36 80-80V320a32 32 0 1 0-64 0v112c0 9-7 16-16 16H80c-9 0-16-7-16-16V112c0-9 7-16 16-16h112a32 32 0 1 0 0-64H80z"/></svg>`;
		case "internal":
			return `<svg class="${classes} group-hover:animate-wiggle-right" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M439 279c12-13 12-33 0-46L279 73a32 32 0 0 0-46 46l106 105H32a32 32 0 1 0 0 64h307L233 393a32 32 0 0 0 46 46l160-160z"/></svg>`;
		case "calendar":
			return `<svg class="${classes}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M152 24a24 24 0 1 0-48 0v40H64C29 64 0 93 0 128v320c0 35 29 64 64 64h320c35 0 64-29 64-64V128c0-35-29-64-64-64h-40V24a24 24 0 1 0-48 0v40H152V24zM48 192h80v56H48v-56zm0 104h80v64H48v-64zm128 0h96v64h-96v-64zm144 0h80v64h-80v-64zm80-48h-80v-56h80v56zm0 160v40c0 9-7 16-16 16h-64v-56h80zm-128 0v56h-96v-56h96zm-144 0v56H64c-9 0-16-7-16-16v-40h80zm144-160h-96v-56h96v56z"/></svg>`;
		case "dialog":
			return `<svg class="${classes}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M64 32C29 32 0 61 0 96v320c0 35 29 64 64 64h384c35 0 64-29 64-64V96c0-35-29-64-64-64H64zm32 64h320a32 32 0 1 1 0 64H96a32 32 0 1 1 0-64z"/></svg>`;
	}
};
