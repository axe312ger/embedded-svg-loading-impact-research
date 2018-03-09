const crypto = require('crypto')
const { join } = require('path')

const { titleCase } = require('change-case')
const { writeFile } = require('fs-extra')
const stringify = require('json-stringify-safe')
const pug = require('pug')

const { baseDir, templatesDir } = require('../config')

module.exports = async function createGridPage ({ slug, title, images }) {
  const dest = join(baseDir, `${slug}.html`)
  images.forEach(image => {
    image.configString = stringify(image, null, 2)
    image.hash = crypto
      .createHash(`md5`)
      .update(image.dataURI)
      .digest(`hex`)
    image.title = titleCase(image.original.name)
  })
  try {
    const html = pug.renderFile(join(templatesDir, 'grid.pug'), {
      pretty: false,
      title,
      images
    })
    await writeFile(dest, html)
    console.log(`Generated ${slug}.html`)
  } catch (err) {
    throw err
  }
}
