import { component$, useStylesScoped$ } from '@builder.io/qwik';
import { Branding } from '../branding/branding';
import { Navigation } from '../navigation/navigation';

import styles from './header.css?inline';

export const Header = component$(() => {
  useStylesScoped$(styles);

  return (
    <div class="@container">
      <header class=" px-4 py-6 flex flex-col gap-4 @md:flex-row justify-between items-center">
        <Branding />
        <Navigation />
      </header>
    </div>
  );
});
