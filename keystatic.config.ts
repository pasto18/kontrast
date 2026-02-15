import { config, fields, collection } from '@keystatic/core';

// 1. Función segura: Detecta si estamos en el servidor o cliente antes de pedir variables
const getEnvVar = (key: string) => {
  // Primero intenta con el estándar de Vite/Astro
  if (import.meta.env[key]) return import.meta.env[key];
  
  // Solo intenta process.env si detecta que NO está en el navegador
  if (typeof window === 'undefined' && typeof process !== 'undefined') {
    return process.env[key];
  }
  return undefined;
};

export default config({
  // --- ESTRATEGIA DE ALMACENAMIENTO ---
  storage: import.meta.env.PROD
    ? {
        kind: 'github', 
        repo: {
          owner: 'pasto18',
          name: 'kontrast',
        },
      }
    : {
        kind: 'local', // En local (npm run dev) guardará en tu disco duro
      },

  // --- CONFIGURACIÓN DE GITHUB APP ---
  github: {
    scope: 'repo',
  },

  // Usamos la función segura para evitar el crash en el navegador
  clientId: getEnvVar('KEYSTATIC_GITHUB_CLIENT_ID'),
  clientSecret: getEnvVar('KEYSTATIC_GITHUB_CLIENT_SECRET'),
  secret: getEnvVar('KEYSTATIC_SECRET'),

  collections: {
    obras: collection({
      label: 'OBRAS',
      slugField: 'titulo',
      path: 'src/content/obras/*',
      format: { contentField: 'sinopsis' },
      
      schema: {
        titulo: fields.slug({ name: { label: 'Título de la Obra' } }),
        categoria: fields.select({
            label: 'Tipo de Espectáculo',
            options: [
                { label: 'Circ', value: 'CIRC' },
                { label: 'Música', value: 'MÚSICA' },
                { label: 'Teatre', value: 'TEATRE' },
                { label: 'Otro (Escribir manual)', value: 'Otro' }
            ],
            defaultValue: 'CIRC'
        }),
        categoria_manual: fields.text({ label: 'Especificar tipo (Solo si elegiste "Otro" arriba)', }),
        compania: fields.text({ label: 'Compañía' }),
        web_compania: fields.url({ label: 'Web de la Compañía', validation: { isRequired: false } }),
        video: fields.url({ label: 'Link Video Youtube (Embed)', validation: { isRequired: false } }),
        entradas_url: fields.url({ label: 'Link Entradas', validation: { isRequired: false } }),
        fotos: fields.array(
            fields.image({
                label: 'Foto',
                directory: 'public/img/obras',
                publicPath: '/img/obras/'
            }),
            { label: 'Galería de Fotos (Máx 4)', itemLabel: props => 'Foto' }
        ),
        pases: fields.array(
            fields.object({
                fecha: fields.date({ label: 'Fecha' }),
                hora: fields.text({ label: 'Hora (ej: 20:00)' }),
            }),
            { label: 'Fechas y Horarios', itemLabel: props => `${props.fields.fecha.value} - ${props.fields.hora.value}` }
        ),
        sinopsis: fields.mdx({
            label: 'Sinopsis',
        }),
      },
    }),
  },
});