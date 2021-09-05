import React from 'react'
import Article from '../Article'

const CategoryTemplateDetails = ({ data, pageContext }) => (
  <div className="content">
    <div className="content__inner">
      <div className="page">
        <h1 className="page__title">{pageContext.categoryTitle}</h1>
        <div className="page__body">
          {data.allKontentItemArticle.nodes.map((article) => (
            <Article data={article} key={article.system.codename} />
          ))}
        </div>
      </div>
    </div>
  </div>
)

export default CategoryTemplateDetails
