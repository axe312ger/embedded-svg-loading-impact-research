const { join } = require('path')

const baseDir = join(__dirname, '..')
const templatesDir = join(baseDir, 'templates')
const originalDir = join(baseDir, 'originals')
const primitiveDir = join(baseDir, 'primitives')
const animatedDir = join(baseDir, 'animated')
const optimizedDir = join(baseDir, 'optimized')
const preparedDir = join(baseDir, 'prepared')

module.exports = {
  baseDir,
  templatesDir,
  originalDir,
  primitiveDir,
  animatedDir,
  optimizedDir,
  preparedDir
}
