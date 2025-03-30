import {defineField, defineType} from 'sanity'
import {client} from '../sanity.config'

export default defineType({
  name: 'post',
  title: 'Post',
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
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      // TODO: Ensure these are unique for posts
      validation: rule => rule.required().error('Slug is required'),
      group: 'info',
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: {type: 'author'},
      validation: rule => rule.required().error('Author is required'),
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
      // Optional, added as a 'tag'
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [{
        type: 'reference',
        to: {type: 'category'},
        options: {
          disableNew: true,
        }
      }],
      group: 'info',
    }),
    defineField({
      // Optional, added as a 'tag'
      name: 'project',
      title: 'Project',
      type: 'reference',
      to: {type: 'project'},
      options: {
        disableNew: true,
      },
      readOnly: ({ document }) => !document?.categories,
      hidden: ({ document }) => !document?.categories, // Hide field if categories are cleared
      validation: rule => rule.custom((project, context) => {
        const categories = context.document?.categories;
        if (!categories && project) {
          return 'Project must be cleared if categories are cleared.';
        }
        return true;
      }),
      group: 'info',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
      validation: rule => rule.required().error('Published date is required'),
      group: 'info',
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'tags',
      options: {
        allowCreate: true,
        includeFromRelated: 'tags',
        // Should grab all slugs from categories and project and add them as tags
        predefinedTags: async () => client.fetch(
          `*[_type == "category" || _type == "project"]{title, slug}`
        ).then(
          tags => tags.map(tag => ({label: tag.title, value: tag.slug}))
        ),
        onCreate: (value) => ({
          label: value,
          value: value.toLowerCase().replace(/\W/g, '-'),
        }),
        checkValid: (input, values) => {
          return (
            !!input &&
            input.trim() === input &&
            !values.includes(input.trim().toLowerCase().replace(/\W/g, '-'))
          )
        }
      },
      group: 'info',
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'markdown',
      group: 'body',
      validation: rule => rule.required().error('Body is required'),
    }),
  ],
  initialValue: {
    publishedAt: new Date().toISOString(),
  },
  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      media: 'mainImage',
    },
    prepare(selection) {
      const {author} = selection
      return {...selection, subtitle: author && `by ${author}`}
    },
  },
})
