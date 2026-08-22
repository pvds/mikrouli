# Agent Instructions

## Package Manager

- Install dependencies with **bun**: `bun install`
- Run project scripts with **bun**: `bun run <script>`
- Runtime targets: Bun `^1.4`

## Commands

| Task                         | Command                             |
| ---------------------------- | ----------------------------------- |
| Setup workspace              | `bun run setup`                     |
| Sync Svelte/types            | `bun run sync`                      |
| Lint + type-check            | `bun run check:lint`                |
| CI checks                    | `bun run check:ci`                  |
| Format check                 | `bun run check:format`              |
| Format write                 | `bun run write`                     |
| Build (staging)              | `bun run build`                     |
| Build (production)           | `bun run build:prod`                |
| Accessibility test           | `bun run test:axe --minimal --prod` |
| Lighthouse test              | `bun run test:lighthouse --prod`    |
| Refresh CMS content + assets | `bun run content`                   |

## External References

| Need                           | File                                                   |
| ------------------------------ | ------------------------------------------------------ |
| Project setup + scripts        | `README.md`                                            |
| CI/CD behavior                 | `docs/workflow.md`                                     |
| Brand and tone guidance        | `docs/brand-guide.md`                                  |
| Voice profile                  | `docs/voice-profile.md`                                |
| JSDoc patterns                 | `docs/jsdoc.md`                                        |
| CI workflow source             | `.github/workflows/ci.yml`                             |
| Read-only external skill files | `.github/instructions/external-skills.instructions.md` |

## Key Conventions

- `src/data/generated/**` is generated content output; update via
  `bun run content` instead of hand editing.
- `docs/**` and `*.md` changes are excluded from CI triggers in
  `.github/workflows/ci.yml`.
- Treat `.agents/skills/**` as read-only external dependencies.

## Commits

You are never allowed to commit
