import data from "../../../static/data/content.json";

export const content = async () => {
	return {
		navigation: data.navigation || [],
		pages: data.pages || [],
		services: data.services || [],
		posts: data.posts || [],
	};
};
