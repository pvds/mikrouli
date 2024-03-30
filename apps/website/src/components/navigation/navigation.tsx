import { component$, useStylesScoped$ } from '@builder.io/qwik';

import styles from './navigation.css?inline';
import { NAVIGATION_ITEMS } from './navigation.data';

export const Navigation = component$(() => {
  useStylesScoped$(styles);

  return (
    <>
      <nav>
        <ul class="flex flex-row">
          {NAVIGATION_ITEMS.map((item) => (
            <li key={item.slug}>
              <a
                class="px-2 py-1 rounded hover:bg-green-600 hover:text-white text-lg"
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
