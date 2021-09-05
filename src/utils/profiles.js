// The author item stores handles, not URLs. The demo content uses "#" for
// "not set", which used to produce links like https://www.twitter.com/#.
const PROFILE_URLS = {
  twitter: (handle) => `https://twitter.com/${handle}`,
  github: (handle) => `https://github.com/${handle}`,
  vk: (handle) => `https://vk.com/${handle}`,
  telegram: (handle) => `https://t.me/${handle}`,
  email: (address) => `mailto:${address}`,
  rss: (url) => url,
}

const isSet = (value) => {
  const trimmed = String(value || '').trim()
  return trimmed !== '' && trimmed !== '#'
}

export const profileUrl = (network, value) => {
  const build = PROFILE_URLS[network]
  if (!build || !isSet(value)) return null
  const handle = String(value).trim()
  return network === 'email' || network === 'rss'
    ? build(handle)
    : build(handle.replace(/^@/, ''))
}
