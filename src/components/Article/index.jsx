import React from 'react'
import { Link } from 'gatsby'
import { formatMonthYear, toDateAttribute } from '../../utils/date'
import { articlePath, categoryPath } from '../../utils/paths'
import './style.scss'

const Article = ({ data }) => {
  const { elements, system } = data
  const date = elements.date.value
  // Linked items that are unpublished come through as null.
  const categories = elements.category.value.filter(Boolean)
  const path = articlePath(elements.slug.value)

  return (
    <div className="article" data-kontent-item-id={system && system.id}>
      <div className="article__meta">
        <time
          className="article__meta-time"
          dateTime={toDateAttribute(date)}
          data-kontent-element-codename="date"
        >
          {formatMonthYear(date)}
        </time>
        <span className="article__meta-divider" />
        <span
          data-kontent-element-codename="category"
          data-kontent-add-button
          data-kontent-add-button-insert-position="end"
          data-kontent-add-button-render-position="right-end"
        >
          {categories.map((category) => (
            <span
              className="article__meta-category"
              key={category.elements.slug.value}
            >
              <Link
                to={categoryPath(category.elements.slug.value)}
                className="article__meta-category-link"
              >
                {category.elements.title.value}
              </Link>
            </span>
          ))}
        </span>
      </div>
      <h2 className="article__title" data-kontent-element-codename="title">
        <Link className="article__title-link" to={path}>
          {elements.title.value}
        </Link>
      </h2>
      <p
        className="article__description"
        data-kontent-element-codename="description"
      >
        {elements.description.value}
      </p>
      <Link className="article__readmore" to={path}>
        Read
      </Link>
    </div>
  )
}

export default Article
