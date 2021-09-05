import React from 'react'
import ArticleList from '../ArticleList'

const CategoryTemplateDetails = ({ data, pageContext }) => (
  <main className="content" id="main">
    <div className="content__inner">
      <div className="page">
        <h1 className="page__title">{pageContext.categoryTitle}</h1>
        <div className="page__body">
          <ArticleList
            articles={data.allKontentItemArticle.nodes}
            emptyMessage="No articles in this category yet."
          />
        </div>
      </div>
    </div>
  </main>
)

export default CategoryTemplateDetails
