// Turns a Kontent backup (the Management API export in kontent-backup.zip)
// into the JSON the Delivery API returns from /types and /items-feed, so the
// real source plugin can build the site without a Kontent project.

const ASSET_URL_PREFIX = '/kontent-fixtures'

// Asset folders whose images are portraits of real people. Offline builds and
// screenshots show a neutral placeholder instead.
const PORTRAIT_FOLDERS = ['Author']
const PORTRAIT_PLACEHOLDER = {
  url: `${ASSET_URL_PREFIX}/author-placeholder.svg`,
  type: 'image/svg+xml',
  width: 160,
  height: 160,
}

const byId = (list) => new Map(list.map((entry) => [entry.id, entry]))

const assetZipPath = (asset) =>
  `files/${asset.id.slice(0, 3)}/${asset.id}/${asset.file_name}`

const indexBackup = (backup) => {
  const languages = byId(backup.languages)
  const types = byId(backup.contentTypes)
  const items = byId(backup.contentItems)
  const publishedStep = backup.workflowSteps.find(
    (step) => step.codename === 'published'
  )
  const portraitFolders = new Set(
    backup.assetFolders
      .filter((folder) => PORTRAIT_FOLDERS.includes(folder.name))
      .map((folder) => folder.id)
  )

  const assets = new Map(
    backup.assets.map((asset) => {
      const portrait = portraitFolders.has(asset.folder && asset.folder.id)
      const file = portrait
        ? PORTRAIT_PLACEHOLDER
        : {
            url: `${ASSET_URL_PREFIX}/${asset.id}/${asset.file_name}`,
            type: asset.type,
            width: asset.image_width,
            height: asset.image_height,
          }
      return [asset.id, { ...asset, ...file, portrait }]
    })
  )

  // Published variants keyed by `${itemId}:${languageId}`.
  const variants = new Map(
    backup.languageVariants
      .filter((variant) => variant.workflow_step.id === publishedStep.id)
      .map((variant) => [`${variant.item.id}:${variant.language.id}`, variant])
  )

  return { languages, types, items, assets, variants }
}

const assetDescription = (asset, languageId) => {
  const match = (asset.descriptions || []).find(
    (entry) => entry.language.id === languageId
  )
  return (match && match.description) || null
}

// Management API rich text references items and assets by id; the Delivery API
// resolves them to codenames and URLs and lists them alongside the HTML.
const convertRichText = (html, languageId, index) => {
  const images = {}
  const links = {}
  const linkedItems = []

  let value = html.replace(
    /<figure data-asset-id="([^"]+)"><img src="[^"]*" data-asset-id="\1"><\/figure>/g,
    (match, assetId) => {
      const asset = index.assets.get(assetId)
      if (!asset) return ''
      const description = assetDescription(asset, languageId)
      images[assetId] = {
        image_id: assetId,
        description,
        url: asset.url,
        width: asset.width,
        height: asset.height,
      }
      return `<figure data-asset-id="${assetId}" data-image-id="${assetId}"><img src="${asset.url}" data-asset-id="${assetId}" data-image-id="${assetId}" alt="${description || ''}"></figure>`
    }
  )

  value = value.replace(
    /<object type="application\/kenticocloud" data-type="item" data-id="([^"]+)"><\/object>/g,
    (match, itemId) => {
      const item = index.items.get(itemId)
      if (!item) return ''
      linkedItems.push(item.codename)
      return `<object type="application/kenticocloud" data-type="item" data-rel="link" data-codename="${item.codename}"></object>`
    }
  )

  value = value.replace(/<a data-item-id="([^"]+)"/g, (match, itemId) => {
    const item = index.items.get(itemId)
    if (item) {
      links[itemId] = {
        codename: item.codename,
        type: index.types.get(item.type.id).codename,
        url_slug: '',
      }
    }
    return `<a data-item-id="${itemId}" href=""`
  })

  return { value, images, links, modular_content: linkedItems }
}

const convertElement = (typeElement, rawValue, languageId, index) => {
  const base = { type: typeElement.type, name: typeElement.name }
  switch (typeElement.type) {
    case 'rich_text':
      return {
        ...base,
        ...convertRichText(rawValue || '<p><br></p>', languageId, index),
      }
    case 'modular_content':
      // Like the Delivery API, leave out linked items that have no published
      // variant (e.g. the archived "gatsby" category).
      return {
        ...base,
        value: (rawValue || [])
          .map((ref) => index.items.get(ref.id))
          .filter((item) => item && resolveVariant(item.id, languageId, index))
          .map((item) => item.codename),
      }
    case 'asset':
      return {
        ...base,
        value: (rawValue || [])
          .map((ref) => index.assets.get(ref.id))
          .filter(Boolean)
          .map((asset) => ({
            name: asset.portrait ? 'author-placeholder.svg' : asset.file_name,
            description: assetDescription(asset, languageId),
            type: asset.type,
            size: asset.portrait ? 0 : asset.size,
            url: asset.url,
            width: asset.width,
            height: asset.height,
            renditions: {},
          })),
      }
    case 'multiple_choice':
      return {
        ...base,
        value: (rawValue || [])
          .map((ref) =>
            typeElement.options.find((option) => option.id === ref.id)
          )
          .filter(Boolean)
          .map(({ name, codename }) => ({ name, codename })),
      }
    case 'date_time':
      return { ...base, value: rawValue || null, display_timezone: null }
    default:
      return { ...base, value: rawValue == null ? '' : rawValue }
  }
}

// The language variant the Delivery API would serve: the requested language,
// else the first published variant along the fallback chain.
const resolveVariant = (itemId, languageId, index) => {
  const seen = new Set()
  let current = index.languages.get(languageId)
  while (current && !seen.has(current.id)) {
    const variant = index.variants.get(`${itemId}:${current.id}`)
    if (variant) return { variant, language: current }
    seen.add(current.id)
    current = index.languages.get(
      current.fallback_language && current.fallback_language.id
    )
  }
  return null
}

const toDeliveryItem = (item, resolved, index) => {
  const type = index.types.get(item.type.id)
  const values = new Map(
    resolved.variant.elements.map((element) => [
      element.element.id,
      element.value,
    ])
  )
  return {
    system: {
      id: item.id,
      name: item.name,
      codename: item.codename,
      language: resolved.language.codename,
      type: type.codename,
      collection: 'default',
      sitemap_locations: [],
      last_modified: resolved.variant.last_modified,
      workflow_step: 'published',
    },
    elements: Object.fromEntries(
      type.elements
        .filter((element) => element.type !== 'guidelines')
        .map((element) => [
          element.codename,
          convertElement(
            element,
            values.get(element.id),
            resolved.language.id,
            index
          ),
        ])
    ),
  }
}

const toDeliveryType = (type) => ({
  system: {
    id: type.id,
    name: type.name,
    codename: type.codename,
    last_modified: type.last_modified,
  },
  elements: Object.fromEntries(
    type.elements
      .filter((element) => element.type !== 'guidelines')
      .map((element) => [
        element.codename,
        {
          type: element.type,
          name: element.name,
          ...(element.options
            ? {
                options: element.options.map(({ name, codename }) => ({
                  name,
                  codename,
                })),
              }
            : {}),
        },
      ])
  ),
})

const backupToDelivery = (backup) => {
  const index = indexBackup(backup)
  const languageByCodename = new Map(
    backup.languages.map((language) => [language.codename, language])
  )

  const itemsForLanguage = (codename) => {
    const language = languageByCodename.get(codename)
    if (!language) return []
    return backup.contentItems
      .map((item) => {
        const resolved = resolveVariant(item.id, language.id, index)
        return resolved && toDeliveryItem(item, resolved, index)
      })
      .filter(Boolean)
  }

  const assetFiles = [...index.assets.values()]
    .filter((asset) => !asset.portrait)
    .map((asset) => ({ url: asset.url, zipPath: assetZipPath(asset) }))

  return {
    languageCodenames: backup.languages
      .filter((language) => language.is_active)
      .map((language) => language.codename),
    deliveryTypes: backup.contentTypes.map(toDeliveryType),
    itemsForLanguage,
    assetFiles,
  }
}

const BACKUP_FILES = {
  languages: 'languages.json',
  contentTypes: 'contentTypes.json',
  contentItems: 'contentItems.json',
  languageVariants: 'languageVariants.json',
  assets: 'assets.json',
  assetFolders: 'assetFolders.json',
  workflowSteps: 'workflowSteps.json',
}

const readBackup = (zip) =>
  Object.fromEntries(
    Object.entries(BACKUP_FILES).map(([key, file]) => [key, zip.readJson(file)])
  )

module.exports = {
  ASSET_URL_PREFIX,
  PORTRAIT_PLACEHOLDER,
  backupToDelivery,
  readBackup,
}
