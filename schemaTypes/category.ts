import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: rule => rule.required().error('Title is required'),
    }),
    defineField({
      // Nuxt should pick this up to make Category pages
      // and use the slug to generate the URL for the category page
      // TODO: Create a tag for this on creation
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
    }),
    defineField({
      // Short description for home page
      name: 'exerpt',
      title: 'Exerpt',
      type: 'string',
      description: 'Short description for home page',
      validation: rule => rule.max(200).warning('Shorter is better'),
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'markdown',
    }),
  ],
})
