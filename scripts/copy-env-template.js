// Creates .env from .env.template, leaving an existing .env untouched.
const fs = require('fs')
const path = require('path')

const root = path.resolve(__dirname, '..')
const source = path.join(root, '.env.template')
const target = path.join(root, '.env')

try {
  fs.copyFileSync(source, target, fs.constants.COPYFILE_EXCL)
  console.log('Created .env from .env.template; fill in KONTENT_PROJECT_ID.')
} catch (error) {
  if (error.code !== 'EEXIST') throw error
  console.log('.env already exists; left it unchanged.')
}
