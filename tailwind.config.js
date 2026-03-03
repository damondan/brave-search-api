/** @type {import('tailwindcss').Config} */
import { skeleton } from '@skeletonlabs/tw-plugin';
import flowbite from 'flowbite/plugin';

export default {
  content: [
    './src/**/*.{html,js,svelte,ts}',
    './node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}', 
    './node_modules/flowbite/**/*.{js,ts}'      // flowbite JS modules
  ],
  theme: {
    extend: {},
  },
  plugins: [
    skeleton(),
    flowbite
  ],
};