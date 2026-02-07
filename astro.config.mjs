import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';
import mdx from '@astrojs/mdx';
import vercel from '@astrojs/vercel';

export default defineConfig({
  // AÑADE ESTA LÍNEA CON TU URL EXACTA (SIN BARRA AL FINAL)
  site: 'https://kontrast-henna.vercel.app', 
  
  output: 'server',
  adapter: vercel(),

  integrations: [
    mdx(),
    react(), 
    keystatic()
  ]
});