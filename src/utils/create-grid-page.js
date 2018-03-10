const crypto = require('crypto')
const { join } = require('path')

const { titleCase } = require('change-case')
const { readFile, writeFile } = require('fs-extra')
const stringify = require('json-stringify-safe')
const prettysize = require('prettysize')
const pug = require('pug')

const getFileSizes = require('./get-file-sizes')
const { baseDir, templatesDir } = require('../config')

module.exports = async function createGridPage ({ slug, title, images }) {
  const dest = join(baseDir, `${slug}.html`)
  for (const image of images) {
    const preparedImage = await readFile(image.prepared.path)
    const imageStats = {
      sourceImage: {
        name: image.prepared.base,
        sizes: {
          ...getFileSizes(preparedImage)
        }
      },
      width: image.width,
      primitiveOptions: image.primitiveOptions,
      sizes: image.primitive.sizes,
      optimizedSizes: image.primitive.optimizedSizes,
      svgByteLength: Buffer.byteLength(image.svg, 'utf8'),
      dataURI: {
        ...getFileSizes(image.dataURI)
      }
    }
    image.configString = stringify(imageStats, null, 2)
    image.hash = crypto
      .createHash(`md5`)
      .update(image.dataURI)
      .digest(`hex`)
    image.title = titleCase(image.original.name)
  }
  try {
    const html = pug.renderFile(join(templatesDir, 'grid.pug'), {
      pretty: false,
      title,
      images,
      prettysize: size => prettysize(size, { places: 2 })
    })
    await writeFile(dest, html)
    console.log(`Generated ${slug}.html`)
  } catch (err) {
    throw err
  }
}
