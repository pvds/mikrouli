const { createGlobPatternsForDependencies } = require('qwik-nx/tailwind');
const { join } = require('path');
// Grayscale Design palette: https://grayscale.design/app?lums=93.87,90.43,85.46,78.45,68.75,55.49,38.90,25.64,15.94,8.93,3.96,0.52&palettes=%23DEF0E8,%23359497&filters=0%7C0,0%7C0&names=lea,aqua&labels=,
// Grayscale Design palette: https://grayscale.design/app?lums=93.87,90.43,85.46,78.45,68.75,55.49,38.90,24.17,15.94,8.93,3.96,0.52&palettes=%23DEF0E8,%23359497&filters=0%7C0,0%7C0&names=accen,brand&labels=,
const colors = {
  gray: {
    50: 'rgb(248, 248, 248)',
    100: 'rgb(244, 244, 244)',
    200: 'rgb(238, 238, 238)',
    300: 'rgb(229, 229, 229)',
    400: 'rgb(216, 216, 216)',
    500: 'rgb(196, 196, 196)',
    600: 'rgb(168, 168, 168)',
    700: 'rgb(135, 135, 135)',
    800: 'rgb(111, 111, 111)',
    900: 'rgb(84, 84, 84)',
    1000: 'rgb(56, 56, 56)',
    1100: 'rgb(16, 16, 16)',
  },
  accent: {
    50: 'rgb(244, 250, 247)',
    100: 'rgb(235, 246, 241)',
    200: 'rgb(226, 242, 235)',
    300: 'rgb(211, 235, 224)',
    400: 'rgb(187, 224, 207)',
    500: 'rgb(152, 208, 183)',
    600: 'rgb(99, 184, 146)',
    700: 'rgb(68, 150, 113)',
    800: 'rgb(56, 124, 93)',
    900: 'rgb(43, 94, 71)',
    1000: 'rgb(29, 63, 48)',
    1100: 'rgb(8, 18, 14)',
  },
  brand: {
    50: 'rgb(241, 250, 250)',
    100: 'rgb(233, 247, 247)',
    200: 'rgb(221, 242, 243)',
    300: 'rgb(204, 236, 237)',
    400: 'rgb(175, 225, 227)',
    500: 'rgb(132, 209, 212)',
    600: 'rgb(66, 184, 188)',
    700: 'rgb(53, 148, 151)',
    800: 'rgb(44, 122, 125)',
    900: 'rgb(33, 93, 95)',
    1000: 'rgb(22, 62, 63)',
    1100: 'rgb(6, 18, 18)',
    DEFAULT: 'rgb(53, 148, 151)',
  },
};
const screens = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
  '3xl': '2100px',
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(
      __dirname,
      '{src,pages,components,app}/**/*!(*.stories|*.spec).{ts,tsx,html}',
    ),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    colors,
    screens,
    containers: screens,
    extend: {
      gridTemplateRows: {
        'global-layout': 'auto 1fr',
      },
    },
  },
  plugins: [require('@tailwindcss/container-queries')],
};
