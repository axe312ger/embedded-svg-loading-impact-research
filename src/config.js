const { join } = require('path')

const baseDir = join(__dirname, '..')
const templatesDir = join(baseDir, 'templates')
const originalDir = join(baseDir, 'originals')
const publicDir = join(baseDir, 'public')
const primitiveDir = join(publicDir, 'primitives')
const animatedDir = join(publicDir, 'animated')
const optimizedDir = join(publicDir, 'optimized')
const preparedDir = join(publicDir, 'prepared')

module.exports = {
  baseDir,
  templatesDir,
  originalDir,
  publicDir,
  primitiveDir,
  animatedDir,
  optimizedDir,
  preparedDir
}
