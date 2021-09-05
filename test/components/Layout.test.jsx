import React from 'react'
import { render, screen } from '@testing-library/react'
import { useStaticQuery } from 'gatsby'
import KontentSmartLink from '@kontent-ai/smart-link'
import Layout from '../../src/components/Layout'

beforeEach(() => {
  useStaticQuery.mockReturnValue({
    site: {
      siteMetadata: {
        kontentEnvironmentId: 'env-id',
        kontentLanguageCodename: 'en-US',
      },
    },
  })
})

describe('Layout', () => {
  it('starts with a skip link to the main content', () => {
    render(<Layout>content</Layout>)
    expect(
      screen.getByRole('link', { name: 'Skip to content' })
    ).toHaveAttribute('href', '#main')
  })

  it('tells Smart Link which environment and language the page uses', () => {
    const { container } = render(<Layout>content</Layout>)
    expect(container.firstChild).toHaveAttribute(
      'data-kontent-environment-id',
      'env-id'
    )
    expect(container.firstChild).toHaveAttribute(
      'data-kontent-language-codename',
      'en-US'
    )
  })

  it('initialises Smart Link once, not on every render', () => {
    KontentSmartLink.initialize.mockClear()
    const { rerender } = render(<Layout>one</Layout>)
    rerender(<Layout>two</Layout>)
    expect(KontentSmartLink.initialize).toHaveBeenCalledTimes(1)
  })
})
