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

- **[GitHub Pages](https://pages.github.com/):** Static hosting.
- **[Contentful](https://www.contentful.com/):** Headless CMS for managing
  content.

---

## Getting Started

### Install Dependencies

> For macOS we recommend using [Homebrew](https://brew.sh/)
> For Windows we recommend using [Scoop](https://scoop.sh/)

1. **Install Node.js** (v22 or newer):  
   Follow the [Node.js documentation](https://nodejs.org/).
	- macOS: `brew install node` or `brew install nvm`
	- windows: `scoop install nodejs` or use [nvm for windows](https://github.com/coreybutler/nvm-windows)

2. **Install Bun** (v1 or newer):  
   Follow the [Bun installation guide](https://bun.sh/). 
	- macOS/Linux: `brew install oven-sh/bun/bun` or `curl -fsSL https://bun.sh/install | bash`
    - windows: `scoop bucket add main` && `scoop install bun` or `powershell -c "irm bun.sh/install.ps1 | iex"`

3. Install project dependencies:
    ```bash
    bun install
    ```

### Local Development

Quick start by running `bun i && bun start`.

> `bun start` is a shorthand for `bun dev --open & bun run watch`.

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

### Environment Variables

To fetch live content from Contentful, add a `.env` file to the project root,
you can use `.env.example` file as a template:

```env
CONTENTFUL_SPACE_ID=<Your Contentful Space ID>
CONTENTFUL_ACCESS_TOKEN=<Your Contentful Access Token>
PUBLIC_ENVIRONMENT=development
```

---

## Scripts

- **Development Server:**

    ```bash
    bun run dev
    ```

- **Build:**

    ```bash
    bun run build
    ```

- **Code Checks:**

    ```bash
    bun run check
    ```

- **Fetch Content:**

    ```bash
    bun run util:content
    ```

- **Clean and Reset:**
    ```bash
    bun run util:clean
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

GitHub Actions handles CI/CD:

1. **Build Stage:** Lint, check, and build the project on every push to `main`.
2. **Deploy Stage:** Deploy artifacts to GitHub Pages.

> Secrets such as `CONTENTFUL_SPACE_ID` and `CONTENTFUL_ACCESS_TOKEN` are
> securely managed via GitHub.

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

The project is modular and organized as follows, also refer to [sveltekit 
project structure](https://svelte.dev/docs/kit/project-structure):

```
.
├── docs/                 # Project documentation
├── scripts/              # Helper scripts
├── src/                  # Application source code
│   ├── lib/
│   │   ├── components/   # Svelte UI components
│   │   ├── images/       # Image assets
│   │   ├── data/         # JSON data files (generated from contentful)
│   │   ├── server/       # Server-only lib files
│   │   ├── styles/       # Global styling
│   │   └── types /       # Typing d.ts files for usage in jsdoc
│   ├── routes/           # SvelteKit route handlers
│   └── static/           # Static assets (e.g., favicon.svg)
├── .editorconfig         # Editor configuration
├── .env                  # Environment variables (see .env.example)
├── .gitignore            # Git ignore rules
├── .npmrc                # npm configuration
├── biome.jsonc           # Linting and formatting configuration
├── bun.lockb             # Bun lock file
├── favicons.json         # Favicon configuration
├── jsconfig.json         # JavaScript configuration
├── lefthook.yml          # Git hooks configuration
├── package.json          # Project metadata
├── svelte.config.js      # Svelte configuration
└── vite.config.js        # Vite configuration
```

---

## Troubleshooting

| **Issue**                   | **Solution**                                                              |
|-----------------------------|---------------------------------------------------------------------------|
| Installation fails          | Verify Node.js and Bun versions meet requirements.                        |
| Environment variable errors | Ensure `.env` exists and contains valid Contentful keys, see .env.example |
| Contentful fetch errors     | Check API keys and network connectivity.                                  |
| Build or dev errors         | Run the clean script: `bun run util:clean`.                               |

---

## Documentation

Explore more in the `docs/` directory:

- **[Brand Guide](docs/brand-guide.md):** Branding and style guidelines.
- **[JSDoc Guide](docs/jsdoc.md):** Using JSDoc for type safety in JavaScript
