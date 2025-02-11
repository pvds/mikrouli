import { getPage, getPost, getPostEntries, getSeo, getServices } from "$lib/server/content.js";

/** @type {import('./$types').EntryGenerator} */
export const entries = async () => {
	return getPostEntries();
};

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ params }) => {
	const { slug } = params;
	const post = getPost(slug);
	const page = getPage("blog");
	const services = getServices();
	const seo = getSeo(post, "BlogPostPage");

	return { post, outro: page.fields.outro, services, seo };
};
