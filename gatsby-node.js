const path = require('path')
const { planPages } = require('./config/pages')

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

  planPages(result.data, templates).forEach((page) => createPage(page))
}
