
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  site: 'https://your-egac-site.pages.dev',
  server: {
    port: 3000
  },
  output: 'static',
  integrations: [react()],
});