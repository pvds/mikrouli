import { createDOM } from '@builder.io/qwik/testing';
import { test, expect } from 'vitest';
import { Tile } from './tile';

test(`[Tile Component]: Should render`, async () => {
  const { screen, render } = await createDOM();
  await render(<Tile />);
  expect(screen.innerHTML).toContain('Tile works!');
});
