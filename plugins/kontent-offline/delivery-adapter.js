const { FIXTURE_DOMAIN } = require('../../config/kontent')

// An axios adapter that answers the source plugin's Delivery API requests from
// fixtures. Anything not addressed to the fixture host is rejected, so an
// offline build can never reach a real Kontent project.
const createDeliveryAdapter = ({ deliveryTypes, itemsForLanguage }) =>
  async function kontentFixtureAdapter(config) {
    const url = new URL(config.url)
    if (url.hostname !== FIXTURE_DOMAIN) {
      throw new Error(`Offline Kontent mode blocked a request to ${url.origin}`)
    }

    const endpoint = url.pathname.split('/').filter(Boolean)[1]
    let data
    if (endpoint === 'types') {
      data = {
        types: deliveryTypes,
        pagination: {
          skip: 0,
          limit: 0,
          count: deliveryTypes.length,
          next_page: '',
        },
      }
    } else if (endpoint === 'items-feed') {
      data = {
        items: itemsForLanguage(url.searchParams.get('language')),
        modular_content: {},
      }
    } else if (endpoint === 'taxonomies') {
      data = { taxonomies: [], pagination: { skip: 0, limit: 0, count: 0 } }
    } else {
      throw new Error(`Offline Kontent mode has no fixture for ${url.pathname}`)
    }

    // The source plugin mutates what it receives, so hand it a fresh copy.
    return {
      data: JSON.parse(JSON.stringify(data)),
      status: 200,
      statusText: 'OK',
      headers: {},
      config,
      request: {},
    }
  }

module.exports = { createDeliveryAdapter }
