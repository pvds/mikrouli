import data from "./content.json";

export const content = async () => {
	return {
		navigation: data.navigation || [],
		pages: data.pages || [],
		services: data.services || [],
		posts: data.posts || [],
	};
};
