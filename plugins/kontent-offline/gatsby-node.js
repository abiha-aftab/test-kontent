const fs = require('fs')
const path = require('path')
const { createDeliveryAdapter } = require('./delivery-adapter')
const { readZip } = require('./read-zip')
const {
  PORTRAIT_PLACEHOLDER,
  backupToDelivery,
  readBackup,
} = require('./backup-to-delivery')

const ROOT = path.resolve(__dirname, '../..')

const loadFixtures = (backupFile) => {
  const zip = readZip(fs.readFileSync(path.resolve(ROOT, backupFile)))
  return { zip, fixtures: backupToDelivery(readBackup(zip)) }
}

// The source plugin calls its own copy of axios, so the adapter has to be
// installed on that exact module instance.
const sourcePluginAxios = (sourcePlugin) => {
  const pluginDir = path.dirname(
    require.resolve(`${sourcePlugin}/package.json`)
  )
  return require(require.resolve('axios', { paths: [pluginDir] }))
}

exports.onPreInit = (_, { sourcePlugin, backupFile }) => {
  const { fixtures } = loadFixtures(backupFile)
  sourcePluginAxios(sourcePlugin).defaults.adapter =
    createDeliveryAdapter(fixtures)
}

exports.onPreBootstrap = (_, { backupFile }) => {
  const { zip, fixtures } = loadFixtures(backupFile)
  const publicDir = path.join(ROOT, 'public')
  const write = (url, contents) => {
    const target = path.join(publicDir, url)
    fs.mkdirSync(path.dirname(target), { recursive: true })
    fs.writeFileSync(target, contents)
  }
  for (const { url, zipPath } of fixtures.assetFiles) {
    write(url, zip.read(zipPath))
  }
  write(
    PORTRAIT_PLACEHOLDER.url,
    fs.readFileSync(path.join(__dirname, 'author-placeholder.svg'))
  )
}
