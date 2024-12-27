# Mikrouli website

> Platform for systemic change.

<!-- TOC -->
* [Mikrouli website](#mikrouli-website)
  * [Features](#features)
    * [TODO](#todo)
  * [Getting started](#getting-started)
    * [Develop](#develop)
    * [Build](#build)
<!-- TOC -->

## Features

- [**Svelte**](https://svelte.dev/): Frontend framework
- [**Tailwind CSS**](https://tailwindcss.com/): Utility-first CSS framework
- [**Bun**](https://bun.sh/): Package manager
- [**Vite**](https://vitejs.dev/): Build tool
- [**Vitest**](https://vitest.dev/): Testing framework
- [**Playwright**](https://playwright.dev/): End-to-end testing
- [**Biome**](https://biomejs.dev/): Linting and formatting
- [**GitHub**](https://github.com]): Version control & CI/CD
- [**Netlify**](https://netlify.com): Hosting

### TODO

- [ ] Configure GitHub CI/CD pipeline
- [ ] Configure Hosting
    - [Github Pages](https://pages.github.com/)
    - [Netlify](https://www.netlify.com/)
    - [Vercel](https://vercel.com/)
- [ ] Connect to a CMS checkout:
    - [Contentful](https://www.contentful.com/)
    - [Prismic](https://prismic.io/)
	- [Strapi](https://www.strapi.io)
    - [Sanity](https://www.sanity.io/)

## Getting started

Ensure you have [Bun installed](https://bun.sh/docs/installation) first, then
run `bun install` to install dependencies.

### Develop

```bash
bun run dev

# or start the server and open the app in a new browser tab
bun run dev -- --open
```

### Build

To create a production version of your app:

```bash
bun run build
```

You can preview the production build with `bun run preview`.

> To deploy your app, you may need to install an
> [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.
