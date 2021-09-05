import React from 'react'
import { graphql } from 'gatsby'
import Layout from '../components/Layout'
import Seo from '../components/Seo'
import Sidebar from '../components/Sidebar'
import CategoryTemplateDetails from '../components/CategoryTemplateDetails'

const CategoryTemplate = (props) => (
  <Layout>
    <div>
      <Sidebar />
      <CategoryTemplateDetails {...props} />
    </div>
  </Layout>
)

export default CategoryTemplate

export const Head = ({ data, pageContext }) => (
  <Seo
    title={`${pageContext.categoryTitle} - ${data.kontentItemSiteMetadata.elements.title.value}`}
  />
)

export const pageQuery = graphql`
  query CategoryPage($categoryCodename: String) {
    kontentItemSiteMetadata(system: { codename: { eq: "site_metadata" } }) {
      elements {
        title {
          value
        }
      }
    }
    allKontentItemArticle(
      filter: {
        elements: {
          category: {
            value: {
              elemMatch: { system: { codename: { eq: $categoryCodename } } }
            }
          }
        }
        preferred_language: { eq: "en-US" }
      }
    ) {
      nodes {
        system {
          codename
        }
        elements {
          category {
            value {
              ... on kontent_item_category {
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
          }
          date {
            value
          }
          description {
            value
          }
          content {
            value
          }
          slug {
            value
          }
          tags {
            value {
              ... on kontent_item_tag {
                elements {
                  title {
                    value
                  }
                }
              }
            }
          }
          title {
            value
          }
        }
      }
    }
  }
`
