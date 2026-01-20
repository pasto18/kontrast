import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  
  integrations: [
    mdx(),
    react(), 
    keystatic()
  ]
  
  // HE BORRADO EL BLOQUE "vite: { ... }" ENTERO.
  // Vamos a probar si funciona sin él tras la limpieza que hiciste.
});