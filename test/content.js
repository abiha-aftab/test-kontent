// Small hand-written query results shaped like the Gatsby nodes the
// components receive.
const value = (v) => ({ value: v })

const category = (slug, title) => ({
  system: { codename: slug.replace(/-/g, '_') },
  elements: { slug: value(slug), title: value(title) },
})

const tag = (slug, title) => ({
  system: { codename: slug.replace(/-/g, '_') },
  elements: { slug: value(slug), title: value(title) },
})

const article = (overrides = {}) => ({
  system: { id: 'article-1', codename: 'humane_typography' },
  elements: {
    title: value('Humane Typography in the Digital Age'),
    description: value('Why type should feel written by hand.'),
    date: value('2020-03-01T00:00:00Z'),
    slug: value('humane-typography'),
    category: value([category('typography', 'Typography')]),
    tags: value([tag('design', 'Design'), tag('web-development', 'Web')]),
    content: value('<p>Body copy</p>'),
    ...overrides,
  },
})

const author = (overrides = {}) => ({
  system: { id: 'author-1' },
  elements: {
    name: value('John Doe'),
    bio: value('Writes about letters.'),
    avatar_image: value([{ url: '/avatar.svg' }]),
    email: value('john@example.com'),
    telegram: value('#'),
    twitter: value('johndoe'),
    github: value('#'),
    rss: value('#'),
    vk: value('#'),
    ...overrides,
  },
})

const siteMetadata = {
  elements: {
    title: value('Blog by John Doe!'),
    subtitle: value('Notes on type and the web.'),
    copyright: value('© All rights reserved.'),
    page_not_found_message: value('Nothing here.'),
  },
}

const menu = {
  elements: {
    menu_items: value([
      { id: 'm1', elements: { label: value('Articles'), slug: value('/') } },
      {
        id: 'm2',
        elements: { label: value('About me'), slug: value('about-me') },
      },
    ]),
  },
}

module.exports = { article, author, category, menu, siteMetadata, tag, value }
