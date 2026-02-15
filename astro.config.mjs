import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';
import mdx from '@astrojs/mdx';
import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://kontrast-henna.vercel.app',
  output: 'server',
  adapter: vercel(),
  integrations: [mdx(), react(), keystatic()],
  
  // SOLUCIÓN AL ERROR DE VITE
  vite: {
    optimizeDeps: {
      // Excluimos solo las librerías de Keystatic de la optimización de caché
      // Esto obliga a Vite a leerlas siempre del sitio correcto
      exclude: ['@keystatic/core', '@keystatic/astro']
    }
  }
});