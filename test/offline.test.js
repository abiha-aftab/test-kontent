/**
 * @jest-environment node
 */
const fs = require('fs')
const path = require('path')
const { FIXTURE_DOMAIN } = require('../config/kontent')
const { readZip } = require('../plugins/kontent-offline/read-zip')
const {
  PORTRAIT_PLACEHOLDER,
  backupToDelivery,
  readBackup,
} = require('../plugins/kontent-offline/backup-to-delivery')
const {
  createDeliveryAdapter,
} = require('../plugins/kontent-offline/delivery-adapter')

const zip = readZip(
  fs.readFileSync(path.join(__dirname, '..', 'kontent-backup.zip'))
)
const fixtures = backupToDelivery(readBackup(zip))
const english = fixtures.itemsForLanguage('en-US')
const item = (codename, items = english) =>
  items.find((entry) => entry.system.codename === codename)

describe('readZip', () => {
  it('lists and inflates entries of the demo export', () => {
    expect(zip.names()).toContain('contentItems.json')
    expect(zip.readJson('metadata.json').dataOverview.contentItemsCount).toBe(
      27
    )
  })

  it('reads binary assets byte for byte', () => {
    const image = zip.read(
      'files/c57/c57b89bd-1939-4493-bcfe-db0a5bac1e42/type-through-time.jpg'
    )
    expect(image.length).toBe(88921)
    expect(image.subarray(0, 2)).toEqual(Buffer.from([0xff, 0xd8]))
  })

  it('rejects files that are not ZIP archives', () => {
    expect(() => readZip(Buffer.alloc(64))).toThrow(/Not a ZIP archive/)
  })
})

describe('backupToDelivery', () => {
  it('describes every content type in Delivery API shape', () => {
    const article = fixtures.deliveryTypes.find(
      (type) => type.system.codename === 'article'
    )
    expect(Object.keys(article.elements)).toEqual([
      'title',
      'description',
      'content',
      'date',
      'category',
      'tags',
      'slug',
    ])
    expect(article.elements.date.type).toBe('date_time')
  })

  it('serves only published variants', () => {
    expect(english).toHaveLength(26)
    expect(item('gatsby_92b8911')).toBeUndefined()
  })

  it('drops links to unpublished items, as the Delivery API does', () => {
    expect(item('upgraded_to_gatsby_v3').elements.category.value).toEqual([])
    expect(
      item('perfecting_the_art_of_perfection').elements.category.value
    ).toEqual(['design_inspiration'])
  })

  it('resolves rich-text images to served asset URLs', () => {
    const content = item('perfecting_the_art_of_perfection').elements.content
    const [image] = Object.values(content.images)
    expect(image.url).toMatch(/^\/kontent-fixtures\/[0-9a-f-]+\/1\.jpg$/)
    expect(content.value).toContain(`src="${image.url}"`)
    expect(content.value).not.toContain('src="#"')
  })

  it('replaces the author portrait with a placeholder', () => {
    const [avatar] = item('author').elements.avatar_image.value
    expect(avatar.url).toBe(PORTRAIT_PLACEHOLDER.url)
    expect(
      fixtures.assetFiles.some((file) => file.zipPath.includes('radek'))
    ).toBe(false)
  })

  it('falls back to English for items without a Czech variant', () => {
    const czech = fixtures.itemsForLanguage('cs-CZ')
    expect(czech).toHaveLength(english.length)
    expect(item('typography', czech).system.language).toBe('cs-CZ')
    expect(item('author', czech).system.language).toBe('en-US')
  })

  it('returns nothing for unknown languages', () => {
    expect(fixtures.itemsForLanguage('de-DE')).toEqual([])
  })
})

describe('createDeliveryAdapter', () => {
  const adapter = createDeliveryAdapter(fixtures)
  const base = `https://${FIXTURE_DOMAIN}/00000000-0000-4000-8000-000000000000`

  it('answers the items feed from fixtures', async () => {
    const response = await adapter({ url: `${base}/items-feed?language=en-US` })
    expect(response.status).toBe(200)
    expect(response.data.items).toHaveLength(english.length)
  })

  it('answers the types endpoint', async () => {
    const response = await adapter({ url: `${base}/types` })
    expect(response.data.types).toHaveLength(10)
  })

  it('never lets a request through to Kontent', async () => {
    await expect(
      adapter({ url: 'https://deliver.kontent.ai/p/items-feed' })
    ).rejects.toThrow(/blocked a request to https:\/\/deliver.kontent.ai/)
  })
})
