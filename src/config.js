const { join } = require('path')

const baseDir = join(__dirname, '..')
const templatesDir = join(baseDir, 'templates')
const originalDir = join(baseDir, 'originals')
const primitiveDir = join(baseDir, 'primitives')
const optimizedDir = join(baseDir, 'optimized')
const preparedDir = join(baseDir, 'prepared')
// const outputDir = join(__dirname, 'output') - animated?

module.exports = {
  baseDir,
  templatesDir,
  originalDir,
  primitiveDir,
  optimizedDir,
  preparedDir
}
