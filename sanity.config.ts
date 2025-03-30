import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {createClient} from '@sanity/client'
import {schemaTypes} from './schemaTypes'
import {media} from 'sanity-plugin-media'
import {markdownSchema} from 'sanity-plugin-markdown'
import {tags} from 'sanity-plugin-tags'

export const client = createClient({
  projectId: process.env.SANITY_STUDIO_PROJECT_ID,
  dataset: process.env.SANITY_STUDIO_DATASET || "production",
  apiVersion: '2025-03-30',
  useCdn: true,
  token: process.env.SANITY_SECRET_TOKEN,
})

export default defineConfig({
  name: 'default',
  title: 'cging.co',

  projectId: process.env.SANITY_STUDIO_PROJECT_ID,
  dataset: process.env.SANITY_STUDIO_DATASET || "production",

  plugins: [structureTool(), visionTool(), media(), markdownSchema(), tags()],

  schema: {
    types: schemaTypes,
  },
})
