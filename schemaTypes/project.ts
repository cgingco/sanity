import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: rule => rule.required().error('Title is required'),
    }),
    defineField({
      // Nuxt should pick this up to make Project pages
      // and use the slug to generate the URL for the category page
      // TODO: Create a tag for this on creation
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: rule => rule.required().error('Slug is required'),
    }),
    defineField({
      name: 'mainImage',
      title: 'Main image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      // Projects can be under multiple categories
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [{type: 'reference', to: {type: 'category'}}],
      to: {type: 'category'},
      options: {
        // Disable the creation of new categories
        disableNew: true,
      },
      validation: rule => rule.required().error('At least one category is required'),
    }),
    defineField({
      name: 'mainCategory',
      title: 'Main Category',
      type: 'reference',
      to: {type: 'category'},
      options: {
        // Disable the creation of new categories
        disableNew: true
      },
      validation: rule => [
        rule.required().error('Main category is required'),
        rule.custom((value, {document}) => {
          // Ensure the main category is one of the selected categories
          if (!document?.categories) return true
          return document.categories.some(category => category._ref === value._ref) || 'Main category must be one of the selected categories'
        }),
      ],
    }),
    defineField({
      // Nuxt should pick this up and add it to the infobox
      name: 'startDate',
      title: 'Started at',
      type: 'datetime',
      validation: rule => rule.required().error('Start date is required'),
    }),
    defineField({
      // Nuxt should pick this up and add it to the infobox
      // but this is optional
      name: 'finishDate',
      title: 'Finished at',
      type: 'datetime',
    }),
    defineField({
      // Wikipedia-style infobox
      name: 'info',
      title: 'Info',
      type: 'array',
      description: 'Wikipedia-style infobox',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'key',
              title: 'Key',
              type: 'string',
              validation: rule => rule.required().error('Key is required'),
            },
            {
              name: 'value',
              title: 'Value',
              type: 'string',
              validation: rule => rule.required().error('Value is required'),
            },
          ],
        }
      ]
    }),
    defineField({
      // Short description for cards
      name: 'exerpt',
      title: 'Exerpt',
      type: 'text',
      description: 'Short description for cards',
      validation: rule => rule.max(200).warning('Shorter is better'),
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'markdown',
    }),
  ],
  initialValue: {
    startDate: new Date().toISOString(),
  },
})
