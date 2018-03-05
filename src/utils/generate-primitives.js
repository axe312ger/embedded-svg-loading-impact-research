const { join } = require('path')

const { writeFile, ensureDir } = require('fs-extra')
const sqip = require('sqip')

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
    file.primitiveSize = Buffer.byteLength(svg, 'utf8')
  } catch (err) {
    throw err
  }
}
