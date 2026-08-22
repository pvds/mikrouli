# CI/CD Workflow for Mikrouli

Automated GitHub Actions pipeline for staging (GitHub Pages) and production (Netlify) deployments.

---

## Triggers

| **Trigger**                | **Deploy to Staging** | **Deploy to Production** | **Why**                                    |
| -------------------------- | --------------------- | ------------------------ | ------------------------------------------ |
| **Push to `main`**         | ✅ Yes                | ❌ No                    | Test changes in staging before production. |
| **Pull Request to `main`** | ❌ No                 | ❌ No                    | Manual control required.                   |
| **Contentful Change**      | ❌ No                 | ✅ Yes                   | Auto-update production.                    |
| **Manual Deploy**          | 🔶 Optional           | 🔶 Optional              | Manual control.                            |

### File and Path Exclusions

Workflow uses `paths-ignore` to skip irrelevant changes:

- Documentation: `docs/**`, `*.md`
- Config: `.editorconfig`, `.npmrc`, `biome.jsonc`
- Metadata: `.env.example`, `favicons.json`

### Staging Deployment

Triggered by:
- Pushes to `main`
- Pull requests targeting `main`
- Manual dispatch

### Production Deployment

Triggered by:
- Contentful `repository_dispatch` events
- Manual dispatch

---

## Configuration

Defined in `.github/ci.yml`:

1. **`main`**: Builds project, runs checks, prepares artifacts.
2. **`staging`**: Deploys to GitHub Pages (conditional).
3. **`production`**: Deploys to Netlify (conditional).

**Key Features:**
- **Concurrency Control**: Only latest workflow runs per branch; cancels redundant jobs.
- **Selective Triggering**: Runs only for relevant paths.
- **Dynamic Deployments**: Supports manual control via `workflow_dispatch`.

---

## Artifact Management

### Staging

- Build: `bun run build`
- Upload: GitHub Pages artifact
- Deploy: GitHub Pages

### Production

- Build: `bun run build:prod`
- Upload: Netlify artifact
- Deploy: Netlify at https://mikrouli.org

---

## Testing

Accessibility and Lighthouse tests run for production deployments:

- **Accessibility**: `bun run test:axe --minimal --prod` (non-blocking)
- **Lighthouse**: `bun run test:lighthouse --prod`

Test results are not currently stored. Future enhancement: save reports as artifacts.

---

## Secrets & Environment Variables

Required for the pipeline:

**Secrets:**
- `CONTENTFUL_SPACE_ID`: Contentful space
- `CONTENTFUL_ACCESS_TOKEN`: Contentful API token
- `NETLIFY_AUTH_TOKEN`: Netlify auth
- `NETLIFY_SITE_ID`: Netlify site ID

**Environment Variables:**
- `BUN_VERSION`: Bun version
- `BUILD_DIR_STAGING`: Staging build directory
- `BUILD_DIR_PRODUCTION`: Production build directory

Configure all secrets in repository settings before running.

---

## Composite Actions

**[Setup Environment](.github/actions/setup/action.yml)**: Sets up Bun and installs dependencies.

**[Build and Upload](.github/actions/build/action.yml)**: Builds and uploads artifacts.

**[Run Tests](.github/actions/test/action.yml)**: Runs accessibility and Lighthouse tests.
