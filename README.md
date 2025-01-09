# Mikrouli Website

> Platform for systemic change.

Mikrouli is a modern web platform designed to facilitate systemic change by providing a robust and scalable architecture for managing content, maintaining brand consistency, and delivering a seamless user experience. Built with SvelteKit, Tailwind CSS, and powered by Contentful as a headless CMS, the platform prioritizes performance, maintainability, and developer-friendly workflows.

<!-- TOC -->
* [Mikrouli Website](#mikrouli-website)
  * [Features](#features)
  * [Getting Started](#getting-started)
    * [Environment Variables](#environment-variables)
    * [Local Development](#local-development)
    * [Build and Preview](#build-and-preview)
    * [Commit](#commit)
  * [Scripts](#scripts)
  * [Content Workflow](#content-workflow)
  * [CI/CD Workflow](#cicd-workflow)
  * [Project Structure](#project-structure)
    * [Key Directories](#key-directories)
    * [Example Files](#example-files)
  * [Documentation](#documentation)
<!-- TOC -->

## Features

- [**Svelte**](https://svelte.dev/): Frontend framework
	- [**SvelteKit**](https://kit.svelte.dev/): Svelte app framework
    - [**Svelte Check**](https://svelte.dev/docs/cli/sv-check): Type checking
- [**Tailwind CSS**](https://tailwindcss.com/): Utility-first CSS framework
- [**Bun**](https://bun.sh/): Package manager
- [**Vite**](https://vitejs.dev/): Build tool
- [**Vitest**](https://vitest.dev/): Testing framework
- [**Playwright**](https://playwright.dev/): End-to-end testing
- [**Biome**](https://biomejs.dev/): Linting and formatting
- [**Lefthook**](https://evilmartians.com/opensource/lefthook): Git hooks
- [**GitHub**](https://github.com): Version control & CI/CD
- [**GitHub Pages**](https://pages.github.com/): Hosting
- [**Contentful**](https://www.contentful.com/): Headless CMS
- [**JSDoc**](https://jsdoc.app/): Documentation

## Getting Started

### Environment Variables

Set up a `.env` file in the root of your project with the following variables:

```env
CONTENTFUL_SPACE_ID=<Your Contentful Space ID>
CONTENTFUL_ACCESS_TOKEN=<Your Contentful Access Token>
PUBLIC_ENVIRONMENT=development
```

### Local Development

1. Install dependencies:
   ```bash
   bun install
   ```

2. Start the development server:
   ```bash
   bun run dev --open
   ```

3. Optionally, run the svelte-check watcher for code checks:
   ```bash
   bun run watch
   ```

### Build and Preview

To create a production build:
```bash
bun run build
```

Preview the production build:
```bash
bun run preview
```

### Commit

When committing changes Lefthook will run the following checks:
- **Biome**: Linting and formatting
- **Svelte-check**: Svelte specific CSS/JS/TS linting

## Scripts

The project includes a range of NPM scripts for common tasks:

- **Development**: Start the development server.
  ```bash
  bun run dev
  ```

- **Build**: Generate a production build.
  ```bash
  bun run build
  ```

- **Check Code Quality**: Lint and check Svelte files.
  ```bash
  bun run check
  ```

- **Fetch Content**: Download and process Contentful data.
  ```bash
  bun run util:content
  ```

- **Generate Favicons**: Create favicon files.
  ```bash
  bun run util:favicons
  ```

## Content Workflow

The website integrates with Contentful to manage content. The process is as follows:

1. **Fetch Content**: The `fetchContent.js` script retrieves data from Contentful using environment variables for authentication. It fetches content types such as `navigation`, `pages`, `services`, and `posts`, and stores them in JSON files in the `src/lib/data/` directory&#8203;:contentReference[oaicite:0]{index=0}.

2. **Transform Content**: The `transformContent.js` script processes raw Contentful data into a structured format. This includes resolving relationships, parsing sections, and organizing navigation&#8203;:contentReference[oaicite:1]{index=1}.

## CI/CD Workflow

The CI/CD pipeline is defined in `ci.yml` and managed via GitHub Actions:

1. **Build Job**:
	- Runs on `main` branch pushes and pull requests.
	- Installs dependencies using Bun.
	- Lints and checks code.
	- Fetches content from Contentful (except on pull requests).
	- Builds the project.
	- Uploads the build artifacts.

2. **Deploy Job**:
	- Deploys the site to GitHub Pages using the built artifacts.

Environment secrets such as `CONTENTFUL_SPACE_ID` and `CONTENTFUL_ACCESS_TOKEN` are used for secure data fetching during the CI process&#8203;:contentReference[oaicite:2]{index=2}.

## Project Structure

The project follows a modular and organized structure:

### Key Directories

- **`docs/`**: Project documentation
	- `brand-guide.md`: Brand guidelines and styling rules.
	- `content.md`: Documentation for content structure.
	- `headless-integration.md`: Integration details for Contentful.
	- `jsdoc.md`: Guidelines for documentation using JSDoc.

- **`src/`**: Application source code
	- **`lib/`**: Shared utilities, components, styles, and data
		- `components/`: Svelte components
			- Example: `Header.svelte`: Site header component.
		- `data/`: JSON data generated from Contentful
			- Example: `pages.json`: Contains data for page rendering.
		- `server/`: Backend logic for fetching and transforming data
			- Example: `content.js`: Fetches and processes Contentful data.
		- `styles/`: Tailwind-based styles
			- Example: `theme.css`: Theming variables for the site.
	- **`routes/`**: SvelteKit route handlers
		- Example: `about/+page.svelte`: A route for the "About" page.

- **`static/`**: Static assets such as fonts, icons, and manifest files
	- Example: `favicon.svg`: Favicon for the site.

### Example Files

- `src/routes/about/+page.svelte`: Defines the "About" page content.
- `src/lib/components/shell/Header.svelte`: Component for the site header.
- `src/lib/data/navigation.json`: JSON file for navigation links.
- `src/lib/server/content.js`: Fetches Contentful data.
- `src/styles/theme.css`: Site-wide theming configuration.

## Documentation

Explore additional documentation in the `docs/` directory:

- [Brand Guide](docs/brand-guide.md)
- [JSDoc Guide](docs/jsdoc.md)
