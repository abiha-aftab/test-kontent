module.exports = {
  testEnvironment: 'jsdom',
  transform: { '^.+\\.jsx?$': '<rootDir>/test/jest-preprocess.js' },
  moduleNameMapper: {
    '\\.(css|scss)$': '<rootDir>/test/style-mock.js',
  },
  testPathIgnorePatterns: [
    '/node_modules/',
    '<rootDir>/.cache/',
    '<rootDir>/public/',
  ],
  transformIgnorePatterns: [
    '/node_modules/(?!(gatsby|gatsby-script|gatsby-link)/)',
  ],
  setupFilesAfterEnv: ['<rootDir>/test/setup.js'],
  globals: { __PATH_PREFIX__: '' },
}
