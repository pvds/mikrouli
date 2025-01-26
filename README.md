# Mikrouli Development Platform

> Platform for systemic change.

Mikrouli leverages a modern web platform, combining performance, scalability,
and maintainability. It is built using **SvelteKit**, **Tailwind CSS**, and
powered by **Contentful** as a headless CMS. The platform emphasizes a seamless
developer experience and user-centric design.

---

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
- [Scripts](#scripts)
- [Workflow](#workflow)
- [Development Principles](#development-principles)
- [Project Structure](#project-structure)
- [Troubleshooting](#troubleshooting)
- [Documentation](#documentation)

---

## Features

### Development Tools

- **[SvelteKit](https://kit.svelte.dev/):** Framework for building modern web
  applications.
- **[Tailwind CSS](https://tailwindcss.com/):** Utility-first CSS framework.
- **[Bun](https://bun.sh/):** High-performance JavaScript runtime and package
  manager.
- **[Vite](https://vitejs.dev/):** High-speed build tool.

### Testing and Quality Assurance

- **[Vitest](https://vitest.dev/):** Unit testing framework.
- **[Playwright](https://playwright.dev/):** End-to-end testing tool.
- **[Biome](https://biomejs.dev/):** Linting and formatting.
- **[Lefthook](https://evilmartians.com/opensource/lefthook):** Git hooks for
  automated checks.

### Hosting and CMS

- **[GitHub Pages](https://pages.github.com/):** Staging environment host
- **[Netlify](https://www.netlify.com/):** Production environment host
- **[Contentful](https://www.contentful.com/):** Headless CMS for managing
  content.

---

## Getting Started

If you already have all dependencies quick start by running
`bun i && bun  start`.

> `bun start` is a shorthand for `bun dev --open & bun run watch`.

### Prerequisites

> For macOS we recommend using [Homebrew](https://brew.sh/) For Windows we
> recommend using [Scoop](https://scoop.sh/)

1. **Install Node.js** (v22 or newer):  
   Follow the [Node.js documentation](https://nodejs.org/).

    - macOS: `brew install node` or `brew install nvm`
    - windows: `scoop install nodejs` or use
      [nvm for windows](https://github.com/coreybutler/nvm-windows)

2. **Install Bun** (v1 or newer):  
   Follow the [Bun installation guide](https://bun.sh/).

    - macOS/Linux: `brew install oven-sh/bun/bun` or
      `curl -fsSL https://bun.sh/install | bash`
    - windows: `scoop bucket add main` && `scoop install bun` or
      `powershell -c "irm bun.sh/install.ps1 | iex"`

3. Install project dependencies:
    ```bash
    bun install
    ```
4. Set up the project:
    ```bash
    bun run util:prepare
    ```

### Local Development

1. Install dependencies:

    ```bash
    bun install
    ```

2. Start the development server:

    ```bash
    bun start
    ```

---

## Scripts

- **Setup**

    ```bash
    bun run prepare        		# Install git hooks with Lefthook
    ```

- **Development**

    ```bash
    bun run start          		# Start development server and watch for changes
    bun run start:prod     		# Build and start production server
    ```

- **Build**

    ```bash
    bun run build              	# Build for staging
    bun run build:prod   	# Build for production
    ```

- **Preview**

    ```bash
    bun run preview            	# Preview staging build
    bun run preview:prod 	# Preview production build
    ```

- **Testing**

    ```bash
    bun run test:lighthouse 	# Run Lighthouse performance tests
    bun run test:axe        	# Run accessibility tests
    ```

- **Watching**

    ```bash
    bun run watch       		# Watch for changes in Svelte files
    bun run watch:scripts		# Watch for changes in script files
    ```

- **Code Quality**

    ```bash
    bun run check         		# Run formatting, Svelte, and script checks
    bun run check:ci      		# Run checks for CI pipeline
    bun run check:all      		# Run all checks including build
    bun run check:format    	# Check code formatting
    bun run check:scripts   	# Check script files
    bun run check:svelte    	# Check Svelte files
    bun run write          		# Fix formatting issues
    ```

- **Content Management**

    ```bash
    bun run content         	# Fetch content and process assets
    bun run content:fetch   	# Fetch content from CMS
    ```

- **Asset Management**

    ```bash
    bun run assets          	# Fetch and process images
    bun run assets:fetch    	# Fetch assets from CMS
    bun run assets:process  	# Process fetched assets
    bun run assets:favicons 	# Generate favicons
    ```

- **Workspace Management**

    ```bash
    bun run workspace:prepare 	# Prepare the workspace
    bun run workspace:clean   	# Clean the workspace
    ```

---

## Workflow

### Content Workflow

Mikrouli integrates with Contentful for content management. The workflow:

1. **Fetch Content:** Use `fetchContent.js` to retrieve raw data from
   Contentful.
2. **Transform Data:** Process the fetched data into structured JSON for
   rendering.
3. **Render Pages:** Build dynamic pages using the transformed data.

### CI/CD Workflow

GitHub Actions handles CI/CD using our [CI workflow](.github/workflows/ci.yml).
The workflow is documented in the [workflow documentation](docs/workflow.md).

> Environment secrets are
> [securely managed via GitHub](https://github.com/pvds/mikrouli/settings/secrets/actions).

---

## Development Principles

### Core Principles

- **Low Effort, High Impact:** Focus on delivering high-value features with
  minimal complexity.
- **Iterative Refinement:** Enhance features post-deployment to improve
  usability, scalability, and maintainability.

### Key Focus Areas

1. **Ease of Use:** Prioritize intuitive setup and minimal configuration.
2. **Performance:** Optimize for perceived performance as the top metric.
3. **Accessibility:** Design with WCAG AA compliance in mind.
4. **Simplicity:** Keep the platform straightforward for end users; embrace
   complexity only if it improves maintainability or scalability.
5. **Scalability:** Ensure systems support future growth and localization.
6. **Web Standards First:** Use modern HTML/CSS features and minimize JavaScript
   usage.
7. **HTML/CSS-First:** Minimize JavaScript reliance, using polyfills sparingly.

---

## Project Structure

The project is modular and organized as follows, also refer to
[sveltekit project structure](https://svelte.dev/docs/kit/project-structure):

```
.
├── .github/                  # Github related files
│   ├── actions/              # Composite actions used in workflows
│   └── workflows/            # CI/CD workflows
├── docs/                     # Project documentation
├── images/                   # Soource images for the project
├── scripts/                  # Node scripts
│   ├── assets/               # Asset related scripts
│   ├   ├── fetch.js          # Fetch CMS images
│   ├   └── process.js        # Process local and CMS images
│   ├── content/              # CMS content scripts
│   ├   ├── fetch.js          # Fetch CMS content
│   ├   └── process.js        # Process content data
│   ├── test/                 # Testing scripts
│   └── util/                 # Utility scripts
├── src/                      # Svelte source code
│   ├── data/                 # JSON data files
│   │   ├── generated/        # Generated JSON data files
│   │   ├── global.json       # Global application data
│   │   └── seo.json          # Default SEO data
│   ├── lib/                  # Svelte library files
│   │   ├── components/       # Svelte components
│   │   │   ├── global/       # Application shell components
│   │   │   ├── layout/       # Structural layout components
│   │   │   ├── ui/           # Reusable UI components
│   │   │   ├── visuals/      # Decorative visual components
│   │   ├── helpers/          # Helper functions
│   │   ├── server/           # Server-only code
│   │   ├── styles/           # Global styling
│   │   └── types/            # Typing d.ts files for usage in jsdoc
│   └── routes/               # SvelteKit route handlers
├── static/                   # Static assets (copied to build)
│   ├── fonts/                # Font files
│   ├── images/               # Image assets
│   │   ├── cms/              # Optimized CMS images (generated)
│   │   └── local/            # Optimized local images from (generated)
│   └── pwa/                  # PWA assets (manifest, icons, images)
├── .editorconfig             # Editor configuration
├── .env                      # Environment variables (see .env.example)
├── .gitignore                # Git ignore rules
├── .npmrc                    # npm configuration
├── biome.jsonc               # Linting and formatting configuration
├── bun.lockb                 # Bun lock file
├── favicons.json             # Favicon configuration
├── jsconfig.json             # JavaScript configuration
├── lefthook.yml              # Git hooks configuration
├── package.json              # Project metadata
├── svelte.config.js          # Svelte configuration
└── vite.config.js            # Vite configuration
```

---

## Troubleshooting

| **Issue**               | **Solution**                                                              |
| ----------------------- | ------------------------------------------------------------------------- |
| Installation fails      | Verify Node.js and Bun versions meet requirements.                        |
| Contentful fetch errors | Ensure `.env` exists and contains valid Contentful keys, see .env.example |
| Build or dev errors     | Run the clean script: `bun run util:clean`.                               |

---

## Guidelines

### Tailwind

#### Using @apply

In general, `@apply` is not recommended. In some cases it can be useful:

- you don't have control over the HTML structure (e.g. when using a 3rd party
  component)
- styling elements that cannot be targeted with a class (e.g. scrollbar)

Alternative to using `@apply`:

- use the theme() and screen() functions to access Tailwind's configuration

This serves as an example on how to do it (using @reference)

- theme.css allows accessing generated theme classes
- utilities.css allows accessing generated custom utility classes

```html
<style>
	@reference "$lib/styles/theme.css";
	@reference "$lib/styles/utilities.css";

	.nav-menu--bottom {
		@apply w-full flex justify-around fixed left-0 bottom-0 bg-primary-900 px-1 py-2;
	}

	.nav-menu--inline {
		@apply flex relative gap-2 bg-primary-900;
	}

	.nav-menu__link {
		@apply inline-block w-full text-center px-3 py-1 font-semibold;
	}
</style>
```

## Documentation

Explore more in the `docs/` directory:

- **[Brand Guide](docs/brand-guide.md):** Branding and style guidelines.
- **[JSDoc Guide](docs/jsdoc.md):** Using JSDoc for type safety in JavaScript
