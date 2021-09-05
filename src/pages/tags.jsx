import React from 'react'
import { Link, graphql } from 'gatsby'
import Layout from '../components/Layout'
import Seo from '../components/Seo'
import Sidebar from '../components/Sidebar'
import { tagPath } from '../utils/paths'

const TagsRoute = ({ data }) => {
  const tags = data.allKontentItemTag.nodes

  return (
    <Layout>
      <div>
        <Sidebar />
        <div className="content">
          <div className="content__inner">
            <div className="page">
              <h1 className="page__title">Tags</h1>
              <div className="page__body">
                <div className="tags">
                  <ul className="tags__list">
                    {tags.map((tag) => (
                      <li
                        key={tag.system.codename}
                        className="tags__list-item"
                        data-kontent-item-id={tag.system.id}
                        data-kontent-element-codename="title"
                      >
                        <Link
                          to={tagPath(tag.elements.slug.value)}
                          className="tags__list-item-link"
                        >
                          {tag.elements.title.value} (
                          {tag.used_by_articles.length})
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default TagsRoute

export const Head = ({ data }) => (
  <Seo
    title={`All Tags - ${data.kontentItemSiteMetadata.elements.title.value}`}
  />
)

export const pageQuery = graphql`
  {
    kontentItemSiteMetadata(system: { codename: { eq: "site_metadata" } }) {
      elements {
        title {
          value
        }
      }
    }
    allKontentItemTag(filter: { preferred_language: { eq: "en-US" } }) {
      nodes {
        system {
          id
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
        used_by_articles {
          system {
            codename
          }
        }
      }
    }
  }
`
