const { access, readFile } = require('fs-extra')
const { join } = require('path')

const sharp = require('sharp')

const { preparedDir } = require('../config')

module.exports = async function prepareImage (file, width = 400) {
  const { original: { path: originalPath, name: originalName, ext } } = file
  const name = `${originalName}-${width}px`
  const path = join(preparedDir, `${name}${ext}`)

  file.prepared = { path, name }
  file.width = width

  try {
    await access(path)
    return
  } catch (err) {
    try {
      const inputBuffer = await readFile(originalPath)

      await sharp(inputBuffer)
        .resize(width, width / 2)
        .toFile(path)
    } catch (err) {
      throw err
    }
  }
}
