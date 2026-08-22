# Instruction handling

Treat instructions as a usability smell.

The best copy often removes instructions by making the label, heading, structure, or interface
self-explanatory.

## Order of preference

Use this order:

1. Make the label, heading, or structure self-explanatory.
2. Replace long instructions with a short action phrase.
3. Keep instructions only when users genuinely need them.
4. Put instructions exactly where they are needed.
5. Remove instructions that explain obvious UI mechanics.

## Examples

```text
Before: Click the button below to submit your application.
After: Submit application
```

```text
Before: Please enter your email address in the field below.
After: Email address
```

```text
Before: You have entered an incorrect password.
After: Wrong password
```

```text
Before: To continue to the next step, click Next.
After: Next
```

## Keep instructions when they prevent mistakes

Keep instructions when they explain:

- irreversible actions;
- required format;
- unusual behavior;
- timing;
- limits;
- consequences;
- prerequisites;
- safety or security risks.

Example:

```text
Before: Please type DELETE in the field below to confirm that you want to permanently delete this workspace.
After: Type DELETE to permanently delete this workspace.
```
