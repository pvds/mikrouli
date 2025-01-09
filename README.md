# Mikrouli Development Platform

> Platform for systemic change, built with **Pragmatics**.

Mikrouli is the systemic therapy business of my Eleni Papamikrouli.

Built with **Pragmatics**, a modular, open-source platform, this project
leverages SvelteKit, Tailwind CSS, and Contentful to deliver a performant,
scalable, and developer-friendly foundation for content management and user
experience.

**Table of Contents**

- [Features](#features)
- [Getting Started](#getting-started)
    - [Quick Setup](#quick-setup)
    - [Environment Variables](#environment-variables)
    - [Scripts Overview](#scripts-overview)
- [Development Principles](#development-principles)
- [Content Workflow](#content-workflow)
- [CI/CD Workflow](#cicd-workflow)
- [Project Structure](#project-structure)
- [Troubleshooting](#troubleshooting)
- [Documentation](#documentation)

---

## Features

This repository uses the **Pragmatics** platform to combine modern tools and
workflows for seamless development and content delivery:

### Development Tools

- **[SvelteKit](https://kit.svelte.dev/):** Framework for building modern web
  applications.
- **[Tailwind CSS](https://tailwindcss.com/):** Utility-first CSS framework.
- **[Bun](https://bun.sh/):** Fast JavaScript runtime and package manager.
- **[Vite](https://vitejs.dev/):** High-performance build tool.

### Testing and Quality Assurance

- **[Vitest](https://vitest.dev/):** Unit testing framework.
- **[Playwright](https://playwright.dev/):** End-to-end testing tool.
- **[Biome](https://biomejs.dev/):** Linting and formatting.
- **[Lefthook](https://evilmartians.com/opensource/lefthook):** Git hooks for
  automating tasks.

### Hosting and CMS

- **[GitHub Pages](https://pages.github.com/):** Static site hosting.
- **[Contentful](https://www.contentful.com/):** Headless CMS for managing
  content.

---

## Getting Started

### Quick Setup

To get started with local development, ensure you have the necessary tools
installed:

1. Install dependencies:

    ```bash
    bun install
    ```

2. Start the development server:

    ```bash
    bun run dev --open
    ```

3. Run the code watcher:
    ```bash
    bun run watch
    ```

---

### Environment Variables

To fetch live content from Contentful, set up a `.env` file in the project root
with these variables:

```
CONTENTFUL_SPACE_ID=<Your Contentful Space ID>
CONTENTFUL_ACCESS_TOKEN=<Your Contentful Access Token>
PUBLIC_ENVIRONMENT=development
```

> ⚠️ **Note**: While environment variables are optional for local development
> (due to pre-generated content in the repository), they are required for
> fetching new content.

---

### Scripts Overview

Here’s a list of useful scripts:

- **Development**: Start the local server.

    ```bash
    bun run dev
    ```

- **Build**: Generate a production build.

    ```bash
    bun run build
    ```

- **Check Code Quality**: Lint and check code.

    ```bash
    bun run check
    ```

- **Fetch Content**: Retrieve updated content from Contentful.

    ```bash
    bun run util:content
    ```

- **Clean**: Clear cache and reinstall dependencies.
    ```bash
    bun run util:clean
    ```

---

## Development Principles

This project follows the **Pragmatics** philosophy for sustainable development:

1. **Low Effort, High Impact**: Focus on delivering features with the greatest
   value and least complexity.
2. **Simplicity First**: Keep the platform intuitive for both developers and
   users.
3. **Performance and Accessibility**: Prioritize perceived performance and aim
   for WCAG AA compliance.
4. **Scalability**: Ensure the system can grow with future needs, including
   internationalization.
5. **Web Standards Preference**: Use modern HTML/CSS features and minimize
   JavaScript usage.
6. **Continuous Documentation**: Use semantic versioning and automate changelogs
   to streamline documentation.

---

## Content Workflow

Mikrouli's website uses Contentful as a headless CMS. The workflow is:

1. **Fetch Content**: Use `fetchContent.js` to retrieve structured data from
   Contentful.
2. **Transform Content**: Convert raw Contentful data into a JSON format
   suitable for rendering.
3. **Render Pages**: The site dynamically builds pages based on transformed
   content.

---

## CI/CD Workflow

This project uses GitHub Actions for CI/CD:

1. **Build**:

    - Runs on `main` branch pushes or pull requests.
    - Lints, type-checks, and builds the project.
    - Fetches content from Contentful (skipped for pull requests).

2. **Deploy**:
    - Publishes the site to GitHub Pages.

> **Secrets**: CI relies on `CONTENTFUL_SPACE_ID` and `CONTENTFUL_ACCESS_TOKEN`
> stored securely in GitHub.

---

## Project Structure

Here’s an overview of the project structure:

```
src/
├── lib/
│   ├── components/  # Svelte components (e.g., Header.svelte)
│   ├── data/        # Contentful data (e.g., pages.json)
│   ├── server/      # Contentful fetch and transform logic
│   └── styles/      # Tailwind CSS styles
├── routes/          # SvelteKit routes (e.g., about/+page.svelte)
└── static/          # Static assets (e.g., favicon.svg)
```

---

## Troubleshooting

| **Issue**                     | **Solution**                                        |
| ----------------------------- | --------------------------------------------------- |
| Dependency installation fails | Verify Node.js/Bun versions meet requirements.      |
| Environment variable errors   | Ensure `.env` contains the correct Contentful keys. |
| Contentful fetch errors       | Confirm API keys and network connectivity.          |
| Build or dev server errors    | Run the clean script: `bun run util:clean`.         |

---

## Documentation

Additional documentation is located in the `docs/` directory:

- [Brand Guide](docs/brand-guide.md): Guidelines for maintaining Mikrouli’s
  brand.
- [Headless CMS Integration](docs/headless-integration.md): Guide to integrating
  Contentful.

---

> Mikrouli's development platform is powered by **Pragmatics**, ensuring a
> sustainable, modern, and developer-friendly foundation for building systemic
> change.
