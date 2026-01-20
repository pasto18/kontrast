import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';
import mdx from '@astrojs/mdx';
import vercel from '@astrojs/vercel'; // <--- 1. Importamos el adaptador

// https://astro.build/config
export default defineConfig({
  // 2. Cambiamos a 'hybrid' (Híbrido: Web estática + Panel de admin dinámico)
  output: 'hybrid', 
  
  // 3. Añadimos el adaptador de Vercel
  adapter: vercel(),

  integrations: [
    mdx(),
    react(), 
    keystatic()
  ]
});