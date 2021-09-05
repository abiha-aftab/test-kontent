import React from 'react'
import ArticleList from '../ArticleList'

const TagTemplateDetails = ({ data, pageContext }) => (
  <main className="content" id="main">
    <div className="content__inner">
      <div className="page">
        <h1 className="page__title">
          All Articles tagged as &quot;{pageContext.tagTitle}&quot;
        </h1>
        <div className="page__body">
          <ArticleList
            articles={data.allKontentItemArticle.nodes}
            emptyMessage="No articles with this tag yet."
          />
        </div>
      </div>
    </div>
  </main>
)

export default TagTemplateDetails
