import React from 'react'
import { render, screen } from '@testing-library/react'
import Article from '../../src/components/Article'
import { article, value } from '../content'

describe('Article', () => {
  it('links the title and read-more to the article page', () => {
    render(<Article data={article()} />)
    expect(
      screen.getByRole('link', { name: 'Humane Typography in the Digital Age' })
    ).toHaveAttribute('href', '/articles/humane-typography/')
  })

  it('gives the date a machine-readable datetime', () => {
    const { container } = render(<Article data={article()} />)
    const time = container.querySelector('time')
    expect(time).toHaveTextContent('March 2020')
    expect(time).toHaveAttribute('datetime', '2020-03-01')
  })

  it('links each category with its title', () => {
    render(<Article data={article()} />)
    expect(screen.getByRole('link', { name: 'Typography' })).toHaveAttribute(
      'href',
      '/categories/typography/'
    )
  })

  it('skips categories that resolved to null', () => {
    render(<Article data={article({ category: value([null]) })} />)
    expect(screen.queryByRole('link', { name: 'Typography' })).toBeNull()
  })
})
