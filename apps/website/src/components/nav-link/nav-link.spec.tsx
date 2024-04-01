import { QwikCityMockProvider } from '@builder.io/qwik-city';
import { createDOM } from '@builder.io/qwik/testing';
import { test, expect } from 'vitest';
import { NavLink } from './nav-link';

test(`[NavLink Component]: Should render`, async () => {
  const { screen, render } = await createDOM();
  await render(
    <QwikCityMockProvider>
      <NavLink title={'NavLink works!'} slug={'test'} href={'test'}>
        {'NavLink works!'}
      </NavLink>
      ,
    </QwikCityMockProvider>,
  );
  expect(screen).toBeTruthy();
});
