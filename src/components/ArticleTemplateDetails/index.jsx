import React from 'react'
import { Link } from 'gatsby'
import { RichTextElement } from '@kontent-ai/gatsby-components'
import { formatLongDate, toDateAttribute } from '../../utils/date'
import { tagPath } from '../../utils/paths'
import { profileUrl } from '../../utils/profiles'
import './style.scss'

const ArticleTemplateDetails = ({ data }) => {
  const subtitle = data.kontentItemSiteMetadata.elements.subtitle.value
  const author = data.kontentItemAuthor.elements
  const article = data.kontentItemArticle.elements
  const tags = article.tags.value.filter(Boolean)
  const twitterUrl = profileUrl('twitter', author.twitter.value)

  return (
    <div>
      <div>
        <Link className="article-single__home-button" to="/">
          All Articles
        </Link>
      </div>
      <div
        className="article-single"
        data-kontent-item-id={data.kontentItemArticle.system.id}
      >
        <div className="article-single__inner">
          <h1
            className="article-single__title"
            data-kontent-element-codename="title"
          >
            {article.title.value}
          </h1>
          <div
            data-kontent-element-codename="content"
            className="article-single__body"
          >
            <RichTextElement value={article.content.value} />
          </div>
        </div>
        <div
          className="article-single__date"
          data-kontent-element-codename="date"
        >
          <em>
            Published{' '}
            <time dateTime={toDateAttribute(article.date.value)}>
              {formatLongDate(article.date.value)}
            </time>
          </em>
        </div>
        <div className="article-single__footer">
          {tags.length > 0 && (
            <div className="article-single__tags">
              <ul className="article-single__tags-list">
                {tags.map((tag) => (
                  <li
                    className="article-single__tags-list-item"
                    key={tag.system.codename}
                  >
                    <Link
                      to={tagPath(tag.elements.slug.value)}
                      className="article-single__tags-list-item-link"
                    >
                      {tag.elements.title.value}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <hr />
          <p className="article-single__footer-text">
            {subtitle}
            {twitterUrl && (
              <a href={twitterUrl} target="_blank" rel="noopener noreferrer">
                <br /> <strong>{author.name.value}</strong> on Twitter
              </a>
            )}
          </p>
        </div>
      </div>
    </div>
  )
}

export default ArticleTemplateDetails
