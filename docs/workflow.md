# CI/CD workflow

The repo uses GitHub Actions to build, validate, and deploy the site to GitHub Pages and Netlify.

## Triggers

| Trigger | Staging | Production | Notes |
|---------|---------|------------|-------|
| Push to `main` | Yes | No | Runs staging validation and deploy flow. |
| Pull request to `main` | No | No | Build and checks run, but deployment is skipped. |
| `repository_dispatch` (`ContentUpdate`) | No | Yes | Runs when Contentful content updates land. |
| Manual dispatch | Optional | Optional | Can deploy either target manually. |

The workflow ignores docs-only changes and generated-content changes via `paths-ignore` in `.github/workflows/ci.yml`.

## Main flow

The `main` job in `.github/workflows/ci.yml` does this:

1. Checks out the repo and installs Bun dependencies.
2. Runs `bun run check:ci` when this is not a content update.
3. Runs `bun run content` to refresh CMS-derived data.
4. Builds staging and/or production artifacts.
5. Runs the production validation tests via `.github/actions/test`.

## Deployments

### Staging

- Triggered from `main` pushes and optional manual runs.
- Deploys to GitHub Pages.

### Production

- Triggered by Contentful `repository_dispatch` events or manual runs.
- Deploys to Netlify at `https://mikrouli.org`.

## Validation in CI

Production builds run these before browser-level checks:

- `bun run test:html`
- `bun run test:axe --minimal --prod`
- `bun run test:lighthouse --prod`

## Required config

Secrets and environment values are defined in the repository settings:

- `CONTENTFUL_SPACE_ID`
- `CONTENTFUL_ACCESS_TOKEN`
- `NETLIFY_AUTH_TOKEN`
- `NETLIFY_SITE_ID`
- `BUN_VERSION`
- `BUILD_DIR_STAGING`
- `BUILD_DIR_PRODUCTION`

## Action references

- `.github/actions/setup/action.yml` — Bun setup and dependency install
- `.github/actions/build/action.yml` — build and artifact upload
- `.github/actions/test/action.yml` — HTML, accessibility, and Lighthouse checks
