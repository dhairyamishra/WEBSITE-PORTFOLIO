import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://dhairyamishra.github.io',
  output: 'static',
  integrations: [react(), tailwind(), sitemap()],
});