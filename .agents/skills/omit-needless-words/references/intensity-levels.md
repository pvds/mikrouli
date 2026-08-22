# Intensity levels

Use exactly one intensity level for each edit: **light**, **balanced**, or **strong**.

## Selection rules

Use this precedence order from top to bottom.

1. **Explicit user request wins**

- If the user explicitly asks for **light**, use light.
- If the user explicitly asks for **balanced**, use balanced.
- If the user explicitly asks for **strong**, use strong.

2. **Default for emotionally sensitive copy when unspecified**

- If no level is specified and the content is emotionally sensitive (for example therapeutic,
  relationship-focused, grief, crisis, or vulnerable-user communication), use **light**.

3. **Default for all other content when unspecified**

- If no level is specified and no higher-priority rule applies, use **balanced**.
- If the user says “shorten”, “make concise”, “tighten”, “improve scannability”, or “omit needless
  words” without naming a level, use **balanced** unless rule 2 applies.

Ask for clarification only when compression could remove important nuance, required detail, or
emotionally important tone.

## How to report selected intensity

Always state the selected intensity in the output.

When the user did not specify a level, include a short reason such as:

- `Defaulted to light for emotionally sensitive copy`
- `Defaulted to balanced (non-sensitive content)`

## Light

Remove obvious filler and happy talk while keeping sentence structure mostly intact.

Use light when:

- the content is emotionally sensitive;
- the user wants minor cleanup;
- the text is already concise;
- the original phrasing must remain recognizable.

Apply:

- delete meta-text such as “this page explains”;
- delete filler such as “please note”, “in order to”, “simply”, “just”;
- remove empty internal perspective such as “we are pleased to announce”;
- trim instructions while preserving explanatory context.

Target reduction: 5–15%.

## Balanced

Combine deletions with moderate rewrites.

Use balanced when:

- the user asks to shorten, tighten, or omit needless words;
- the content should become more task-focused;
- the copy is moderately wordy;
- the user did not specify an intensity and no light-default rule applies.

Apply:

- all light-level deletions;
- restructure sentences for directness;
- compress weak modifiers and hedging;
- replace long instructions with phrases;
- tighten paragraph openings;
- improve headings and scanability.

Target reduction: 15–30%.

## Strong

Use maximal safe compression and restructuring for scannability.

Use strong when:

- the user explicitly asks for strong intensity;
- the content is clearly too long for the user’s task;
- the content is not emotionally sensitive;
- required details are easy to preserve.

Apply:

- all balanced-level rewrites;
- remove non-essential transitions;
- strip to core semantic content;
- compress procedural language;
- use direct imperatives where safe;
- reduce paragraph count when useful.

Target reduction: 30–45%.

## Safety invariant

Every level must preserve:

- meaning;
- facts;
- required context;
- warnings;
- exceptions;
- prerequisites;
- eligibility rules;
- privacy, legal, compliance, security, and safety information;
- data-loss risks;
- decision-critical distinctions;
- examples that prevent mistakes.
