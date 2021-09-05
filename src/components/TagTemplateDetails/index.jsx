import React from 'react'
import Article from '../Article'

const TagTemplateDetails = ({ data, pageContext }) => (
  <div className="content">
    <div className="content__inner">
      <div className="page">
        <h1 className="page__title">
          All Articles tagged as &quot;{pageContext.tagTitle}&quot;
        </h1>
        <div className="page__body">
          {data.allKontentItemArticle.nodes.map((article) => (
            <Article data={article} key={article.elements.slug.value} />
          ))}
        </div>
      </div>
    </div>
  </div>
)

export default TagTemplateDetails
