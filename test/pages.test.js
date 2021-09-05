const { planPages } = require('../config/pages')

const templates = {
  article: 'article.jsx',
  page: 'page.jsx',
  tag: 'tag.jsx',
  category: 'category.jsx',
}

const queryResult = (overrides = {}) => ({
  allKontentItemMenuItem: {
    nodes: [
      {
        elements: {
          slug: { value: 'about-me' },
          content: {
            value: [
              { preferred_language: 'en-US', system: { codename: 'about_me' } },
            ],
          },
        },
      },
      { elements: { slug: { value: 'empty' }, content: { value: [] } } },
    ],
  },
  allKontentItemArticle: {
    nodes: [{ elements: { slug: { value: 'humane-typography' } } }],
  },
  allKontentItemTag: {
    nodes: [
      {
        system: { codename: 'design' },
        elements: { slug: { value: 'design' }, title: { value: 'Design' } },
      },
    ],
  },
  allKontentItemCategory: {
    nodes: [
      {
        system: { codename: 'typography' },
        elements: {
          slug: { value: 'typography' },
          title: { value: 'Typography' },
        },
      },
    ],
  },
  ...overrides,
})

describe('planPages', () => {
  it('creates one page per menu item, article, tag and category', () => {
    const pages = planPages(queryResult(), templates)
    expect(pages.map((page) => page.path)).toEqual([
      '/about-me/',
      '/articles/humane-typography/',
      '/tags/design/',
      '/categories/typography/',
    ])
  })

  it('passes the context each template query needs', () => {
    const pages = planPages(queryResult(), templates)
    expect(pages[0]).toMatchObject({
      component: 'page.jsx',
      context: { language: 'en-US', codename: 'about_me' },
    })
    expect(pages[1].context).toEqual({ slug: 'humane-typography' })
    expect(pages[2].context).toEqual({
      tagCodename: 'design',
      tagTitle: 'Design',
    })
    expect(pages[3].context).toEqual({
      categoryCodename: 'typography',
      categoryTitle: 'Typography',
    })
  })

  it('skips menu items that have no linked page', () => {
    const paths = planPages(queryResult(), templates).map((page) => page.path)
    expect(paths).not.toContain('/empty/')
  })

  it('fails loudly when two items share a URL', () => {
    const duplicate = queryResult({
      allKontentItemArticle: {
        nodes: [
          { elements: { slug: { value: 'same' } } },
          { elements: { slug: { value: 'same' } } },
        ],
      },
    })
    expect(() => planPages(duplicate, templates)).toThrow(/\/articles\/same\//)
  })
})
