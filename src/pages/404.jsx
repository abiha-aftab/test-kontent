import React from 'react'
import { graphql } from 'gatsby'
import Sidebar from '../components/Sidebar'
import Layout from '../components/Layout'
import Seo from '../components/Seo'

const NotFoundRoute = ({ data }) => (
  <Layout>
    <div>
      <Sidebar />
      <main className="content" id="main">
        <div className="content__inner">
          <div className="page">
            <h1 className="page__title">Page not found</h1>
            <div className="page__body">
              <p>
                {
                  data.kontentItemSiteMetadata.elements.page_not_found_message
                    .value
                }
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  </Layout>
)

export default NotFoundRoute

export const Head = () => <Seo title="Not found" />

export const pageQuery = graphql`
  query NotFoundQuery {
    kontentItemSiteMetadata(system: { codename: { eq: "site_metadata" } }) {
      elements {
        page_not_found_message {
          value
        }
      }
    }
  }
`
