# Mikrouli development platform

> Platform for systemic change.

Mikrouli is build on a modern web platform providing a robust and scalable
architecture for managing content, maintaining brand consistency, and delivering
a seamless user experience. Built with SvelteKit, Tailwind CSS, and powered by
Contentful as a headless CMS, the platform prioritizes performance,
maintainability, and developer-friendly workflows.

**Table of Contents**

- [Features](#features)
- [Getting Started](#getting-started)
    - [Local Development](#local-development)
    - [Build and Preview](#build-and-preview)
    - [Commit](#commit)
- [Development Principles](#development-principles)
    - [Core Principles](#core-principles)
    - [Key Focus Areas](#key-focus-areas)
- [Scripts](#scripts)
- [Content Workflow](#content-workflow)
- [CI/CD Workflow](#cicd-workflow)
- [Project Structure](#project-structure)
    - [Key Directories](#key-directories)
    - [Example Files](#example-files)
- [Troubleshooting](#troubleshooting)
    - [Common Issues](#common-issues)
- [Documentation](#documentation)

## Features

- [**Svelte**](https://svelte.dev/): Frontend framework
    - [**SvelteKit**](https://kit.svelte.dev/): Svelte app framework
        - [**Svelte Check**](https://svelte.dev/docs/cli/sv-check): Type
          checking
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

### Local Development

Quick start by running `bun i && bun start`.

> `bun start` is a shorthand for `bun dev --open & bun run watch`

### Install Dependencies

> For macOS, using [Homebrew](https://brew.sh/) is recommended for easy
> installation of development tools.

1. **Install Node.js**:

    - Install Node.js (v22 or newer) by following the
      [Node.js documentation](https://nodejs.org/).
    - For macOS, you can use Homebrew:
        ```bash
        brew install node
        ```

2. **Install Bun**:
    - Install Bun (v1 or newer) by following the
      [Bun installation guide](https://bun.sh/).
    - For macOS, use the provided installation script:
        ```bash
        curl -fsSL https://bun.sh/install | bash
        ```

### Local development

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

### Environment Variables (optional)

> This step is optional because we check in generated content files to the
> repository. If you want to fetch content from Contentful, you need to set up
> environment variables.

Set up a `.env` file in the root of your project with the following variables:

```env
CONTENTFUL_SPACE_ID=<Your Contentful Space ID>
CONTENTFUL_ACCESS_TOKEN=<Your Contentful Access Token>
PUBLIC_ENVIRONMENT=development
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

## Development Principles

### Core Principles

- **Low Effort, High Impact**: Develop features with minimal complexity,
  prioritizing functional outcomes.
- **Iterative Refinement**: Enhance features gradually post-deployment to
  optimize usability, maintainability, and scalability.

### Key Focus Areas

1. **Ease of Use**:

    - Prioritize intuitive setup and minimal configuration.

2. **Performance and Accessibility**:

    - Emphasize perceived performance as the top metric and aim for WCAG AA
      compliance.

3. **Simplicity**:

    - Maintain simplicity for end users, accepting complexity only when it
      enhances maintainability or scalability.

4. **Web Standards Preference**:

    - Utilize native browser APIs and avoid external frameworks unless
      necessary.

5. **HTML/CSS-First**:

    - Minimize JavaScript usage; rely on JS polyfills only when modern HTML/CSS
      features are inadequate.

6. **Scalability and Internationalization**:

    - Design systems to support future scaling and localization requirements.

7. **Documentation and Versioning**:
    - Continuously document with minimal overhead and use semantic versioning,
      automated changelogs, and conventional commits.

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

- **Clean**: Clear cache and output folders and reinstall dependencies.

    ```bash
    bun run util:clean
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

The website integrates with Contentful to manage content. The process is as
follows:

1. **Fetch Content**: The `fetchContent.js` script retrieves data from
   Contentful using environment variables for authentication. It fetches content
   types such as `navigation`, `pages`, `services`, and `posts`, and stores them
   in JSON files in the `src/lib/data/` directory.

2. **Transform Content**: The `transformContent.js` script processes raw
   Contentful data into a structured format. This includes resolving
   relationships, parsing sections, and organizing navigation.

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

Environment secrets such as `CONTENTFUL_SPACE_ID` and `CONTENTFUL_ACCESS_TOKEN`
are used for secure data fetching during the CI process.

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

## Troubleshooting

### Common Issues

1. **Dependency Installation Fails**:

    - Verify the installed versions of Node.js and Bun meet the requirements.
    - Ensure your package manager (e.g., Homebrew) is updated.
    - Check for conflicting versions of dependencies using:
        ```bash
        bun doctor
        ```

2. **Environment Variable Errors**:

    - Verify your `.env` file is correctly set up and contains the necessary
      variables:
        ```env
        CONTENTFUL_SPACE_ID=<Your Space ID>
        CONTENTFUL_ACCESS_TOKEN=<Your Access Token>
        PUBLIC_ENVIRONMENT=development
        ```

3. **Content Fetch Issues**:

    - Confirm the Contentful API keys in `.env` are accurate.
    - Check network connectivity.

4. **Dev/Build/Preview Errors**:
    - Run the clean script to remove cached files and reinstall dependencies:
        ```bash
        bun run clean
        ```

## Documentation

Explore additional documentation in the `docs/` directory:

- [Brand Guide](docs/brand-guide.md)
- [JSDoc Guide](docs/jsdoc.md)
