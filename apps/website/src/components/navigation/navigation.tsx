import { component$, useStylesScoped$ } from '@builder.io/qwik';

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
              <a
                class="px-4 py-1 rounded-full hover:bg-accent-200 text-lg font-medium text-brand-700"
                href={item.route}
              >
                {item.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
});
