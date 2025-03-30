import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {RobotIcon, RocketIcon} from '@sanity/icons'
import {schemaTypes} from './schemaTypes'
import {media} from 'sanity-plugin-media'
import {markdownSchema} from 'sanity-plugin-markdown'
import {tags} from 'sanity-plugin-tags'

export default defineConfig([
  {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID,
    dataset: 'production',
    name: 'production-workspace',
    basePath: '/prod',
    title: 'Default Workspace',
    subtitle: 'production',
    icon: RobotIcon,
    plugins: [structureTool(), visionTool(), media(), markdownSchema(), tags()],
    schema: {
      types: schemaTypes,
    },
  },
  {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID,
    dataset: "development",
    name: 'development-workspace',
    basePath: '/dev',
    title: 'Development Workspace',
    subtitle: 'development',
    icon: RocketIcon,
    plugins: [structureTool(), visionTool(), media(), markdownSchema(), tags()],
    schema: {
      types: schemaTypes,
    },
  }
])
