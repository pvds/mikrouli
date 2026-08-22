# omit-needless-words

`omit-needless-words` is an Agent Skill for tightening copy without changing meaning or removing
required detail.

Use it for copy-editing tasks such as reducing happy talk, tightening UI text, simplifying
instructions, and improving scannability.

## Install

For a Copilot project skill, place this folder at:

```text
.github/skills/omit-needless-words/
```

Expected structure:

```text
.github/skills/omit-needless-words/
  SKILL.md
  README.md
  examples/
  references/
  evals/
```

## Use

Example prompts:

```text
Omit needless words in this README, but keep the warning and exact command.
Tighten this onboarding text and remove happy talk.
Rewrite this UI copy with strong intensity.
Make this procedure easier to scan without losing required detail.
```

## Intensity levels

- **light**: remove obvious filler while keeping structure mostly intact.
- **balanced**: moderate rewriting and compression.
- **strong**: maximal safe compression for scannability.

Selection defaults are defined in `references/intensity-levels.md`:

- emotionally sensitive copy defaults to **light** when unspecified;
- all other content defaults to **balanced** when unspecified.

## Boundaries

✅ Good use cases:

- tightening verbose READMEs and onboarding docs
- removing repeated instructions or meta-text
- improving scannability of technical documentation
- condensing UI text and form labels
- copy-editing blog posts or announcements

⚠️ Requires human review after editing:

- legal notices, privacy policies, compliance language
- destructive-action UX (deletions, migrations, data loss)
- emotionally sensitive or therapeutic communication
- high-stakes safety or security instructions

❌ Not for this skill:

- summarization (use a summarization skill instead)
- translation
- tone shifts without content shortening
- brainstorming or writing new copy from scratch
- removing required content to meet page-length constraints

## Troubleshooting

**Output is weak or barely changed:** the skill defaulted to light for sensitive content or balanced
for other content. Explicitly request strong intensity for aggressive compression. See
`references/intensity-levels.md`.

**Required content was removed:** check whether the removed content is in the "Always preserve" list
in `references/preservation-rules.md`. If so, this is a skill bug; report it with input and expected
vs. actual output.

**Output feels too cold for sensitive content:** the skill should default to light automatically. If
it did not, manually request light intensity. See `examples/sensitive-copy.md`.

**Output is cryptic:** balanced intensity is safer than strong for most content. Switch to balanced
and compare. See the gotchas section in `SKILL.md`.

## Benchmarking

Use `evals/evals.json` to compare before and after behavior when you update the skill. Run the same
prompts with the previous version and the updated version, then verify the behavior.

Use `evals/trigger-queries.json` to check whether the skill activates for the right requests.
