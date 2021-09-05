import React from 'react'
import { render, screen } from '@testing-library/react'
import { useStaticQuery } from 'gatsby'
import Sidebar from '../../src/components/Sidebar'
import { author, menu, siteMetadata, value } from '../content'

const mockQuery = (authorOverrides) =>
  useStaticQuery.mockReturnValue({
    kontentItemSiteMetadata: siteMetadata,
    kontentItemMenu: menu,
    kontentItemAuthor: author(authorOverrides),
  })

describe('Sidebar', () => {
  it('describes the avatar with the author name', () => {
    mockQuery()
    render(<Sidebar />)
    expect(screen.getByRole('img', { name: 'John Doe' })).toBeInTheDocument()
  })

  it('still renders when the author has no avatar', () => {
    mockQuery({ avatar_image: value([]) })
    render(<Sidebar />)
    expect(screen.queryByRole('img')).toBeNull()
    expect(screen.getByText('Writes about letters.')).toBeInTheDocument()
  })

  it('uses a level-one heading only on the home page', () => {
    mockQuery()
    const { rerender } = render(<Sidebar isHomePage />)
    expect(
      screen.getByRole('heading', { level: 1, name: 'John Doe' })
    ).toBeInTheDocument()
    rerender(<Sidebar />)
    expect(screen.queryByRole('heading', { level: 1 })).toBeNull()
  })

  it('links menu items to their pages', () => {
    mockQuery()
    render(<Sidebar />)
    expect(screen.getByRole('link', { name: 'About me' })).toHaveAttribute(
      'href',
      '/about-me/'
    )
    expect(screen.getByRole('link', { name: 'Articles' })).toHaveAttribute(
      'href',
      '/'
    )
  })
})
