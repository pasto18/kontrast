import { defineCollection, z } from 'astro:content';

const obrasCollection = defineCollection({
  type: 'content', // Esto permite leer .md y .mdx
  schema: z.object({
    titulo: z.string(),
    
    // CAMPOS DE CATEGORÍA
    categoria: z.string().default('CIRC'),
    categoria_manual: z.string().optional(),

    compania: z.string(),
    
    // CAMPOS OPCIONALES (Para que no explote si están vacíos)
    web_compania: z.string().optional(),
    video: z.string().optional(),
    entradas_url: z.string().optional(),
    
    // FOTOS Y PASES
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