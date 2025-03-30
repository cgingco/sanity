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
      // TODO: Ensure these are unique between categories AND projects
      validation: rule => rule.required().error('Slug is required'),
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'markdown',
    }),
  ],
})
