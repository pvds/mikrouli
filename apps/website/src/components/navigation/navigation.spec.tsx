import { QwikCityMockProvider } from '@builder.io/qwik-city';
import { createDOM } from '@builder.io/qwik/testing';
import { test, expect } from 'vitest';
import { Navigation } from './navigation';

test(`[Navigation Component]: Should render`, async () => {
  const { screen, render } = await createDOM();
  await render(
    <QwikCityMockProvider>
      <Navigation />
    </QwikCityMockProvider>,
  );
  expect(screen).toBeTruthy();
});
