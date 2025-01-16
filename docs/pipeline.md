# CI/CD Pipeline for Mikrouli

This repository uses a GitHub Actions-based CI/CD pipeline to automate builds, testing, and deployments for both staging (GitHub Pages) and production (Netlify). The pipeline is designed to be efficient, flexible, and aligned with the project's goals.

---

## Pipeline Overview

### Workflow Triggers

| **Trigger**              | **Deploy to GitHub Pages (Staging)** | **Deploy to Netlify (Production)** | **Reasoning**                              |
|--------------------------|-------------------------------------|------------------------------------|--------------------------------------------|
| **Push to `main`**       | ✅ Yes                              | ❌ No                              | Test changes in staging before production. |
| **Pull Request to `main`** | ✅ Yes                              | ❌ No                              | Validate changes on staging.               |
| **Contentful Change**    | ❌ No                               | ✅ Yes                             | Keep production updated automatically.     |
| **Manual Deploy**        | 🔶 Optional                        | 🔶 Optional                        | Fine-grained control over production.      |

---

### Workflow Configuration

The workflow is defined in `.github/ci.yml` with the following key jobs:

1. **`main`**: Builds the project, runs checks, and prepares artifacts for deployment.
2. **`staging`**: Deploys to GitHub Pages for staging (conditional on changes that affect staging).
3. **`production`**: Deploys to Netlify for production (conditional on triggers like Contentful updates).

#### Key Features:
- **Concurrency Control**:
  Ensures that only the latest workflow for a given branch, PR, or trigger is active, canceling in-progress redundant workflows.
- **Selective Triggering**:
  Workflows only run for relevant changes based on file paths, reducing unnecessary executions.
- **Dynamic Deployments**:
  Supports manual deployment options for fine-grained control via `workflow_dispatch`.

---

### Jobs in Detail

#### 1. **Main Job**: `Build and Test`
This job handles the core CI tasks:
- **Setup**: Checks out the code and installs dependencies using the Bun runtime.
- **Check**: Runs code quality checks.
- **Content**: Updates data from Contentful if necessary.
- **Build**: Builds the project for staging and/or production based on trigger conditions.
- **Test**: Executes accessibility and Lighthouse tests (for production deployments only).

#### 2. **Staging Job**: `Deploy to GitHub Pages`
- **Trigger**: Pushes to `main`, pull requests to `main`, or manual dispatch with `deploy_github: true`.
- **Deployment**: Uploads the staging build to GitHub Pages.

#### 3. **Production Job**: `Deploy to Netlify`
- **Trigger**: Contentful changes or manual dispatch with `deploy_netlify: true`.
- **Deployment**: Uploads the production build to Netlify (https://mikrouli.nl).

---

### Composite Actions

The pipeline uses composite actions for modular and reusable logic:

1. **[Setup Environment](.github/actions/setup/action.yml)**:
	- Sets up Bun and installs dependencies.

2. **[Build and Upload Artifacts](.github/actions/build/action.yml)**:
	- Builds the project for staging and/or production and uploads artifacts.

3. **[Run Tests](.github/actions/test/action.yml)**:
	- Runs Playwright accessibility tests and Lighthouse performance tests.

---

### File and Path Exclusions

The pipeline uses `paths-ignore` to avoid triggering workflows for irrelevant changes, such as:

- Documentation: `docs/**`, `*.md`
- Editor and tool configurations: `.editorconfig`, `.npmrc`, `biome.jsonc`
- Example and metadata files: `.env.example`, `favicons.json`
