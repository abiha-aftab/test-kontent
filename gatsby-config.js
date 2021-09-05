const lost = require('lost')
const pxtorem = require('postcss-pxtorem')

const url = 'https://gatsby-starter-kontent-lumen.netlify.com/'

require('dotenv').config()

const {
  BACKUP_FILE,
  isOfflineMode,
  kontentSourceOptions,
} = require('./config/kontent')

const KONTENT_SOURCE_PLUGIN = '@kontent-ai/gatsby-source'
const offline = isOfflineMode(process.env)
const kontentOptions = kontentSourceOptions(process.env)

module.exports = {
  // These properties are used by gatsby-plugin-sitemap
  // https://www.gatsbyjs.org/packages/gatsby-plugin-sitemap/#how-to-use
  siteMetadata: {
    url,
    siteUrl: url,
    // Read by Kontent Smart Link to open items in the Web Spotlight editor.
    kontentEnvironmentId: kontentOptions.projectId,
    kontentLanguageCodename: kontentOptions.languageCodenames[0],
  },
  plugins: [
    ...(offline
      ? [
          {
            resolve: 'kontent-offline', // local plugin
            options: {
              sourcePlugin: KONTENT_SOURCE_PLUGIN,
              backupFile: BACKUP_FILE,
            },
          },
        ]
      : []),
    {
      resolve: KONTENT_SOURCE_PLUGIN,
      options: kontentOptions,
    },
    {
      resolve: 'kontent-used-by-content-items', // local plugin
      options: {
        links: [
          {
            parentTypeCodename: 'article',
            childTypeCodename: 'tag',
            linkedElementCodename: 'tags',
            backReferenceName: 'used_by_articles',
          },
          {
            parentTypeCodename: 'article',
            childTypeCodename: 'category',
            linkedElementCodename: 'category',
            backReferenceName: 'used_by_articles',
          },
        ],
      },
    },
    'gatsby-plugin-sitemap',
    'gatsby-plugin-catch-links',
    {
      resolve: 'gatsby-plugin-sass',
      options: {
        postCssPlugins: [
          lost(),
          pxtorem({
            rootValue: 16,
            unitPrecision: 5,
            propList: [
              'font',
              'font-size',
              'line-height',
              'letter-spacing',
              'margin',
              'margin-top',
              'margin-left',
              'margin-bottom',
              'margin-right',
              'padding',
              'padding-top',
              'padding-left',
              'padding-bottom',
              'padding-right',
              'border-radius',
              'width',
              'max-width',
            ],
            selectorBlackList: [],
            replace: true,
            mediaQuery: false,
            minPixelValue: 0,
          }),
        ],
        // The partials still use @import and global colour functions, and
        // gatsby-plugin-sass drives Sass through its legacy JS API.
        sassOptions: {
          silenceDeprecations: [
            'legacy-js-api',
            'import',
            'global-builtin',
            'color-functions',
          ],
        },
      },
    },
  ],
}
