// URL rules shared by gatsby-node (page creation) and the components that
// link to those pages, so the two can't drift apart.
const trimSlashes = (slug) => String(slug || '').replace(/^\/+|\/+$/g, '')

const sectionPath = (section, slug) => `/${section}/${trimSlashes(slug)}/`

const articlePath = (slug) => sectionPath('articles', slug)
const tagPath = (slug) => sectionPath('tags', slug)
const categoryPath = (slug) => sectionPath('categories', slug)

// Menu items use "/" for the home page and a bare slug for content pages.
const menuItemPath = (slug) => {
  const trimmed = trimSlashes(slug)
  return trimmed ? `/${trimmed}/` : '/'
}

module.exports = { articlePath, categoryPath, menuItemPath, tagPath }
