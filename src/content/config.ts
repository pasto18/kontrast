import { defineCollection, z } from 'astro:content';

const obras = defineCollection({
  type: 'data', 
  schema: z.object({
    titulo: z.string(),
    categoria: z.string(),
    categoria_manual: z.string().optional().nullable(),
    compania: z.string(),
    web_compania: z.string().optional().nullable(),
    video: z.string().optional().nullable(),
    entradas_url: z.string().optional().nullable(),
    fotos: z.array(z.string()).optional().default([]),
    pases: z.array(z.object({
      fecha: z.string(),
      hora: z.string(),
    })).optional().default([]),
    
    // Al usar fields.text, aquí recibimos un string simple
    sinopsis_cat: z.string().optional().nullable(), 
    sinopsis_eng: z.string().optional().nullable(),
  }),
});

export const collections = { 'obras': obras };