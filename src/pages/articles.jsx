import React from 'react'
import { graphql } from 'gatsby'
import Layout from '../components/Layout'
import Seo from '../components/Seo'
import Article from '../components/Article'
import Sidebar from '../components/Sidebar'

const ArticlesRoute = ({ data }) => (
  <Layout>
    <div>
      <Sidebar />
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

export default ArticlesRoute

export const Head = ({ data }) => (
  <Seo
    title={data.kontentItemSiteMetadata.elements.title.value}
    description={data.kontentItemSiteMetadata.elements.subtitle.value}
  />
)

export const pageQuery = graphql`
  query ArticlesQuery {
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
