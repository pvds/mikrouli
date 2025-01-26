# CI/CD Workflow for Mikrouli

This repository uses a GitHub Actions-based CI/CD pipeline to automate builds,
testing, and deployments for both staging (GitHub Pages) and production
(Netlify). The pipeline is designed to be efficient, flexible, and aligned with
the project's goals.

---

## Triggers

The conditions for running staging or production deployments depend on the type
of event triggering the workflow.

| **Trigger**                | **Deploy to Staging** | **Deploy to Production** | **Reasoning**                               |
| -------------------------- | --------------------- | ------------------------ | ------------------------------------------- |
| **Push to `main`**         | ✅ Yes                | ❌ No                    | Test changes in staging before production.  |
| **Pull Request to `main`** | ❌ No                 | ❌ No                    | Manual control over staging and production. |
| **Contentful Change**      | ❌ No                 | ✅ Yes                   | Keep production updated automatically.      |
| **Manual Deploy**          | 🔶 Optional           | 🔶 Optional              | Manual control over staging and production. |

### File and Path Exclusions

The pipeline uses `paths-ignore` to avoid triggering workflows for irrelevant
changes, such as:

- Documentation: `docs/**`, `*.md`
- Editor and tool configurations: `.editorconfig`, `.npmrc`, `biome.jsonc`
- Example and metadata files: `.env.example`, `favicons.json`

### Staging Deployment

The staging deployment to GitHub Pages is triggered by:

- Pushes to `main`
- Pull requests targeting `main`
- Manual dispatch with `deploy_staging` set to `true`

### Production Deployment

The production deployment to Netlify is triggered by:

- Contentful `repository_dispatch` events
- Manual dispatch with `deploy_production` set to `true`

---

## Configuration

The workflow is defined in `.github/ci.yml` with the following key jobs:

1. **`main`**: Builds the project, runs checks, and prepares artifacts for
   deployment.
2. **`staging`**: Deploys to GitHub Pages for staging (conditional on changes
   that affect staging).
3. **`production`**: Deploys to Netlify for production (conditional on triggers
   like Contentful updates).

### Key Features:

- **Concurrency Control**: Ensures that only the latest workflow for a given
  branch, PR, or trigger is active, canceling in-progress redundant workflows.
- **Selective Triggering**: Workflows only run for relevant changes based on
  file paths, reducing unnecessary executions.
- **Dynamic Deployments**: Supports manual deployment options for fine-grained
  control via `workflow_dispatch`.

---

## Artifact Management

### Staging Artifacts

- The project is built using `bun run build` for staging.
- Artifacts are uploaded as a GitHub Pages artifact using
  `actions/upload-pages-artifact@v3`.
- These artifacts are deployed to GitHub Pages, accessible via the URL provided
  by `steps.deployment.outputs.page_url`.

### Production Artifacts

- The project is built using `bun run build:production` for production.
- Artifacts are uploaded as a Netlify artifact using
  `actions/upload-artifact@v4`.
- These artifacts are deployed to Netlify at the custom domain
  [https://mikrouli.nl](https://mikrouli.nl).

---

## Testing Flow

The pipeline includes accessibility and Lighthouse performance tests for
production deployments:

- **Accessibility Tests**:
    - Run using `bun run test:axe --minimal --prod`.
    - Tests are non-blocking (continue-on-error) and help identify accessibility
      issues.
- **Lighthouse Tests**:
    - Run using `bun run test:lighthouse --prod`.
    - Lighthouse evaluates key performance metrics.

Currently, test results are not stored as artifacts or exposed in the pipeline.
Enhancements can include saving these reports to artifacts for later review.

---

## Environment Variables and Secrets

Several secrets and environment variables are required for the pipeline to
function:

- **Secrets**:
    - `CONTENTFUL_SPACE_ID`: Used for fetching content from Contentful.
    - `CONTENTFUL_ACCESS_TOKEN`: API token for Contentful.
    - `NETLIFY_AUTH_TOKEN`: Authentication token for deploying to Netlify.
    - `NETLIFY_SITE_ID`: Identifier for the Netlify site.
- **Environment Variables**:
    - `BUN_VERSION`: Specifies the version of Bun to use.
    - `BUILD_DIR_STAGING`: Directory for staging build artifacts.
    - `BUILD_DIR_PRODUCTION`: Directory for production build artifacts.

Ensure all secrets are configured in the repository settings before running the
pipeline.

## Composite Actions

The pipeline uses composite actions for modular and reusable logic:

1. **[Setup Environment](.github/actions/setup/action.yml)**:
    - Sets up Bun and installs dependencies.
2. **[Build and Upload Artifacts](.github/actions/build/action.yml)**:
    - Builds the project for staging and/or production and uploads artifacts.
3. **[Run Tests](.github/actions/test/action.yml)**:
    - Runs Playwright accessibility tests and Lighthouse performance tests.
