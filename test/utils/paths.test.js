import {
  articlePath,
  categoryPath,
  menuItemPath,
  tagPath,
} from '../../src/utils/paths'

describe('paths', () => {
  it('always ends section URLs with a slash', () => {
    expect(articlePath('humane-typography')).toBe(
      '/articles/humane-typography/'
    )
    expect(tagPath('design')).toBe('/tags/design/')
    expect(categoryPath('/typography/')).toBe('/categories/typography/')
  })

  it('maps the "/" menu slug to the home page', () => {
    expect(menuItemPath('/')).toBe('/')
    expect(menuItemPath('about-me')).toBe('/about-me/')
    expect(menuItemPath('/contact')).toBe('/contact/')
  })
})
