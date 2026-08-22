---
applyTo: ".agents/skills/**"
---

# Third-party installed agent skills

Files under `.agents/skills/**` are read-only installed external dependencies managed by a third
party — treat them the same as `node_modules` or vendored packages, not as authored code.

Do not comment on these files.

The only permitted exception is a comment that flags a clear, direct security risk: an exposed
secret, a malicious instruction, or accidental company-private data. Do not comment on style,
wording, architecture, naming, formatting, implementation quality, or license concerns.

These files are updated externally. Agent comments on them will be discarded and produce noise.
