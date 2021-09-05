const path = require('path')

const templates = {
  article: path.resolve('./src/templates/article-template.jsx'),
  page: path.resolve('./src/templates/page-template.jsx'),
  tag: path.resolve('./src/templates/tag-template.jsx'),
  category: path.resolve('./src/templates/category-template.jsx'),
}

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions

  const result = await graphql(`
    {
      allKontentItemCategory(filter: { preferred_language: { eq: "en-US" } }) {
        nodes {
          system {
            codename
          }
          elements {
            slug {
              value
            }
            title {
              value
            }
          }
        }
      }
      allKontentItemTag(filter: { preferred_language: { eq: "en-US" } }) {
        nodes {
          system {
            codename
          }
          elements {
            title {
              value
            }
            slug {
              value
            }
          }
        }
      }
      allKontentItemMenuItem(
        filter: {
          preferred_language: { eq: "en-US" }
          elements: { slug: { value: { ne: "/" } } }
        }
      ) {
        nodes {
          elements {
            slug {
              value
            }
            content {
              value {
                ... on kontent_item_page {
                  preferred_language
                  system {
                    codename
                  }
                }
              }
            }
          }
        }
      }
      allKontentItemArticle(filter: { preferred_language: { eq: "en-US" } }) {
        nodes {
          elements {
            slug {
              value
            }
          }
        }
      }
    }
  `)

  if (result.errors) {
    throw new Error(`Kontent page queries failed: ${result.errors}`)
  }

  result.data.allKontentItemMenuItem.nodes.forEach((node) => {
    const contentPage = node.elements.content.value[0]
    if (!contentPage) return
    createPage({
      path: `/${node.elements.slug.value}/`,
      component: templates.page,
      context: {
        language: contentPage.preferred_language,
        codename: contentPage.system.codename,
      },
    })
  })

  result.data.allKontentItemArticle.nodes.forEach((node) => {
    createPage({
      path: `/articles/${node.elements.slug.value}/`,
      component: templates.article,
      context: { slug: node.elements.slug.value },
    })
  })

  result.data.allKontentItemTag.nodes.forEach((tag) => {
    createPage({
      path: `/tags/${tag.elements.slug.value}/`,
      component: templates.tag,
      context: {
        tagCodename: tag.system.codename,
        tagTitle: tag.elements.title.value,
      },
    })
  })

  result.data.allKontentItemCategory.nodes.forEach((category) => {
    createPage({
      path: `/categories/${category.elements.slug.value}/`,
      component: templates.category,
      context: {
        categoryCodename: category.system.codename,
        categoryTitle: category.elements.title.value,
      },
    })
  })
}
