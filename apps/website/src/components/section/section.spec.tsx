import { createDOM } from '@builder.io/qwik/testing';
import { test, expect } from 'vitest';
import { Section } from './section';

test(`[Section Component]: Should render`, async () => {
  const { screen, render } = await createDOM();
  await render(<Section />);
  expect(screen.innerHTML).toContain('Section works!');
});
