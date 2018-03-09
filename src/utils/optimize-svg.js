const { join } = require('path')

const { writeFile, ensureDir } = require('fs-extra')
const SVGO = require('svgo')

const getFileSizes = require('./get-file-sizes')
const { optimizedDir } = require('../config')

module.exports = async function optimizeSVG (file) {
  const { svg, primitive, animated } = file
  const source = animated || primitive
  const { name: sourceName } = source
  const path = join(optimizedDir, sourceName)
  await ensureDir(optimizedDir)

  try {
    const svgo = new SVGO({ multipass: true, floatPrecision: 0 })
    const { data } = await svgo.optimize(svg)

    await writeFile(path, data)
    const sizes = getFileSizes(svg)
    file.optimized = { svg: data, path, sizes }
    file.svg = data
  } catch (err) {
    throw err
  }
}
