const { join } = require('path')

const { writeFile, access } = require('fs-extra')
const SVGO = require('svgo')

const { optimizedDir } = require('../config')

module.exports = async function optimizeSVG (name, svg) {
  const path = join(optimizedDir, `${name}.svg`)

  try {
    const svgo = new SVGO({ multipass: true, floatPrecision: 0 })
    const { data } = await svgo.optimize(svg)
    try {
      await access(path)
    } catch (err) {
      await writeFile(path, data)
    }
    return data
  } catch (err) {
    throw err
  }
}
