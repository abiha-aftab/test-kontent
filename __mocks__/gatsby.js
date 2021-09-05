// Gatsby's documented unit-testing mock: Link renders a plain anchor and
// the GraphQL helpers are jest functions.
const React = require('react')
const gatsby = jest.requireActual('gatsby')

const ROUTER_ONLY_PROPS = [
  'activeClassName',
  'activeStyle',
  'getProps',
  'innerRef',
  'partiallyActive',
  'replace',
]

module.exports = {
  ...gatsby,
  graphql: jest.fn(),
  Link: jest.fn().mockImplementation(({ to, ...props }) => {
    const anchorProps = Object.fromEntries(
      Object.entries(props).filter(([key]) => !ROUTER_ONLY_PROPS.includes(key))
    )
    return React.createElement('a', { ...anchorProps, href: to })
  }),
  useStaticQuery: jest.fn(),
}
