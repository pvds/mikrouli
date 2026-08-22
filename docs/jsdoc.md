# Using JSDoc for Type Safety in JavaScript

---

## 1. Why JSDoc?

JSDoc provides lightweight type annotations and inline documentation. Combined with TypeScript's `--checkJs`, it offers type-checking without full TypeScript migration.

---

## 2. JSDoc Import Basics

### 2.1 Importing Types from a Module

Reference types using `@typedef {import('module').Type} LocalName`:

```js
/**
 * @typedef {import('svelte').Snippet} SvelteSnippet
 */
```

Use the type in the file:

```js
/** @type {SvelteSnippet} */
let snippet = someSvelteCode();
```

### 2.2 Importing Multiple Types

Define multiple typedef lines or combine:

```js
/**
 * @typedef {import('my-lib').TypeA} TypeA
 * @typedef {import('my-lib').TypeB} TypeB
 */
```

### 2.3 Default Exports vs. Named Exports

For default exports:

```js
/**
 * @typedef {import('my-lib').default} MyDefaultClass
 */
```

### 2.4 Namespaced Imports

```js
/**
 * @typedef {import('firebase').default} FirebaseNamespace
 * @typedef {import('firebase').auth.Auth} FirebaseAuth
 */
```

---

## 3. Advanced JSDoc Syntax

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

```js
/**
 * @type {(name: string) => string}
 */
const greet = (name) => `Hello, \${name}`;
```

This ensures editors know that `greet` is a function that expects a string and returns a string.

### 3.3 Multiple Type Parameters (Generics)

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

### 3.4 Function Overloads

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

### 3.5 Extending Classes

```js
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

```js
/**
 * @param {{ name: string, age?: number }} user
 */
function printUserInfo({ name, age }) {
	console.log(`User: ${name}, Age: ${age}`);
}
```

---

## 4. Best Practices

### 4.1 Maintain `tsconfig.json` or `jsconfig.json`

Enable `"checkJs": true` to parse and validate JSDoc:

```json
{
	"compilerOptions": {
		"allowJs": true,
		"checkJs": true,
		"strict": true,
		"skipLibCheck": true
	},
	"include": ["src/**/*"]
}
```

### 4.2 Keep JSDoc Updated

- Sync doc with code: update JSDoc immediately when parameters change.
- Remove inaccurate tags to prevent confusion.

### 4.3 Use ESLint Plugins

`eslint-plugin-jsdoc` enforces consistency and correctness.

### 4.4 Document at the Right Level

- **Function/Method**: Provide `@param` and `@returns`.
- **Module/File**: Use `@file` or `@module` tags.
- **Class**: Use `@class`, `@extends`, `@implements`.

### 4.5 Consistency in Naming

- Use PascalCase for type definitions: `@typedef {Object} UserAccount`
- Use meaningful names reflecting usage.

---

## 5. Advanced Tips

**1. Combining JSDoc With `.d.ts`**

Supplement JSDoc with `.d.ts` files for advanced TypeScript features (mapped types, type augmentation, global scoping).

**2. Re-Exporting Types**

Create a dedicated `types.js` with all `@typedef` imports:

```js
// types.js
/**
 * @typedef {import('some-lib').SomeType} SomeType
 */
export {};
```

Then reference elsewhere:

```js
/** @type {import('./types').SomeType} */
let thing;
```

**3. Svelte-Specific Patterns**

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

Check [SvelteKit's type docs](https://kit.svelte.dev/docs/types) for more examples.

---

## 6. Example: Putting It All Together

```js
/** @file
 * Demonstrates advanced JSDoc with imports, generics, and best practices.
 */

/**
 * @typedef {import('svelte').Snippet} SvelteSnippet
 * @typedef {import('./myTypes').MyComplexType} MyComplexType
 */

/**
 * @template T
 * @param {T[]} items
 * @returns {T}
 */
function first(items) {
	return items[0];
}

/**
 * @typedef {Object} Props
 * @property {string} classes
 * @property {SvelteSnippet} [children]
 * @property {MyComplexType} extra
 */

/** @type {Props} */
let props = {
	classes: 'my-class',
	children: null,
	extra: { id: 'xyz', description: 'Custom type usage' },
};

const { classes, children, extra } = props;

/**
 * @param {Props} inputProps
 * @returns {void}
 */
function processProps(inputProps) {
	console.log(`Classes: ${inputProps.classes}`);
	if (inputProps.children) {
		console.log('Has snippet:', inputProps.children);
	}
	console.log('Extra:', inputProps.extra);
}
```

---

## 7. Resources

**Official**
- [JSDoc Official](https://jsdoc.app)
- [TypeScript JSDoc Support](https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html)

**Cheat Sheets**
- [JSDoc Syntax Guide](https://github.com/shri/JSDoc-Style-Guide)
- [JSDoc Tag Reference](https://devhints.io/jsdoc)
- [VS Code JSDoc Guide](https://code.visualstudio.com/docs/nodejs/working-with-javascript#_intellisense-and-jsdoc)

**Guides & Tutorials**
- [Boost Javascript with JSDoc Typing](https://dev.to/samuel-braun/boost-your-javascript-with-jsdoc-typing-3hb3)
- [Using JSDoc in JavaScript](https://blog.logrocket.com/using-jsdoc-javascript/)
- [JSDoc Type Checking in VS Code](https://mariusschulz.com/blog/jsdoc-type-checking-in-vs-code)
- [Documenting JavaScript with JSDoc](https://www.digitalocean.com/community/tutorials/documenting-javascript-with-jsdoc)

**Advanced**
- [Advanced JSDoc for TypeScript Users](https://fettblog.eu/typescript-jsdoc-superpowers/)
- [Svelte JSDoc Guide](https://kit.svelte.dev/docs/types#using-jsdoc)
- [JSDoc Generics & Advanced Types](https://dmitripavlutin.com/jsdoc-types/)

**Tools**
- [Documentation Generator](https://documentation.js.org/)
- [eslint-plugin-jsdoc](https://github.com/gajus/eslint-plugin-jsdoc)
- [ts-migrate](https://github.com/airbnb/ts-migrate)

---

## Conclusion

Key points:

1. Import external types with `@typedef {import('lib').Type} LocalName`.
2. Leverage generics, overloads, and destructuring.
3. Configure `tsconfig.json` / `jsconfig.json` with `"checkJs": true`.
4. Keep comments consistent and up-to-date.
