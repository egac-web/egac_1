import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://your-egac-site.pages.dev',
  server: {
    port: 3000
  },
  integrations: [react()],
});