const { readFile } = require('fs-extra')
const { join } = require('path')

const sharp = require('sharp')

const { preparedDir } = require('../config')

module.exports = async function prepareImage (file, width = 256) {
  const { original: { path: originalPath, name: originalName, ext } } = file
  const name = `${originalName}-${width}px`
  const path = join(preparedDir, `${name}${ext}`)

  try {
    const inputBuffer = await readFile(originalPath)

    await sharp(inputBuffer)
      .resize(width, width / 2)
      .toFile(path)
    file.prepared = { path, name }
    file.width = width
  } catch (err) {
    throw err
  }
}
