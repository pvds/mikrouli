---
applyTo: "src/**/*.{svelte,svelte.ts,ts,js}"
---

# Svelte conventions

- Use Svelte 5 patterns as the default; prefer the simplest state model that fits the component.
- Keep component props explicit with local `interface Props` blocks and use camelCase for variables, functions, and props.
- Keep page logic in `src/routes/**`, reusable UI in `src/lib/components/**`, and server/data work in `src/lib/server/**`.
- Use `$app/paths` `resolve()` for internal links and route URLs.
- Keep generated data in `src/data/generated/**` read-only; regenerate it instead of hand-editing it.
- Prefer small, reusable components over page-specific logic; do not refactor unrelated code in the same patch.
- Use Tailwind utility classes for styling; prefer CSS variables for tokenized values and avoid `@apply` and dynamic class composition.
- Preserve semantic HTML and accessibility: labels, `aria-*`, landmark structure, keyboard support, and explicit button types when required.
- Keep SSG/SSR behavior aligned with static content: prefer server-rendered/static output and avoid unnecessary client-side complexity.
- Use the repo’s existing SEO/meta conventions from `src/lib/components/global/seo/Seo.svelte`.
