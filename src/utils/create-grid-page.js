const { join } = require('path')

const { writeFile } = require('fs-extra')
const pug = require('pug')

const { baseDir, templatesDir } = require('../config')

module.exports = async function createGridPage ({ slug, title, images }) {
  const dest = join(baseDir, `${slug}.html`)
  try {
    const html = pug.renderFile(join(templatesDir, 'grid.pug'), {
      pretty: true,
      title,
      images
    })
    await writeFile(dest, html)
    console.log(`Generated ${slug}.html`)
  } catch (err) {
    throw err
  }
}
