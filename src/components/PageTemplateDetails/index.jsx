import React from 'react'
import Sidebar from '../Sidebar'

const PageTemplateDetails = ({ data }) => {
  const page = data.kontentItemPage

  return (
    <div>
      <Sidebar />
      <main className="content" id="main">
        <div className="content__inner">
          <div className="page" data-kontent-item-id={page.system.id}>
            <h1 className="page__title" data-kontent-element-codename="title">
              {page.elements.title.value}
            </h1>
            <div
              className="page__body"
              // Rich text authored in Kontent, rendered as delivered.
              dangerouslySetInnerHTML={{
                __html: page.elements.description.value,
              }}
              data-kontent-element-codename="description"
            />
          </div>
        </div>
      </main>
    </div>
  )
}

export default PageTemplateDetails
