import React from 'react'
import { graphql } from 'gatsby'
import Layout from '../components/Layout'
import Seo from '../components/Seo'
import ArticleTemplateDetails from '../components/ArticleTemplateDetails'

const ArticleTemplate = (props) => (
  <Layout>
    <div>
      <ArticleTemplateDetails {...props} />
    </div>
  </Layout>
)

export default ArticleTemplate

export const Head = ({ data }) => (
  <Seo
    title={`${data.kontentItemArticle.elements.title.value} - ${data.kontentItemSiteMetadata.elements.title.value}`}
    description={data.kontentItemArticle.elements.description.value}
  />
)

export const pageQuery = graphql`
  query ArticleBySlug($slug: String!) {
    kontentItemAuthor(system: { codename: { eq: "author" } }) {
      elements {
        bio {
          value
        }
        email {
          value
        }
        github {
          value
        }
        name {
          value
        }
        rss {
          value
        }
        telegram {
          value
        }
        twitter {
          value
        }
        vk {
          value
        }
        avatar_image {
          value {
            url
          }
        }
      }
    }
    kontentItemSiteMetadata(system: { codename: { eq: "site_metadata" } }) {
      elements {
        copyright {
          value
        }
        subtitle {
          value
        }
        title {
          value
        }
      }
    }
    kontentItemArticle(elements: { slug: { value: { eq: $slug } } }) {
      system {
        id
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
        }
        title {
          value
        }
      }
    }
  }
`
