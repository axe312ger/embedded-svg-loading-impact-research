const crypto = require('crypto')
const { join } = require('path')

const { titleCase } = require('change-case')
const { readFile, writeFile } = require('fs-extra')
const stringify = require('json-stringify-safe')
const { get } = require('lodash')
const prettysize = require('prettysize')
const pug = require('pug')
const stats = require('stats-lite')

const getFileSizes = require('./get-file-sizes')
const { publicDir, templatesDir } = require('../config')

function getMeanFromRuns (image, valuePath) {
  const runs = image.primitive.runs
  const values = Object.keys(runs)
    .reduce((values, cpu) => {
      return [
        ...values,
        ...runs[cpu].map((run) => get(run, valuePath))
      ]
    }, [])
  return stats.mean(values)
}

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
      image.meanDuration = getMeanFromRuns(image, 'duration')
      image.meanSizes = {
        original: getMeanFromRuns(image, 'optimizedSizes.original'),
        gzip: getMeanFromRuns(image, 'optimizedSizes.gzip'),
        brotli: getMeanFromRuns(image, 'optimizedSizes.brotli')
      }
      imageStats = {
        ...imageStats,
        primitiveOptions: image.primitiveOptions
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
