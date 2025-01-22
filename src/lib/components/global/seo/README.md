# SEO Component for SvelteKit

This component provides an efficient way to manage SEO metadata for your
SvelteKit application. It supports Open Graph, Twitter metadata, and schema.org
JSON-LD structured data, reducing boilerplate while keeping your app's SEO
optimized.

---

## Table of Contents

- [Usage](#usage)
    - [Step 1: Add to Layout](#step-1-add-to-layout)
    - [Step 2: Set Defaults in `+layout.server.js`](#step-2-set-defaults-in-layoutserverjs)
    - [Step 3: Override Metadata in `+page.server.js`](#step-3-override-metadata-in-pageserverjs)
    - [Extendable Custom Meta Tags](#extendable-custom-meta-tags)
- [Properties](#properties)
- [Important Notes](#important-notes)
- [Credits](#credits)
- [License](#license)

---

## Usage

### Step 1: Add to Layout

Add the `<Seo />` component to your `+layout.svelte` file.

```svelte
<script>
  import Seo from '$lib/components/util/seo/SEO.svelte';
</script>

<Seo />
```

> **CAUTION:** Only use `<Seo />` in `+layout.svelte`.  
> Using `<Seo />` in individual page components will cause duplicated meta tags,
> which can harm your SEO. Only include the component in your root
> +layout[.server].js file. file and manage overrides using `+page[.server].js`.

### Step 2: Set Defaults in `+layout.server.js`

Define your default metadata in the `load` function of `+layout.server.js`.
These defaults will apply to all pages unless overridden.

```javascript
// +layout.server.js
export const load = async ({ url }) => {
	return {
		seo: {
			title: "Site name - Slogan",
			description:
				"General information about the site",
			keywords:
				"keyword1, keyword2, keyword3",
			imageURL: `${url.origin}/logo.jpg`,
			siteName: "Site name",
		},
	};
};
```

### Step 3: Override Metadata in `+page.server.js`

Override metadata for specific pages in their respective `+page.server.js`
files. Metadata defined here will take precedence over the layout defaults.

> In order to access the parent data, you must pass the `parent` function.
> If you want to reuse parent data in a deeper level, like accessing `blog` 
> data in a `blog/[slug]` page, you should use a `+layout.server.js` file in
> the `blog` directory and set the shared data there for it to be accessible
> in all child pages using the `parent` function.

```javascript
// +page.server.js
/** @type {import('./$types').PageServerLoad} */
export const load = async ({ parent }) => {
	const parentData = await parent();

	const seo = {
		...parentData?.seo,
		description: "Mikrouli is a platform for systemic change",
		keywords:
			"systemic therapy, systemic change, systemic coaching, individual therapy, family therapy, organizational therapy, online therapy",
	};

	return { seo };
};

```

### Extendable Custom Meta Tags

You can extend the metadata in `+layout.svelte` with custom meta tags by using 
the 
`children` 
slot:

```svelte
<Seo>
  <meta name="google-site-verification" content="abcd123" />
</Seo>
```

---

## Properties

| Property      | Description                                               | Type                | Default                      |
| ------------- | --------------------------------------------------------- | ------------------- | ---------------------------- |
| `title`       | The title of the page                                     | `string`            | `""`                         |
| `description` | The description of the page                               | `string`            | `""`                         |
| `keywords`    | Keywords for the page                                     | `string`            | `""`                         |
| `canonical`   | The canonical URL of the page                             | `string`            | `""`                         |
| `siteName`    | The name of the site                                      | `string`            | `""`                         |
| `imageURL`    | URL of the preview image for social sharing               | `string`            | `""`                         |
| `logo`        | URL of the logo for Schema.org                            | `string`            | `""`                         |
| `author`      | The author of the page                                    | `string`            | `""`                         |
| `name`        | The name of the entity (e.g., person, organization)       | `string`            | `""`                         |
| `type`        | The type of the schema (e.g., website, article)           | `string`            | `"website"`                  |
| `index`       | Whether the page should be indexed by search engines      | `boolean`           | `true`                       |
| `twitter`     | Whether Twitter metadata should be included               | `boolean`           | `true`                       |
| `openGraph`   | Whether Open Graph metadata should be included            | `boolean`           | `true`                       |
| `schemaOrg`   | Whether to include schema.org structured data             | `boolean`           | `false`                      |
| `schemaType`  | The JSON-LD schema type(s) for the page                   | `string[]`/`string` | `["Person", "Organization"]` |
| `socials`     | Social media URLs associated with the page or entity      | `string[]`          | `[]`                         |
| `jsonld`      | Additional JSON-LD data to include in the structured data | `object`            | `{}`                         |

---

## Credits

This component is based on
[TheDahoom's SvelteKit-SEO](https://github.com/TheDahoom/Sveltekit-seo).
