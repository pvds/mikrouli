# Example: technical documentation

## Original

Before you are able to run the test suite locally, you will need to make sure that all dependencies
have been installed in your local development environment. You can do this by running the
installation command from the root of the repository.

```sh
pnpm install
```

After this command has completed successfully, you can then run the tests by using the following
command.

```sh
pnpm test
```

## Light

Before running the test suite locally, make sure dependencies are installed. Run the installation
command from the repository root.

```sh
pnpm install
```

After it completes, run the tests.

```sh
pnpm test
```

## Balanced

Install dependencies from the repository root:

```sh
pnpm install
```

Then run the tests:

```sh
pnpm test
```

## Strong

From the repository root:

```sh
pnpm install
pnpm test
```

## Notes

- Preserves commands exactly.
- Balanced intensity improves scanability by pairing action with command.
- Strong intensity is safe only when the command order is obvious and no extra context is needed.
