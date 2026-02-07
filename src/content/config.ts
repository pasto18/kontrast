import { defineCollection, z } from 'astro:content';

const obrasCollection = defineCollection({
  type: 'content', 
  schema: z.object({
    // Título es lo único OBLIGATORIO de verdad
    titulo: z.string(),
    
    // Todo lo demás lo hacemos opcional o con valores por defecto
    // para que la web nunca explote al compilar.
    
    categoria: z.string().default('CIRC'),
    categoria_manual: z.string().optional(),

   // CAMBIO CRÍTICO: Usamos nullable().optional() para compatibilidad máxima
    compania: z.string().nullable().optional(), 
    
    // Los campos URL también pueden ser nulos y opcionales
    web_compania: z.string().nullable().optional(),
    video: z.string().nullable().optional(),
    entradas_url: z.string().nullable().optional(),
    
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