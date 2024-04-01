import styles from './nav-link.css?inline';

import { Slot, component$, useStylesScoped$ } from '@builder.io/qwik';
import { Link, useLocation, type LinkProps } from '@builder.io/qwik-city';

type NavLinkItem = {
  title: string;
  slug: string;
  href: string;
};

export type NavLinkProps = LinkProps &
  NavLinkItem & {
    activeClass?: string;
  };

export const NavLink = component$(({ activeClass, ...props }: NavLinkProps) => {
  useStylesScoped$(styles);

  const location = useLocation();
  const toPathname = props.href ?? '';
  const locationPathname = location.url.pathname;

  const startSlashPosition =
    toPathname !== '/' && toPathname.startsWith('/')
      ? toPathname.length - 1
      : toPathname.length;
  const endSlashPosition =
    toPathname !== '/' && toPathname.endsWith('/')
      ? toPathname.length - 1
      : toPathname.length;
  const isActive =
    locationPathname === toPathname ||
    (locationPathname.endsWith(toPathname) &&
      (locationPathname.charAt(endSlashPosition) === '/' ||
        locationPathname.charAt(startSlashPosition) === '/'));

  return (
    <Link
      {...props}
      class={`${props.class || ''} ${isActive ? activeClass : ''} mx-0.5 px-4 py-1 rounded-full`}
    >
      {props.title}
      <Slot />
    </Link>
  );
});
