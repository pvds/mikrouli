# Using JSDoc for Type Safety in JavaScript

Below is an updated guide that expands on import usage and includes advanced
tips and best practices discovered from various online resources and official
documentation.

---

## 1. Why JSDoc?

JSDoc provides inline documentation and lightweight type annotations for
JavaScript code. When combined with TypeScript’s `--checkJs` (or a
`tsconfig.json` with `"checkJs": true`), it can offer a decent type-checking
experience without migrating to full TypeScript.

---

## 2. JSDoc Import Basics

### 2.1 Importing Types from a Module

Often, you’ll want to reference types from external libraries. The core pattern
uses `@typedef {import('module').Type} LocalName`, for example:

```js
/**
 * @typedef {import('svelte').Snippet} SvelteSnippet
 */
```

Then you can use `SvelteSnippet` as a type in the same file:

```js
/** @type {SvelteSnippet} */
let snippet = someSvelteCode();
```

### 2.2 Importing Multiple Types

If you want to import multiple types from the same module, you can define
multiple typedef lines:

```js
/**
 * @typedef {import('my-lib').TypeA} TypeA
 * @typedef {import('my-lib').TypeB} TypeB
 */
```

Alternatively, you can combine them:

```js
/**
 * @typedef {Object} MyTypes
 * @property {import('my-lib').TypeA} A
 * @property {import('my-lib').TypeB} B
 */
```

### 2.3 Referencing Default Exports vs. Named Exports

Occasionally, you’ll need to import a default export’s type. For example, say
`my-lib` has a default export class:

```js
/**
 * @typedef {import('my-lib').default} MyDefaultClass
 */
```

Then you can use `MyDefaultClass` as a type for variables, function parameters,
etc.

### 2.4 Namespaced Imports

Some libraries export a namespace or multiple subpaths. For instance:

```js
/**
 * @typedef {import('firebase').default} FirebaseNamespace
 * @typedef {import('firebase').auth.Auth} FirebaseAuth
 */
```

---

## 3. Advanced JSDoc Syntax & Usage

Below are some more advanced patterns you can incorporate, based on best
practices gleaned from community articles and official references.

### 3.1 Defining Complex Object Shapes

JSDoc allows you to define deeply nested object shapes:

```js
/**
 * @typedef {Object} Project
 * @property {string} id
 * @property {string} name
 * @property {Object} meta
 * @property {string} meta.owner
 * @property {number} [meta.stars]
 */
```

### 3.2 Function Expressions and Arrow Functions

For arrow functions, you can attach types using `@type`:

```js
/**
 * @type {(name: string) => string}
 */
const greet = (name) => `Hello, \${name}`;
```

This ensures editors know that `greet` is a function that expects a string and
returns a string.

### 3.3 Multiple Type Parameters (Generics)

You can specify multiple templates:

```js
/**
 * @template T,U
 * @param {T} a
 * @param {U} b
 * @returns {[T, U]}
 */
function pair(a, b) {
	return [a, b];
}
```

### 3.4 Overloads with `@overload`

While not as concise as TypeScript, you can approximate function overloads:

```js
/**
 * @overload
 * @param {string} value
 * @returns {string}
 */
/**
 * @overload
 * @param {number} value
 * @returns {number}
 */
/**
 * @param {string|number} value
 * @returns {string|number}
 */
function echo(value) {
	return value;
}
```

### 3.5 Extending/Implementing Classes

````js
/**
* @class
* @extends {Array<string>}
  */
  class StringArray extends Array {
  /**
	* @returns {number}
	  */
	  get lengthSquared() {
	  return this.length * this.length;
	  }
	  }
	  ```

### 3.6 Destructuring Parameters

You can provide JSDoc for destructured objects:

```js
/**
* @param {{ name: string, age?: number }} user
  */
  function printUserInfo({ name, age }) {
  console.log(`User: \${name}, Age: \${age}`);
  }
````

---

## 4. Best Practices

### 4.1 Maintain a `tsconfig.json` or `jsconfig.json`

- **Enable `"checkJs": true`**  
  This allows TypeScript’s checker to parse and validate your JSDoc in `.js`
  files.
- **`"allowJs": true`** (often needed)  
  Tells TypeScript to process JavaScript files.

Example partial `tsconfig.json`:

```json
{
	"compilerOptions": {
		"allowJs": true,
		"checkJs": true,
		"strict": true,
		"skipLibCheck": true
	},
	"include": ["src/**/*"],
	"exclude": ["node_modules", "**/dist/**"]
}
```

### 4.2 Keep JSDoc Up-to-Date

- **Sync Doc with Code**: If function parameters change, update your JSDoc
  comments immediately.
- **Remove Inaccurate Tags**: Old or misleading tags can cause confusion and
  type-checking errors.

### 4.3 Use ESLint Plugins

- **`eslint-plugin-jsdoc`**  
  Enforces consistency and correctness of JSDoc comments.

### 4.4 Document at the Right Level

- **Function/Method-Level Comments**: Provide `@param` and `@returns` for all
  public APIs.
- **Module/File-Level Comments**: Consider using `@file` or `@module` tags to
  describe the file’s purpose.
- **Class Comments**: Use `@class`, `@extends`, `@implements` for clarity on
  inheritance or interface-like usage.

### 4.5 Consistency in Typedef Naming

- **Use PascalCase for Type Definitions**: e.g.,
  `@typedef {Object} UserAccount`.
- **Use Meaningful Names**: e.g.,
  `@typedef {import('svelte').Snippet} SvelteSnippet` should be named to reflect
  its usage.

---

## 5. More Advanced Tips (from Online Examples)

1. **Combining JSDoc With `.d.ts`**  
   You can supplement your JSDoc with additional `.d.ts` files if you need
   advanced TypeScript features that JSDoc can’t cover (e.g., advanced mapped
   types, third-party type augmentations, or global scoping).

2. **Re-Exporting Types**  
   Some projects create a dedicated `types.js` or `globals.js` file with all
   `@typedef` imports, then reference them throughout the codebase. For
   instance:

    ```js
    // types.js
    /**
     * @typedef {import('some-lib').SomeType} SomeType
     */
    export {};
    ```

    Then in other files:

    ```js
    /** @type {import('./types').SomeType} */
    let thing;
    ```

3. **Svelte-Specific Patterns**

    - Svelte’s `<script>` tags can be in TypeScript mode, but if you prefer
      JSDoc:

        ```html
        <script>
        	/**
        	 * @typedef {Object} MyProps
        	 * @property {string} message
        	 */

        	/** @type {MyProps} */
        	export let props;
        </script>
        ```

    - For advanced usage, check
      [SvelteKit’s type docs](https://kit.svelte.dev/docs/types) which often
      show JSDoc-based examples.

---

## 6. Putting It All Together (Example)

/\*\* @file

- Demonstrates advanced JSDoc usage with imports, destructuring, generics,
- and best practices. \*/

/\*\*

- @typedef {import('svelte').Snippet} SvelteSnippet
- @typedef {import('./myTypes').MyComplexType} MyComplexType \*/

/\*\*

- @template T
- @param {T[]} items - list of items of generic type T
- @returns {T} \*/ function first(items) { return items[0]; }

/\*\*

- @typedef {Object} Props
- @property {string} classes - CSS classes
- @property {SvelteSnippet} [children] - optional snippet from Svelte
- @property {MyComplexType} extra - a custom type from a local definition \*/

/\*_ @type {Props} _/ let props = { classes: 'my-class', children: /_ some
snippet _/, extra: { id: 'xyz', description: 'A custom advanced type usage', },
};

// Destructure props const { classes, children, extra } = props;

/\*\*

- @param {Props} inputProps
- @returns {void} \*/ function processProps(inputProps) {
  console.log(`Classes: \${inputProps.classes}`); if (inputProps.children) {
  console.log('Has snippet', inputProps.children); } console.log(`Extra: `,
  inputProps.extra); }

---

## 7. Additional Resources

- **JSDoc Official**  
  [https://jsdoc.app](https://jsdoc.app)

- **TypeScript JSDoc Reference**  
  [https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html](https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html)

- **Svelte Documentation**  
  [https://svelte.dev/docs](https://svelte.dev/docs)  
  (Check for articles on JSDoc usage and type checking.)

- **ESLint Plugin JSDoc**  
  [https://github.com/gajus/eslint-plugin-jsdoc](https://github.com/gajus/eslint-plugin-jsdoc)

---

## Conclusion

Using JSDoc in tandem with TypeScript’s `--checkJs` mode can provide excellent
type insights and editor support with minimal overhead. The key points are:

1. **Import external types** with `@typedef {import('some-lib').Something}`.
2. **Leverage advanced features** like generics, overloads, and destructuring in
   JSDoc.
3. **Use a proper config** (`tsconfig.json` or `jsconfig.json`) with
   `"checkJs": true`.
4. **Stay consistent and up-to-date** with your comments to ensure accuracy.

**Happy coding!**

---

## JSDoc Resources: Usage, Cheat Sheets, and Best Practices

A concise collection of resources for JSDoc usage, syntax, and best practices.

### Official Documentation

- [JSDoc Official Site](https://jsdoc.app) – Comprehensive reference for all
  JSDoc tags and usage.
- [TypeScript JSDoc Support](https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html)
  – How JSDoc integrates with TypeScript for type checking.

### Cheat Sheets & References

- [JSDoc Syntax Cheat Sheet (GitHub)](https://github.com/shri/JSDoc-Style-Guide)
  – A guide to JSDoc syntax and style.
- [JSDoc Tag Reference](https://devhints.io/jsdoc) – Quick reference for JSDoc
  tags.
- [VS Code JSDoc Guide](https://code.visualstudio.com/docs/nodejs/working-with-javascript#_intellisense-and-jsdoc)
  – Using JSDoc to enhance IntelliSense.

### Guides & Tutorials

- [Using JSDoc in JavaScript (LogRocket)](https://blog.logrocket.com/using-jsdoc-javascript/)
  – Beginner-friendly guide.
- [JSDoc Type Checking in VS Code](https://mariusschulz.com/blog/jsdoc-type-checking-in-vs-code)
  – Enabling `--checkJs` for type safety.
- [Documenting JavaScript with JSDoc (DigitalOcean)](https://www.digitalocean.com/community/tutorials/documenting-javascript-with-jsdoc)
  – Practical examples of JSDoc usage.

### Advanced Patterns

- [Advanced JSDoc for TypeScript Users](https://fettblog.eu/typescript-jsdoc-superpowers/)
  – Explores advanced JSDoc features and TypeScript integration.
- [Svelte JSDoc Guide](https://kit.svelte.dev/docs/types#using-jsdoc) – JSDoc
  usage in Svelte projects.
- [JSDoc Generics & Advanced Types](https://dmitripavlutin.com/jsdoc-types/) –
  Detailed explanations of generics and templates.

### Tools & Plugins

- [Documentation Generator](https://documentation.js.org/) – Generate HTML docs
  from JSDoc comments.
- [eslint-plugin-jsdoc](https://github.com/gajus/eslint-plugin-jsdoc) – Lint
  JSDoc comments for correctness and consistency.
- [ts-migrate](https://github.com/airbnb/ts-migrate) – Automate JSDoc to
  TypeScript migrations.

### Communities & Forums

- [Stack Overflow JSDoc Tag](https://stackoverflow.com/questions/tagged/jsdoc) –
  Questions and discussions on JSDoc.
- [Reddit r/JavaScript](https://www.reddit.com/r/javascript/) – Community
  discussions on JavaScript tools like JSDoc.

### Stay Updated

- [JSDoc GitHub](https://github.com/jsdoc/jsdoc) – Follow for updates.
- [TypeScript Blog](https://devblogs.microsoft.com/typescript/) – News on JSDoc
  and TypeScript.
- [Dev.to JSDoc Posts](https://dev.to/t/jsdoc) – Community articles and guides.
