import React from 'react'
import Article from '../Article'

const ArticleList = ({
  articles,
  emptyMessage = 'No articles published yet.',
}) =>
  articles.length === 0 ? (
    <p className="empty-state">{emptyMessage}</p>
  ) : (
    articles.map((article) => (
      <Article data={article} key={article.elements.slug.value} />
    ))
  )

export default ArticleList
