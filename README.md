# Mikrouli

Static SvelteKit site for a systemic therapy practice. Content is sourced from Contentful and transformed into generated JSON before build.

## Setup

- Requirements: Bun `^1.4`; Node `22+` is optional but useful for local tooling.
- Install dependencies: `bun install`
- Prepare the workspace: `bun run setup`
- Start development: `bun run start`
- Refresh CMS and generated assets: `bun run content`

## Common commands

| Task | Command |
|------|---------|
| Start dev server | `bun run start` |
| Build staging | `bun run build` |
| Build production | `bun run build:prod` |
| Preview staging | `bun run preview` |
| Preview production | `bun run preview:prod` |
| Production HTML validation | `bun run test:html` |
| Accessibility test | `bun run test:axe --minimal --prod` |
| Lighthouse test | `bun run test:lighthouse --prod` |
| Format check | `bun run check:format` |
| Lint + type-check | `bun run check:lint` |
| CI check | `bun run check:ci` |
| Auto-fix formatting | `bun run write` |
| Refresh generated content and assets | `bun run content` |

## Project structure

- `.github/` — CI and action config
- `docs/` — project documentation
- `scripts/` — workspace, asset, and content generation scripts
- `src/routes/` — SvelteKit routes
- `src/lib/` — components, helpers, and server logic
- `src/data/generated/**` — generated content; do not edit by hand
- `static/` — static assets copied to build

## Docs

- `docs/workflow.md` — CI and deploy flow
- `docs/brand.md` — summary of brand identity and positioning
- `docs/copy.md` — detailed writing rules and examples
- `docs/voice-profile.md` — generated voice model for tone and structure
- `CONTRIBUTING.md` — contributor workflow and checks
- `.github/instructions/` — scoped repo instructions for agents

## Notes

- Keep the static SSG / `adapter-static` architecture intact.
- Treat `.agents/skills/**` as read-only dependency files.
- Do not commit changes.
