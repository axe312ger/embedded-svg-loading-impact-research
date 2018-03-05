const { readFile } = require('fs-extra')
const { join } = require('path')

const sharp = require('sharp')

const { preparedDir } = require('../config')

module.exports = async function prepareImage (file, width = 256) {
  const { originalPath, name, ext } = file
  const filename = `${name}-${width}px`
  const preparedPath = join(preparedDir, `${filename}${ext}`)

  try {
    const inputBuffer = await readFile(originalPath)

    await sharp(inputBuffer)
      .resize(width)
      .toFile(preparedPath)
    file.preparedPath = preparedPath
    file.name = filename
  } catch (err) {
    throw err
  }
}
