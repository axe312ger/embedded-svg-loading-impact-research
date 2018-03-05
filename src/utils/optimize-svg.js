const { join } = require('path')

const { writeFile, ensureDir } = require('fs-extra')
const SVGO = require('svgo')

const { optimizedDir } = require('../config')

module.exports = async function optimizeSVG (file) {
  const { primitive, name } = file
  const optimizedPath = join(optimizedDir, name)
  await ensureDir(optimizedDir)

  try {
    const svgo = new SVGO({ multipass: true, floatPrecision: 0 })
    const svg = await new Promise((resolve, reject) => {
      svgo.optimize(primitive, ({ data }) => resolve(data))
    })

    await writeFile(optimizedPath, svg)
    file.optimized = svg
    file.optimizedPath = optimizedPath
    file.optimizedSize = Buffer.byteLength(svg, 'utf8')
  } catch (err) {
    throw err
  }
}
