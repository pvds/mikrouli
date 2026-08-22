# Agent Instructions

## Package Manager

- Use **Bun**: `bun install`
- Run repo scripts with `bun run <script>`
- Runtime target: Bun `^1.4`

## Commands

| Task                 | Command                             |
| -------------------- | ----------------------------------- |
| Setup workspace      | `bun run setup`                     |
| Sync Svelte types    | `bun run sync`                      |
| Lint + type-check    | `bun run check:lint`                |
| Format check         | `bun run check:format`              |
| Write format fixes   | `bun run write`                     |
| Full local check     | `bun run check`                     |
| CI checks            | `bun run check:ci`                  |
| Build (staging)      | `bun run build`                     |
| Build (production)   | `bun run build:prod`                |
| Accessibility test   | `bun run test:axe --minimal --prod` |
| Lighthouse test      | `bun run test:lighthouse --prod`    |
| Refresh CMS + assets | `bun run content`                   |

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

- `src/data/generated/**` is generated output; refresh with `bun run content`,
  do not edit by hand.
- `docs/**` and `*.md` are intentionally ignored by CI triggers; doc-only
  changes are low-risk.
- Keep the static SSG / `adapter-static` architecture, GitHub Pages staging, and
  Netlify production layout intact.
- Treat `.agents/skills/**` as read-only external dependencies.
- Do not commit changes.
