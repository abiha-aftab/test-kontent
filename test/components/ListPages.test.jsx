import React from 'react'
import { render, screen } from '@testing-library/react'
import { useStaticQuery } from 'gatsby'
import CategoryTemplateDetails from '../../src/components/CategoryTemplateDetails'
import TagTemplateDetails from '../../src/components/TagTemplateDetails'
import CategoriesRoute from '../../src/pages/categories'
import TagsRoute from '../../src/pages/tags'
import { article, author, menu, siteMetadata, value } from '../content'

beforeEach(() => {
  useStaticQuery.mockReturnValue({
    kontentItemSiteMetadata: siteMetadata,
    kontentItemMenu: menu,
    kontentItemAuthor: author(),
    site: {
      siteMetadata: {
        kontentEnvironmentId: 'env',
        kontentLanguageCodename: 'en-US',
      },
    },
  })
})

const articles = { allKontentItemArticle: { nodes: [article()] } }

describe('CategoryTemplateDetails', () => {
  it('uses the category title as the page heading', () => {
    render(
      <CategoryTemplateDetails
        data={articles}
        pageContext={{ categoryTitle: 'Typography' }}
      />
    )
    expect(
      screen.getByRole('heading', { level: 1, name: 'Typography' })
    ).toBeInTheDocument()
  })
})

describe('TagTemplateDetails', () => {
  it('names the tag in the heading and lists its articles', () => {
    render(
      <TagTemplateDetails
        data={articles}
        pageContext={{ tagTitle: 'Design' }}
      />
    )
    expect(
      screen.getByRole('heading', { level: 1, name: /tagged as "Design"/ })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: /Humane Typography/ })
    ).toBeInTheDocument()
  })
})

describe('categories page', () => {
  it('lists categories by title with their article count', () => {
    render(
      <CategoriesRoute
        data={{
          kontentItemSiteMetadata: siteMetadata,
          allKontentItemCategory: {
            nodes: [
              {
                system: { id: 'c1', codename: 'design_inspiration' },
                elements: {
                  slug: value('design-inspiration'),
                  title: value('Design Inspiration'),
                },
                used_by_articles: [{}, {}],
              },
            ],
          },
        }}
      />
    )
    const link = screen.getByRole('link', { name: /Design Inspiration/ })
    expect(link).toHaveTextContent('Design Inspiration (2)')
    expect(link).toHaveAttribute('href', '/categories/design-inspiration/')
  })
})

describe('tags page', () => {
  it('lists tags with their article count', () => {
    render(
      <TagsRoute
        data={{
          kontentItemSiteMetadata: siteMetadata,
          allKontentItemTag: {
            nodes: [
              {
                system: { id: 't1', codename: 'design' },
                elements: { slug: value('design'), title: value('Design') },
                used_by_articles: [{}],
              },
            ],
          },
        }}
      />
    )
    expect(screen.getByRole('link', { name: /Design/ })).toHaveAttribute(
      'href',
      '/tags/design/'
    )
  })
})
