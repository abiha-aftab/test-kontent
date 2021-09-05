const babelJest = require('babel-jest')

module.exports = (babelJest.default || babelJest).createTransformer({
  presets: ['babel-preset-gatsby'],
})
