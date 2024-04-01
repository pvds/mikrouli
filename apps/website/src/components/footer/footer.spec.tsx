import { createDOM } from '@builder.io/qwik/testing';
import { test, expect } from 'vitest';
import { Footer } from './footer';

test(`[Footer Component]: Should render`, async () => {
  const { screen, render } = await createDOM();
  await render(<Footer />);
  expect(screen).toBeTruthy();
});
