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
      validation: [
        rule => rule.required().error('Slug is required'),
        rule => rule.custom((slug, context) => {
          if (!slug) {
            return true; // Skip validation if slug is not set
          }

          const {getClient} = context;
          const client = getClient({apiVersion: '2025-03-30'});

          return client.fetch(
            `!defined(*[_type in ["post"] && slug.current == $slug && !(_id in [$draftId, $publishedId])][0]._id)`,
            {
              slug: slug.current,
              draftId: context.document._id,
              publishedId: context.document._id.replace(/^drafts\./, ''),
            }
          ).then(isUnique => isUnique || 'Slug must be unique');
        }),
      ],
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
      description: 'Use tags to attach keywords to this post.',
      options: {
        allowCreate: true,
        includeFromRelated: 'tags',
        // NOTE: Don't need to do this - I'm attaching categories and projects above
        // as references, so I don't need to do this here.
        // predefinedTags: async () => client.fetch(
        //   // Grab all slugs from categories and project and add them as tags
        //   `*[_type == "category" || _type == "project"]{title, slug}`
        // ).then(
        //   tags => tags.map(tag => ({label: tag.title, value: tag.slug}))
        // ),
        onCreate: (value) => ({
          // On create, create a slug from the value
          label: value,
          value: value.toLowerCase().replace(/\W/g, '-'),
        }),
        checkValid: (input, values) => {
          // Checks if the input exists, is not empty, and is not already in the values array
          // Also checks if the input is a valid slug (no spaces, no special characters)
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
