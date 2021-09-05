import React from 'react'
import { render, screen } from '@testing-library/react'
import Links from '../../src/components/Links'
import { author, value } from '../content'

describe('Links', () => {
  it('renders only the profiles that are set, with accessible names', () => {
    render(<Links data={author()} />)
    expect(screen.getByRole('link', { name: 'Twitter' })).toHaveAttribute(
      'href',
      'https://twitter.com/johndoe'
    )
    expect(screen.getByRole('link', { name: 'Email' })).toHaveAttribute(
      'href',
      'mailto:john@example.com'
    )
    expect(screen.queryByRole('link', { name: 'GitHub' })).toBeNull()
    expect(screen.queryByRole('link', { name: 'Telegram' })).toBeNull()
  })

  it('opens external profiles in a new tab safely', () => {
    render(<Links data={author()} />)
    expect(screen.getByRole('link', { name: 'Twitter' })).toHaveAttribute(
      'rel',
      'noopener noreferrer'
    )
  })

  it('renders nothing when no profile is set', () => {
    const { container } = render(
      <Links data={author({ twitter: value('#'), email: value('') })} />
    )
    expect(container).toBeEmptyDOMElement()
  })
})
