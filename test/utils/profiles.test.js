import { profileUrl } from '../../src/utils/profiles'

describe('profileUrl', () => {
  it('treats empty and "#" handles as not set', () => {
    expect(profileUrl('twitter', '#')).toBeNull()
    expect(profileUrl('github', '  ')).toBeNull()
    expect(profileUrl('email', undefined)).toBeNull()
  })

  it('builds profile links from handles', () => {
    expect(profileUrl('twitter', '@kontent_ai')).toBe(
      'https://twitter.com/kontent_ai'
    )
    expect(profileUrl('telegram', 'johndoe')).toBe('https://t.me/johndoe')
    expect(profileUrl('email', 'john@example.com')).toBe(
      'mailto:john@example.com'
    )
  })

  it('ignores networks it does not know', () => {
    expect(profileUrl('myspace', 'tom')).toBeNull()
  })
})
