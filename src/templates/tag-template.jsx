import React from 'react'
import { graphql } from 'gatsby'
import Layout from '../components/Layout'
import Seo from '../components/Seo'
import Sidebar from '../components/Sidebar'
import TagTemplateDetails from '../components/TagTemplateDetails'

const TagTemplate = (props) => (
  <Layout>
    <div>
      <Sidebar />
      <TagTemplateDetails {...props} />
    </div>
  </Layout>
)

export default TagTemplate

export const Head = ({ data, pageContext }) => (
  <Seo
    title={`All Articles tagged as "${pageContext.tagTitle}" - ${data.kontentItemSiteMetadata.elements.title.value}`}
  />
)

export const pageQuery = graphql`
  query TagPage($tagCodename: String) {
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
          tags: {
            value: { elemMatch: { system: { codename: { eq: $tagCodename } } } }
          }
        }
        preferred_language: { eq: "en-US" }
      }
      sort: { elements: { date: { value: DESC } } }
    ) {
      nodes {
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
