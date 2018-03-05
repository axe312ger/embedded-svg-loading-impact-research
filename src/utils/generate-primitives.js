const { join } = require('path')
const { writeFile, ensureDir } = require('fs-extra')
const sqip = require('sqip')

const getFileSizes = require('./get-file-sizes')
const { primitiveDir } = require('../config')

module.exports = async function generatePrimitives (file, options = {}) {
  const { preparedPath, name } = file
  const primitiveOptionsHash = Object.keys(options)
    .map((optionName) => `${optionName}-${options[optionName]}`)
    .join('-')
  const primitivePath = join(primitiveDir, `${name}-${primitiveOptionsHash}.svg`)
  await ensureDir(primitiveDir)

  try {
    const start = new Date().getTime()
    const { final_svg: svg } = sqip({ filename: preparedPath, ...options })
    const primitiveTime = new Date().getTime() - start
    await writeFile(primitivePath, svg)
    file.primitive = svg
    file.primitivePath = primitivePath
    file.primitiveTime = primitiveTime
    const sizes = getFileSizes(svg)
    file.primitiveSizes = sizes
  } catch (err) {
    throw err
  }
}
