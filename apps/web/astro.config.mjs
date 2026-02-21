import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://yourdomain.com', // Update with your actual domain
  output: 'static', // CRITICAL: Static output for nginx deployment
  integrations: [react(), tailwind(), sitemap()],
});