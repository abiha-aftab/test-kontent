import React from 'react'
import { graphql } from 'gatsby'
import Layout from '../components/Layout'
import Seo from '../components/Seo'
import Article from '../components/Article'
import Sidebar from '../components/Sidebar'

const IndexRoute = ({ data }) => (
  <Layout>
    <div>
      <Sidebar isHomePage />
      <div className="content">
        <div className="content__inner">
          {data.allKontentItemArticle.nodes.map((article) => (
            <Article data={article} key={article.elements.slug.value} />
          ))}
        </div>
      </div>
    </div>
  </Layout>
)

export default IndexRoute

export const Head = ({ data }) => (
  <Seo
    title={data.kontentItemSiteMetadata.elements.title.value}
    description={data.kontentItemSiteMetadata.elements.subtitle.value}
  />
)

export const pageQuery = graphql`
  query IndexQuery {
    kontentItemSiteMetadata(system: { codename: { eq: "site_metadata" } }) {
      elements {
        subtitle {
          value
        }
        title {
          value
        }
      }
    }
    allKontentItemArticle(
      filter: { preferred_language: { eq: "en-US" } }
      sort: { elements: { date: { value: DESC } } }
    ) {
      nodes {
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
  }
`
