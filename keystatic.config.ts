import { config, fields, collection } from '@keystatic/core';

export default config({
  // --- CONFIGURACIÓN DE GITHUB (Modo Escritura) ---
  storage: import.meta.env.PROD
    ? {
        kind: 'github',
        repo: {
          owner: 'pasto18',      // <--- TU USUARIO DE GITHUB
          name: 'kontrast',      // <--- EL NOMBRE DE TU REPO
        },
      }
    : {
        kind: 'local',
      },

  // ESTE BLOQUE ES EL NUEVO Y CRÍTICO: FUERZA EL PERMISO DE REPO
  github: {
      scope: 'repo', // Pide permiso completo de repositorio
  },

clientId: process.env.KEYSTATIC_GITHUB_CLIENT_ID,
clientSecret: process.env.KEYSTATIC_GITHUB_CLIENT_SECRET,
secret: process.env.KEYSTATIC_SECRET,
  // ---------------------------------------------------

  collections: {
    obras: collection({
      label: 'OBRAS',
      slugField: 'titulo',
      path: 'src/content/obras/*',
      format: { contentField: 'sinopsis' },
      
      schema: {
        // ... (Tu esquema de campos aquí)
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