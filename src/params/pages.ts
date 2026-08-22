import type { ParamMatcher } from "@sveltejs/kit";
import { PARAMS_PAGES_EXCLUDE } from "$config";

export const match: ParamMatcher = (param: string): param is string => {
	return !PARAMS_PAGES_EXCLUDE.includes(param);
};
