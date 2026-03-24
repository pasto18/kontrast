import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';
import mdx from '@astrojs/mdx';
import vercel from '@astrojs/vercel';

export default defineConfig({
 site: 'https://www.festivalkontrast.com',
  output: 'server',
  adapter: vercel(),
  integrations: [mdx(), react(), keystatic()],
  
  vite: {
    ssr: {
      noExternal: ['@keystatic/core', '@keystatic/astro', 'lodash']
    },
    optimizeDeps: {
      include: ['@keystatic/core', '@keystatic/astro']
    }
  }, // <-- Faltaba esta coma

  i18n: {
    defaultLocale: 'ca',
    locales: ['ca', 'en'],
    routing: {
      prefixDefaultLocale: false 
    }
  }
});