import { createDOM } from '@builder.io/qwik/testing';
import { test, expect } from 'vitest';
import { Branding } from './branding';

test(`[Branding Component]: Should render`, async () => {
  const { screen, render } = await createDOM();
  await render(<Branding />);
  expect(screen).toBeTruthy();
});
