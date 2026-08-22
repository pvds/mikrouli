import {
	getPage,
	getPost,
	getPostEntries,
	getSeo,
	getServices,
} from "$lib/server/content";
import type { EntryGenerator, PageServerLoad } from "./$types";

export const entries: EntryGenerator = async () => {
	return getPostEntries();
};

export const load: PageServerLoad = async ({ params }) => {
	const { slug } = params;
	const post = getPost(slug);
	const page = getPage("blog");
	const services = getServices();
	const seo = getSeo(post, "BlogPostPage");

	return { post, page: page.fields, services, seo };
};
