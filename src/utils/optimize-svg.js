const { join } = require('path')

const { writeFile, ensureDir } = require('fs-extra')
const SVGO = require('svgo')

const getFileSizes = require('./get-file-sizes')
const { optimizedDir } = require('../config')

module.exports = async function optimizeSVG (file) {
  const { primitive, name } = file
  const optimizedPath = join(optimizedDir, name)
  await ensureDir(optimizedDir)

  try {
    const svgo = new SVGO({ multipass: true, floatPrecision: 0 })
    const {data: svg} = await svgo.optimize(primitive)

    await writeFile(optimizedPath, svg)
    file.optimized = svg
    file.optimizedPath = optimizedPath
    const sizes = getFileSizes(svg)
    file.optimizedSizes = sizes
  } catch (err) {
    throw err
  }
}
