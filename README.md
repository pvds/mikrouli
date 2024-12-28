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
- [**GitHub Pages**](https://pages.github.com/): Hosting
- [**Contentful**](https://www.contentful.com/): Headless CMS

### TODO

- [ ] Setup page layouts
- 

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
