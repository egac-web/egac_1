
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  site: 'https://your-egac-site.pages.dev',
  server: {
    port: 3000
  },
  output: 'server',
  adapter: cloudflare({
    mode: 'directory',
    runtime: {
      mode: 'local',
      type: 'pages'
    }
  }),
  integrations: [react()],
  vite: {
    define: {
      'process.env.DIRECTUS_URL': JSON.stringify(process.env.DIRECTUS_URL),
      'process.env.DIRECTUS_TOKEN': JSON.stringify(process.env.DIRECTUS_TOKEN),
    }
  }
});