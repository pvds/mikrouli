import { component$, useStylesScoped$ } from '@builder.io/qwik';
import { NavLink } from '../nav-link/nav-link';

import styles from './navigation.css?inline';
import { NAVIGATION_ITEMS } from './navigation.data';

export const Navigation = component$(() => {
  useStylesScoped$(styles);

  return (
    <>
      <nav>
        <ul class="flex flex-row flex-wrap">
          {NAVIGATION_ITEMS.map((item) => (
            <li key={item.slug}>
              <NavLink
                class="hover:bg-accent-200 active:bg-accent-300 text-lg font-medium text-brand-700"
                title={item.title}
                slug={item.slug}
                href={item.href}
                activeClass="bg-accent-300"
              />
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
});
