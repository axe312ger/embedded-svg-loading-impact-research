const crypto = require('crypto')
const { join } = require('path')

const { titleCase } = require('change-case')
const { readFile, writeFile } = require('fs-extra')
const stringify = require('json-stringify-safe')
const prettysize = require('prettysize')
const pug = require('pug')

const getFileSizes = require('./get-file-sizes')
const { publicDir, templatesDir } = require('../config')

module.exports = async function createGridPage ({ slug, title, images }) {
  const dest = join(publicDir, `${slug}.html`)
  for (const image of images) {
    const preparedImage = await readFile(image.prepared.path)
    let imageStats = {
      sourceImage: {
        name: image.prepared.base,
        sizes: {
          ...getFileSizes(preparedImage)
        }
      },
      width: image.width
    }
    if (image.primitive) {
      imageStats = {
        ...imageStats,
        primitiveOptions: image.primitiveOptions,
        sizes: image.primitive.sizes,
        optimizedSizes: image.primitive.optimizedSizes
      }
    }
    if (image.svg) {
      imageStats = {
        ...imageStats,
        svgByteLength: Buffer.byteLength(image.svg, 'utf8')
      }
    }
    if (image.dataURI) {
      imageStats = {
        ...imageStats,
        dataURI: {
          ...getFileSizes(image.dataURI)
        }
      }
    }
    image.configString = stringify(imageStats, null, 2)
    image.hash = crypto
      .createHash(`md5`)
      .update(image.dataURI || image.prepared.name)
      .digest(`hex`)
    image.title = titleCase(image.original.name)
  }
  try {
    const html = pug.renderFile(join(templatesDir, 'grid.pug'), {
      pretty: true,
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
