import React from 'react'
import { Link, graphql } from 'gatsby'
import Layout from '../components/Layout'
import Seo from '../components/Seo'
import Sidebar from '../components/Sidebar'

const CategoriesRoute = ({ data }) => {
  const categories = data.allKontentItemCategory.nodes

  return (
    <Layout>
      <div>
        <Sidebar />
        <div className="content">
          <div className="content__inner">
            <div className="page">
              <h1 className="page__title">Categories</h1>
              <div className="page__body">
                <div className="categories">
                  <ul className="categories__list">
                    {categories.map((category) => (
                      <li
                        key={category.system.codename}
                        className="categories__list-item"
                        data-kontent-item-id={category.system.id}
                        data-kontent-element-codename="title"
                      >
                        <Link
                          to={`/categories/${category.elements.slug.value}/`}
                          className="categories__list-item-link"
                        >
                          {category.elements.slug.value} (
                          {category.used_by_articles.length})
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

export default CategoriesRoute

export const Head = ({ data }) => (
  <Seo
    title={`All Categories - ${data.kontentItemSiteMetadata.elements.title.value}`}
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
    allKontentItemCategory(filter: { preferred_language: { eq: "en-US" } }) {
      nodes {
        elements {
          slug {
            value
          }
          title {
            value
          }
        }
        used_by_articles {
          system {
            codename
          }
        }
        system {
          id
          codename
        }
      }
    }
  }
`
