import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  groups: [
    {
      name: 'info',
      title: 'Info',
      default: true,
    },
    {
      name: 'body',
      title: 'Body',
    },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: rule => rule.required().error('Title is required'),
      group: 'info',
    }),
    defineField({
      // Nuxt should pick this up to make Project pages
      // and use the slug to generate the URL for the category page
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: [
        rule => rule.required().error('Slug is required'),
        rule => rule.custom((slug, context) => {
          if (!slug) {
            return true; // Skip validation if slug is not set
          }

          const {getClient} = context;
          const client = getClient({apiVersion: '2025-03-30'});

          return client.fetch(
            `!defined(*[_type in ["category", "project"] && slug.current == $slug && !(_id in [$draftId, $publishedId])][0]._id)`,
            {
              slug: slug.current,
              draftId: context.document._id,
              publishedId: context.document._id.replace(/^drafts\./, ''),
            }
          ).then(isUnique => isUnique || 'Slug must be unique across categories and projects');
        }),
      ],
      group: 'info',
    }),
    defineField({
      name: 'mainImage',
      title: 'Main image',
      type: 'image',
      options: {
        hotspot: true,
      },
      group: 'info',
    }),
    defineField({
      // Projects can be under multiple categories
      name: 'categories',
      title: 'Categories',
      type: 'array',
      description: 'The top most category is the main category - this only affects the default breadcrumb',
      of: [{type: 'reference', to: {type: 'category'}}],
      options: {
        // Disable the creation of new categories
        disableNew: true,
        sortable: true,
      },
      validation: rule => rule.required().error('At least one category is required'),
      group: 'info',
    }),
    defineField({
      // Nuxt should pick this up and add it to the infobox
      name: 'startDate',
      title: 'Started at',
      type: 'datetime',
      validation: rule => rule.required().error('Start date is required'),
      group: 'info',
    }),
    defineField({
      // Nuxt should pick this up and add it to the infobox
      // but this is optional
      name: 'finishDate',
      title: 'Finished at',
      type: 'datetime',
      group: 'info',
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
              type: 'markdown',
              validation: [
                rule => rule.required().error('Value is required'),
                rule => rule.max(200).warning('Shorter is better')
              ],
            },
          ],
        }
      ],
      group: 'info',
    }),
    defineField({
      // Short description for cards
      name: 'exerpt',
      title: 'Exerpt',
      type: 'string',
      description: 'Short description for cards',
      validation: rule => rule.max(200).warning('Shorter is better'),
      group: 'body',
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'markdown',
      description: 'Main content of the project',
      group: 'body',
    }),
  ],
  initialValue: {
    startDate: new Date().toISOString(),
  },
})
