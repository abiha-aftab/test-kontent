// Turns the createPages query result into the list of pages to create.
// Pure so it can be unit tested without Gatsby.
const {
  articlePath,
  categoryPath,
  menuItemPath,
  tagPath,
} = require('../src/utils/paths')

const planPages = (data, templates) => {
  const pages = []

  data.allKontentItemMenuItem.nodes.forEach((node) => {
    const contentPage = node.elements.content.value[0]
    if (!contentPage) return
    pages.push({
      path: menuItemPath(node.elements.slug.value),
      component: templates.page,
      context: {
        language: contentPage.preferred_language,
        codename: contentPage.system.codename,
      },
    })
  })

  data.allKontentItemArticle.nodes.forEach((node) => {
    pages.push({
      path: articlePath(node.elements.slug.value),
      component: templates.article,
      context: { slug: node.elements.slug.value },
    })
  })

  data.allKontentItemTag.nodes.forEach((tag) => {
    pages.push({
      path: tagPath(tag.elements.slug.value),
      component: templates.tag,
      context: {
        tagCodename: tag.system.codename,
        tagTitle: tag.elements.title.value,
      },
    })
  })

  data.allKontentItemCategory.nodes.forEach((category) => {
    pages.push({
      path: categoryPath(category.elements.slug.value),
      component: templates.category,
      context: {
        categoryCodename: category.system.codename,
        categoryTitle: category.elements.title.value,
      },
    })
  })

  // Two items with the same slug would silently overwrite each other's page.
  const seen = new Map()
  pages.forEach((page) => {
    if (seen.has(page.path)) {
      throw new Error(
        `Two Kontent items map to ${page.path}; give one of them another slug.`
      )
    }
    seen.set(page.path, page)
  })

  return pages
}

module.exports = { planPages }
