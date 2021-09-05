// Builds the Kontent source plugin options from environment variables.
// Kept out of gatsby-config.js so the rules can be unit tested.

// Offline builds point the source plugin at a reserved `.invalid` host. The
// kontent-offline plugin answers those requests from kontent-backup.zip; if it
// were ever missing, the requests would fail DNS instead of reaching Kontent.
const FIXTURE_DOMAIN = 'kontent-fixtures.invalid'
const OFFLINE_PROJECT_ID = '00000000-0000-4000-8000-000000000000'
const BACKUP_FILE = 'kontent-backup.zip'
const FIXTURE_LANGUAGES = ['en-US', 'cs-CZ']

const isOfflineMode = (env) => ['1', 'true'].includes(env.KONTENT_OFFLINE)

// `gatsby serve` only serves public/, but it still loads gatsby-config.js.
// It never sources content, so it must not demand a project ID.
const isServeCommand = (env) => env.gatsby_executing_command === 'serve'

const isPreviewEnabled = (env) =>
  (env.KONTENT_PREVIEW_ENABLED || '').trim().toLowerCase() === 'true'

const parseLanguageCodenames = (raw) => {
  const codenames = (raw || '')
    .split(',')
    .map((codename) => codename.trim())
    .filter(Boolean)
  return codenames.length ? codenames : ['en-US']
}

const kontentSourceOptions = (env) => {
  if (isOfflineMode(env) || isServeCommand(env)) {
    return {
      projectId: OFFLINE_PROJECT_ID,
      languageCodenames: FIXTURE_LANGUAGES,
      proxy: { deliveryDomain: FIXTURE_DOMAIN },
    }
  }
  if (!env.KONTENT_PROJECT_ID) {
    throw new Error(
      'KONTENT_PROJECT_ID is not set. Copy .env.template to .env and fill it ' +
        'in, or set KONTENT_OFFLINE=1 to build from kontent-backup.zip.'
    )
  }
  const preview = isPreviewEnabled(env)
  if (preview && !env.KONTENT_PREVIEW_KEY) {
    throw new Error(
      'KONTENT_PREVIEW_ENABLED is true but KONTENT_PREVIEW_KEY is empty.'
    )
  }
  return {
    projectId: env.KONTENT_PROJECT_ID,
    languageCodenames: parseLanguageCodenames(env.KONTENT_LANGUAGE_CODENAMES),
    usePreviewUrl: preview,
    authorizationKey: preview ? env.KONTENT_PREVIEW_KEY : undefined,
    experimental: { managementApiTriggersUpdate: true },
  }
}

module.exports = {
  BACKUP_FILE,
  FIXTURE_DOMAIN,
  FIXTURE_LANGUAGES,
  isOfflineMode,
  isPreviewEnabled,
  kontentSourceOptions,
  parseLanguageCodenames,
}
