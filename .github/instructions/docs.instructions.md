---
applyTo: "{README.md,docs/**/*.md,*.md}"
---

# Documentation conventions

- Keep docs short, direct, and task-focused; avoid background explanations or generic project philosophy unless it prevents a likely mistake.
- Prefer repo-relative file references and exact commands over vague references like “see docs” or “the app”.
- Update the smallest relevant docs when a behavior or command changes; do not rewrite unrelated documentation in the same patch.
- Keep command examples aligned with the actual repo scripts in `package.json` and `AGENTS.md`.
- Do not create new markdown planning files in the repo; use the session-state plan for temporary working notes.
- Prefer factual, current documentation over copied legacy wording; remove stale claims when they conflict with the current codebase.
- Keep markdown formatting consistent with the repo’s Biome/formatter expectations.
