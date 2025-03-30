import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: rule => rule.required().error('Title is required'),
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
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: {type: 'author'},
      validation: rule => rule.required().error('Author is required'),
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
      // TODO: Only show and allow projecst assigned to categories from this post
      // validation: rule => rule.custom((project, context) => {

      //   // Access the parent document (the blog post) to get its categories
      //   const blogCategories = context.parent?.categories || [];
      //   const blogCategoryIds = blogCategories.map((category) => category._ref);

      //   // If no project is selected, it's valid (allowing for optional field)
      //   if (!project) return true;

      //   const projectCategories = project?.categories || [];
      //   const projectCategoryIds = projectCategories.map((category) => category._ref);

      //   // Check if any of the project's categories match the blog post's categories
      //   const isValid = projectCategoryIds.some((id) => blogCategoryIds.includes(id));

      //   if (!isValid) {
      //     return `The selected project does not belong to the same category as this post.`;
      //   }

      //   return true; // Valid if the project belongs to a valid category
      // }),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
      validation: rule => rule.required().error('Published date is required'),
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'markdown',
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
