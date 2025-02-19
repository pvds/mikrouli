import { PARAMS_PAGES_EXCLUDE } from "$config";

/**
 * @param {string} param
 * @return {param is string}
 * @satisfies {import('@sveltejs/kit').ParamMatcher}
 */
export function match(param) {
	return !PARAMS_PAGES_EXCLUDE.includes(param);
}
