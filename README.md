# Sanity Blogging Content Studio

Content management system for [cging.co](https://cging.co) using [Sanity CMS](https://www.sanity.io).

Requires: Node 22

# Category / Project / Blog Schema

* Categories are top level
* Projects are assigned to one or more categories
    * Each project can show up under a `category/project` slug but 301 REDIRECT to the actual `project/...` page
    * Then breadcrumbs on the project page either default to default category or update dynamically depending on where user just came from (put it in da header probably)
* Blog posts don't need to be under any categories or projects (but can be)
    * Use tag manager to automatically generate tags from the slugs of the categories and projects
    * Then we can tag the blog post with any relevant tags
* Filters go to their own urls
    * e.g. `blog/tag/programming` or `blog/tag/cgingco` or `blog/tag/food`
    * If they're related to a category or project, maybe add a thing linking the user to the category or project?