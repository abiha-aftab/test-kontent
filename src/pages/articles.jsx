import React from 'react'
import { graphql } from 'gatsby'
import Layout from '../components/Layout'
import Seo from '../components/Seo'
import ArticleList from '../components/ArticleList'
import Sidebar from '../components/Sidebar'

const ArticlesRoute = ({ data }) => (
  <Layout>
    <div>
      <Sidebar />
      <main className="content" id="main">
        <div className="content__inner">
          <h1 className="page__title">Articles</h1>
          <ArticleList articles={data.allKontentItemArticle.nodes} />
        </div>
      </main>
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
