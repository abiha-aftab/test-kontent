import React, { useEffect } from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import KontentSmartLink from '@kontent-ai/smart-link'
import '../../assets/scss/init.scss'

const Layout = ({ children }) => {
  const { site } = useStaticQuery(graphql`
    query LayoutQuery {
      site {
        siteMetadata {
          kontentEnvironmentId
          kontentLanguageCodename
        }
      }
    }
  `)

  useEffect(() => {
    const smartLink = KontentSmartLink.initialize({
      queryParam: 'preview-mode',
    })
    return () => smartLink.destroy()
  }, [])

  return (
    <div
      className="layout"
      data-kontent-environment-id={site.siteMetadata.kontentEnvironmentId}
      data-kontent-language-codename={site.siteMetadata.kontentLanguageCodename}
    >
      {children}
    </div>
  )
}

export default Layout
