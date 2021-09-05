import React from 'react'
import { graphql } from 'gatsby'
import Layout from '../components/Layout'
import Seo from '../components/Seo'
import PageTemplateDetails from '../components/PageTemplateDetails'

const PageTemplate = (props) => (
  <Layout>
    <div>
      <PageTemplateDetails {...props} />
    </div>
  </Layout>
)

export default PageTemplate

export const Head = ({ data }) => (
  <Seo
    title={`${data.kontentItemSiteMetadata.elements.title.value} - ${data.kontentItemPage.elements.title.value}`}
    description={data.kontentItemPage.elements.meta_description.value}
  />
)

export const pageQuery = graphql`
  query PageQuery($codename: String!, $language: String!) {
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
    kontentItemPage(
      preferred_language: { eq: $language }
      system: { codename: { eq: $codename } }
    ) {
      id
      system {
        id
      }
      elements {
        description {
          value
        }
        meta_description {
          value
        }
        title {
          value
        }
      }
    }
  }
`
