import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
	server: {
		open: false,
		port: 5176,
	},
	plugins: [tailwindcss(), sveltekit()],
});
