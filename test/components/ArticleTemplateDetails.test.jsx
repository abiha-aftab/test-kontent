import React from 'react'
import { render, screen } from '@testing-library/react'
import ArticleTemplateDetails from '../../src/components/ArticleTemplateDetails'
import { article, author, siteMetadata, value } from '../content'

const pageData = (authorOverrides) => ({
  kontentItemSiteMetadata: siteMetadata,
  kontentItemAuthor: author(authorOverrides),
  kontentItemArticle: article(),
})

describe('ArticleTemplateDetails', () => {
  it('renders the title as the page heading and the rich text body', () => {
    render(<ArticleTemplateDetails data={pageData()} />)
    expect(
      screen.getByRole('heading', { level: 1, name: /Humane Typography/ })
    ).toBeInTheDocument()
    expect(screen.getByText('Body copy')).toBeInTheDocument()
  })

  it('links tags with a trailing slash', () => {
    render(<ArticleTemplateDetails data={pageData()} />)
    expect(screen.getByRole('link', { name: 'Design' })).toHaveAttribute(
      'href',
      '/tags/design/'
    )
  })

  it('shows the publication date', () => {
    const { container } = render(<ArticleTemplateDetails data={pageData()} />)
    expect(container.querySelector('time')).toHaveAttribute(
      'datetime',
      '2020-03-01'
    )
  })

  it('hides the Twitter link when the author has none', () => {
    render(<ArticleTemplateDetails data={pageData({ twitter: value('#') })} />)
    expect(screen.queryByRole('link', { name: /on Twitter/ })).toBeNull()
  })
})
