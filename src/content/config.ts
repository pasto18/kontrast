// src/content/config.ts (VERSION OBLIGATORIA Y LIMPIA)

import { defineCollection, z } from 'astro:content';

const obrasCollection = defineCollection({
  type: 'content', 
  schema: z.object({
    
    titulo: z.string(),
    
    // Todos estos son AHORA OBLIGATORIOS (sin .optional())
    categoria: z.string().default('CIRC'),
   categoria_manual: z.string().default(""), // Si se elige "Otro", esto es obligatorio
    compania: z.string(), 
    web_compania: z.string(),
    video: z.string(),
    entradas_url: z.string(),
    
    fotos: z.array(z.string()).default([]), 
    pases: z.array(
      z.object({
        fecha: z.union([z.string(), z.date()]).transform((val) => {
            return new Date(val).toISOString().split('T')[0];
        }),
        hora: z.string(),
      })
    ).default([]),
  }),
});

export const collections = {
  'obras': obrasCollection,
};