// Smart Link only initialises in a real browser; tests just need the API.
module.exports = {
  __esModule: true,
  default: {
    initialize: jest.fn(() => ({ destroy: jest.fn() })),
  },
}
