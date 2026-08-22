# Preservation rules

Do not remove or weaken information that affects safety, legality, access, data, user trust, or
decisions.

## Always preserve

Preserve:

- warnings;
- exceptions;
- prerequisites;
- eligibility rules;
- legal, safety, privacy, or compliance information;
- accessibility information;
- data-loss risks;
- security implications;
- exact product names;
- commands;
- paths;
- API names;
- code;
- configuration values;
- version numbers;
- distinctions that affect user decisions;
- examples that prevent mistakes.

## Simplify instead of deleting

If required information is long, simplify it instead of deleting it.

Example:

```text
Before: It is important that you make sure you have administrator privileges before you begin, as some of the steps may require elevated access to complete successfully.
After: Administrator privileges required.
```

## Treat these as high-risk

These categories are high-risk for compression and need extra care:

- legal notices;
- privacy notices;
- safety instructions;
- medical or therapeutic copy;
- financial decisions;
- deletion or migration steps;
- authentication, security, or access-control instructions;
- content for children or vulnerable users.

For intensity defaults, use [intensity levels](intensity-levels.md).

## Disclose compression risks

If compression may affect nuance, add a note:

```markdown
## Risks or assumptions

- Strong intensity compressed explanatory context; verify this still fits the audience.
```
