/**
 * @file JSON-LD helpers.
 *
 * @typedef {import('$types/contentful').ImageField} ImageField
 * @typedef {import('$types/contentful').ReviewEntry} ReviewEntry
 * @typedef {import('schema-dts').ImageObject} ImageObject
 * @typedef {import('schema-dts').Organization} Organization
 * @typedef {import('schema-dts').AggregateRating} AggregateRating
 * @typedef {ImageObject & { "@context": string }} ExtendedImageObject
 */

import {
	IMAGE_EXT,
	IMAGE_THUMBNAIL_SIZE,
	ORG_LOGO_URL,
	ORG_NAME,
	SEO_USE_AGGREGATE_RATING,
	URL_BASE_PRODUCTION,
} from "$config";
import reviewItems from "$data/generated/reviews.json";
import { getImageName } from "../helpers/image.js";

/**
 * Remove milliseconds from the date string.
 * @param {string} date - The date string.
 * @return {string} The date string without milliseconds.
 */
export function iso8601Date(date) {
	return date.replace(/\.\d{3}Z$/, "Z");
}

/**
 * Get the image object for JSON-LD.
 * @param {ImageField|undefined} image
 * @return {ExtendedImageObject|undefined}
 */
export function getImage(image) {
	return image
		? {
				"@context": "https://schema.org",
				"@type": "ImageObject",
				url: `${URL_BASE_PRODUCTION}/images/cms/${getImageName(image.file.fileName)}-${IMAGE_THUMBNAIL_SIZE}.${IMAGE_EXT}`,
			}
		: undefined;
}

/**
 * Helper function to get the parent URL by removing its last segment.
 * For example, given "https://example.com/blog/post", it returns "https://example.com/blog".
 * @param {string} url - The full URL.
 * @returns {string} - The parent URL.
 */
export function getParentUrl(url) {
	return url.split("/").slice(0, -1).join("/");
}

/**
 * Get the Organization logo.
 * @return {ImageObject}
 */
export function getOrgLogo() {
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

/**
 * Create an Organization object with optional URL.
 *
 * @return {Organization}
 */
export function getOrganization() {
	return {
		"@type": "Organization",
		name: ORG_NAME,
		logo: getOrgLogo(),
		url: URL_BASE_PRODUCTION,
	};
}

/**
 * Get the aggregate rating object.
 * @return {AggregateRating|undefined}
 */
export function getAggregateRating() {
	const reviews = reviewItems;
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
