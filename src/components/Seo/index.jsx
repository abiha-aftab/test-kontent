import React from 'react'

// Rendered from each page's Gatsby `Head` export.
const Seo = ({ title, description }) => (
  <>
    <html lang="en" />
    <title>{title}</title>
    {description && <meta name="description" content={description} />}
    <link rel="icon" href="/favicon.ico" type="image/x-icon" />
  </>
)

export default Seo
