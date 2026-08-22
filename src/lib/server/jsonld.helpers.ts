import type { AggregateRating, ImageObject, Organization } from "schema-dts";
import {
	IMAGE_EXT,
	IMAGE_THUMBNAIL_SIZE,
	ORG_LOGO_URL,
	ORG_NAME,
	SEO_USE_AGGREGATE_RATING,
	URL_BASE_PRODUCTION,
} from "$config";
import reviewItems from "$data/generated/reviews.json";
import type { ImageField, ReviewEntry } from "$types/contentful";
import { getImageName } from "../helpers/image";

type ExtendedImageObject = ImageObject & { "@context": string };

export function iso8601Date(date: string): string {
	return date.replace(/\.\d{3}Z$/, "Z");
}

export function getImage(
	image: ImageField | undefined,
): ExtendedImageObject | undefined {
	return image
		? {
				"@context": "https://schema.org",
				"@type": "ImageObject",
				url: `${URL_BASE_PRODUCTION}/images/cms/${getImageName(image.file.fileName)}-${IMAGE_THUMBNAIL_SIZE}.${IMAGE_EXT}`,
			}
		: undefined;
}

export function getParentUrl(url: string): string {
	return url.split("/").slice(0, -1).join("/");
}

export function getOrgLogo(): ImageObject {
	return {
		"@type": "ImageObject",
		url: `${URL_BASE_PRODUCTION}/${ORG_LOGO_URL}`,
		width: {
			"@type": "QuantitativeValue",
			value: 48,
			unitText: "pixels",
		},
		height: {
			"@type": "QuantitativeValue",
			value: 48,
			unitText: "pixels",
		},
	};
}

export function getOrganization(): Organization {
	return {
		"@type": "Organization",
		name: ORG_NAME,
		logo: getOrgLogo(),
		url: URL_BASE_PRODUCTION,
	};
}

export function getAggregateRating(): AggregateRating | undefined {
	const reviews = reviewItems as ReviewEntry[];
	if (!reviews?.length || !SEO_USE_AGGREGATE_RATING) return undefined;

	const ratings = reviews.map((review) => review.fields.rating);
	const bestRating = Math.max(...ratings);
	const worstRating = Math.min(...ratings);
	const ratingValue = Number.parseFloat(
		(
			ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
		).toFixed(1),
	);
	const reviewCount = ratings.length;

	return {
		"@type": "AggregateRating",
		bestRating,
		worstRating,
		ratingValue,
		reviewCount,
		url: `${URL_BASE_PRODUCTION}/reviews`,
	};
}
