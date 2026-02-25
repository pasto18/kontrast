import { config, fields, collection } from '@keystatic/core';

// Detectamos el entorno
const isProd = import.meta.env.PROD;

export default config({
  storage: isProd
    ? {
        kind: 'github',
        repo: { owner: 'pasto18', name: 'kontrast' },
      }
    : {
        kind: 'local',
      },

  clientId: import.meta.env.KEYSTATIC_GITHUB_CLIENT_ID,
  clientSecret: import.meta.env.KEYSTATIC_GITHUB_CLIENT_SECRET,
  secret: import.meta.env.KEYSTATIC_SECRET || 'local-dummy-secret-123456',

  collections: {
    obras: collection({
      label: 'OBRAS',
      slugField: 'titulo',
      path: 'src/content/obras/*',
      format: { data: 'json' }, // Esto fuerza a que sea UN solo archivo JSON
      
      schema: {
        titulo: fields.slug({ name: { label: 'Título' } }),
        
        categoria: fields.select({
            label: 'Categoría',
            options: [
                { label: 'Circ', value: 'CIRC' }, 
                { label: 'Música', value: 'MÚSICA' }, 
                { label: 'Teatre', value: 'TEATRE' }, 
                { label: 'Otro', value: 'Otro' }
            ],
            defaultValue: 'CIRC'
        }),
        
        categoria_manual: fields.text({ label: 'Categoría manual' }),
        compania: fields.text({ label: 'Compañía' }),
        web_compania: fields.text({ label: 'Web Compañía' }),
        video: fields.text({ label: 'Video URL' }),
        entradas_url: fields.text({ label: 'Entradas URL' }),
        
        fotos: fields.array(
            fields.image({
                label: 'Foto',
                directory: 'public/img/obras',
                publicPath: '/img/obras/'
            }),
            { label: 'Galería de Fotos', itemLabel: props => 'Imagen' }
        ),
        
        pases: fields.array(
            fields.object({
                fecha: fields.date({ label: 'Fecha' }),
                hora: fields.text({ label: 'Hora' }),
            }),
            { label: 'Fechas y Horarios', itemLabel: props => `${props.fields.fecha.value} - ${props.fields.hora.value}` }
        ),

        // --- SOLUCIÓN PARA UN SOLO ARCHIVO ---
        // Usamos text con multiline: true. 
        // Esto guarda el Markdown como una cadena de texto simple dentro del JSON.
        sinopsis_cat: fields.text({ 
            label: 'Sinopsis (CAT)', 
            multiline: true,
            description: 'Puedes usar Markdown aquí (# Titulo, **negrita**, etc)' 
        }),
        
        sinopsis_eng: fields.text({ 
            label: 'Sinopsis (ENG)', 
            multiline: true 
        }),
      },
    }),
  },
});