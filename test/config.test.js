const {
  FIXTURE_DOMAIN,
  kontentSourceOptions,
  parseLanguageCodenames,
} = require('../config/kontent')

describe('kontentSourceOptions', () => {
  it('points offline builds at the fixture host with a fake project', () => {
    const options = kontentSourceOptions({
      KONTENT_OFFLINE: '1',
      KONTENT_PROJECT_ID: 'real-project',
    })
    expect(options.proxy).toEqual({ deliveryDomain: FIXTURE_DOMAIN })
    expect(options.projectId).not.toBe('real-project')
    expect(options.languageCodenames).toEqual(['en-US', 'cs-CZ'])
    expect(options.authorizationKey).toBeUndefined()
  })

  it('lets `gatsby serve` load the config without a project ID', () => {
    const options = kontentSourceOptions({ gatsby_executing_command: 'serve' })
    expect(options.proxy).toEqual({ deliveryDomain: FIXTURE_DOMAIN })
  })

  it('explains what to do when the project ID is missing', () => {
    expect(() => kontentSourceOptions({})).toThrow(/KONTENT_OFFLINE=1/)
  })

  it('uses the preview key only when preview is enabled', () => {
    const base = { KONTENT_PROJECT_ID: 'p', KONTENT_PREVIEW_KEY: 'k' }
    expect(kontentSourceOptions(base).authorizationKey).toBeUndefined()
    expect(kontentSourceOptions(base).usePreviewUrl).toBe(false)

    const preview = kontentSourceOptions({
      ...base,
      KONTENT_PREVIEW_ENABLED: ' TRUE ',
    })
    expect(preview.usePreviewUrl).toBe(true)
    expect(preview.authorizationKey).toBe('k')
  })

  it('refuses preview mode without a key', () => {
    expect(() =>
      kontentSourceOptions({
        KONTENT_PROJECT_ID: 'p',
        KONTENT_PREVIEW_ENABLED: 'true',
      })
    ).toThrow(/KONTENT_PREVIEW_KEY/)
  })
})

describe('parseLanguageCodenames', () => {
  it('trims the comma-separated list and drops empty entries', () => {
    expect(parseLanguageCodenames(' en-US, cs-CZ ,')).toEqual([
      'en-US',
      'cs-CZ',
    ])
  })

  it('falls back to en-US instead of crashing when unset', () => {
    expect(parseLanguageCodenames(undefined)).toEqual(['en-US'])
  })
})
