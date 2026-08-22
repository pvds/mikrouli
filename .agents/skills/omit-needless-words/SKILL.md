---
name: omit-needless-words
description: |
  Edit web copy, product copy, documentation, UI text, onboarding text, README files, and
  instructions to remove needless words in the Steve Krug / Don't Make Me Think sense. Use when
  the user asks to omit needless words, remove happy talk, reduce unnecessary instructions,
  shorten copy, improve scannability, tighten wording, or make content more task-focused while
  preserving meaning, accuracy, warnings, constraints, and required detail. Do not use for
  summarization, translation, tone-only rewriting, creative writing, or reducing legal/safety
  critical content unless the user explicitly asks for concise copy-editing.
---

# Omit needless words

Edit content to remove needless words without changing meaning or removing required detail.

## Purpose

Edit content so every word helps the reader understand, decide, act, or recover.

This is a copy-editing skill, not a summarization skill. Preserve the original intent, facts,
structure, and required detail unless the user explicitly asks for a deeper rewrite.

## When to use this skill

Use this skill when the user asks to:

- omit needless words;
- remove happy talk;
- shorten copy without changing meaning;
- make documentation, UI text, onboarding text, or README content more scannable;
- reduce unnecessary instructions;
- tighten web or product copy;
- make task-focused documentation easier to act on.

Do not use this skill when the user asks only to:

- summarize;
- translate;
- change tone without shortening;
- brainstorm copy options;
- write new content from scratch;
- remove required legal, safety, privacy, compliance, or data-loss information.

## Required inputs

Identify:

- the content to edit;
- the likely reader task;
- the requested intensity, if any;
- any warnings, prerequisites, constraints, commands, paths, product names, or decision-critical
  details.

Select intensity only through [intensity levels](references/intensity-levels.md).

Ask a clarifying question only when the requested compression could remove decision-critical nuance,
required detail, or emotionally important tone.

## Workflow

1. Identify the reader's likely task.
2. Select the intensity level using [intensity levels](references/intensity-levels.md).
3. Mark protected information using [preservation rules](references/preservation-rules.md).
4. Remove or compress needless words using [editing rules](references/editing-rules.md).
5. For instructions, apply [instruction handling](references/instruction-handling.md).
6. Make the result easier to scan.
7. Compare the edited version with the original for meaning, accuracy, and required detail.
8. Return the edited copy using the output format below.

## Output format

For short content, return:

```markdown
## Revised version

[edited content]

## Intensity

- Selected intensity: [light / balanced / strong]
- Reason: [explicit request / defaulted by selection rules]

## Notes

- [Only mention important changes, risks, or assumptions. Omit this section if there are none.]
```

For longer content, return:

```markdown
## Revised version

[edited content]

## Intensity

- Selected intensity: [light / balanced / strong]
- Reason: [explicit request / defaulted by selection rules]

## Reduction

Approximate reduction: [x%]

## Removed or compressed

- [happy talk / repeated instructions / filler / duplication]

## Risks or assumptions

- [Only include if relevant. Disclose if stronger intensity compressed language that carries
  nuance.]
```

## Validation

Before finalizing, verify:

- The reader's task is clearer.
- The main action is easier to find.
- Happy talk and meta text are removed.
- Instructions are reduced, not merely rephrased.
- Required detail is preserved.
- The result is concise but not cryptic.
- Any risky compression is disclosed.

Use [self-check](references/self-check.md) for a fuller checklist when editing longer or higher-risk
content.

## Gotchas

- Do not make the text cryptic just to make it shorter.
- Do not remove warmth from emotionally sensitive, therapeutic, or relationship-focused writing
  unless the user asks for a concise version.
- Do not turn comprehensive technical documentation into a summary.
- Do not remove examples when they prevent user mistakes.
- Do not replace precise terms with shorter but less accurate wording.
- Do not preserve promotional language unless it helps the reader decide.
- Do not weaken warnings, constraints, prerequisites, eligibility rules, or data-loss risks.

## Examples

Use examples only when they help calibrate the edit:

- [Announcement and overview](examples/announcement-overview.md)
- [Prerequisites and safety](examples/prerequisites-safety.md)
- [Error message and verification](examples/error-message-verification.md)
- [UI instructions](examples/ui-instructions.md)
- [Technical documentation](examples/technical-documentation.md)
- [Sensitive or therapeutic copy](examples/sensitive-copy.md)
