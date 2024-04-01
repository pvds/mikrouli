import { component$, useStylesScoped$ } from '@builder.io/qwik';

import styles from './footer.css?inline';

export const Footer = component$(() => {
  useStylesScoped$(styles);

  return (
    <footer class="container mt-12 mx-auto p-4 w-fit">
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-[10dvw] gap-y-[6dvw]">
        <section>
          <h2 class="text-lg font-bold text-brand-900">Company</h2>
          <ul class="mt-2 flex flex-col gap-2">
            <li>
              <a href="/about" class="text-brand-800 hover:text-brand-1000">
                About Us
              </a>
            </li>
            <li>
              <a href="/partners" class="text-brand-800 hover:text-brand-1000">
                Partnerships
              </a>
            </li>
            <li>
              <a href="/contact" class="text-brand-800 hover:text-brand-1000">
                Contact Us
              </a>
            </li>
          </ul>
        </section>
        <section>
          <h2 class="text-lg font-bold text-brand-900">Legal</h2>
          <ul class="mt-2 flex flex-col gap-2">
            <li>
              <a href="/privacy" class="text-brand-800 hover:text-brand-1000">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="/terms" class="text-brand-800 hover:text-brand-1000">
                Terms of Service
              </a>
            </li>
          </ul>
        </section>
        <section>
          <h2 class="text-lg font-bold text-brand-900">Connect</h2>
          <ul class="mt-2 flex flex-col gap-2">
            <li>
              <a
                href="https://twitter.com/mikrouli"
                class="text-brand-800 hover:text-brand-1000"
              >
                Twitter
              </a>
            </li>
            <li>
              <a
                href="
https://www.linkedin.com/company/mikrouli"
                class="text-brand-800 hover:text-brand-1000"
              >
                LinkedIn
              </a>
            </li>
          </ul>
        </section>
      </div>

      <p class="mt-8 text-center text-sm text-brand-800">
        &copy; 2024 Mikrouli. All rights reserved.
      </p>
    </footer>
  );
});
