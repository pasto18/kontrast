import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';
import mdx from '@astrojs/mdx';
import vercel from '@astrojs/vercel';

export default defineConfig({
  // CORRECCIÓN: Astro 5 pide 'static' (o simplemente borrar la línea, ya que es el default)
  // Aunque pongamos 'static', el adaptador de Vercel permitirá que Keystatic funcione.
  output: 'static', 
  
  adapter: vercel(),

  integrations: [
    mdx(),
    react(), 
    keystatic()
  ]
});