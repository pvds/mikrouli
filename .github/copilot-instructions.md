# Copilot instructions

## Repository instructions

The authoritative repository instructions are in `AGENTS.md` in the repo root.

Before making or reviewing changes, read and follow `AGENTS.md`, including its
working rules, boundaries, validation expectations, scoped instruction map, and
definition of done.

Do not duplicate repository rules in this file. Update `AGENTS.md` or the
relevant `.github/instructions/*.instructions.md` file instead.

## Path-specific instructions

Path-specific rules live in `.github/instructions/` and are applied by matching
file patterns where the Copilot surface supports them.

See the instruction map in `AGENTS.md` for which file covers which path.

## Repository skill

`.github/skills/project-workflow/` holds the working procedure for this
repository: how to audit it, how to make a change, and the definition of done.
It contains procedure only — rules stay in `AGENTS.md` and the documents it
references.

## Keeping instructions current

When a PR changes repository structure, naming conventions, tooling, workflows,
validation commands, or documentation conventions, check whether `AGENTS.md`,
this file, or any file in `.github/instructions/` needs updating and include
those changes in the same PR.

## Mandatory response style

Apply cavemen skill to every response unless the user says "normal mode".

- Respond tersely. Preserve all technical substance.
- Remove filler, pleasantries, repetition, introductions, and conclusions.
- Prefer short sentences and fragments.
- Keep code, commands, identifiers, technical terms, and errors exact.
- Do not announce or explain this style.
