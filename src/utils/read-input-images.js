const { join, parse } = require('path')

const { readdir } = require('fs-extra')

const { originalDir } = require('../config')

module.exports = async function readInputImages () {
  const files = await readdir(originalDir)
  const preparedImages = files
    .filter(filename => filename.match(/jpe?g$/))
    .sort((a, b) => a.localeCompare(b))
    .map(filename => {
      const { base, name, ext } = parse(filename)
      const path = join(originalDir, base)
      return {
        original: {
          path,
          base,
          name,
          ext
        }
      }
    })

  return preparedImages
}
