import { defineParams } from "@sveltejs/kit/params";
import { PARAMS_PAGES_EXCLUDE } from "#config";

const matchPages = (param: string): param is string => {
	return !PARAMS_PAGES_EXCLUDE.includes(param);
};

export const params = defineParams({
	pages: (param) => (matchPages(param) ? param : undefined),
});
