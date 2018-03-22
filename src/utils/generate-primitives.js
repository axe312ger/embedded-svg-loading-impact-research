const { join } = require('path')
const { writeFile, exists } = require('fs-extra')
const sqip = require('sqip')
const systeminformation = require('systeminformation')

const getFileSizes = require('./get-file-sizes')
const optimizeSVG = require('./optimize-svg')
const { primitiveDir } = require('../config')

const MINIMUM_RUNS = 2

const modes = {
  0: 'Combination',
  1: 'Triangles',
  2: 'Rectangles',
  3: 'Ellipses',
  4: 'Circles',
  5: 'Rotated rectangles',
  6: 'Bezier curves',
  7: 'Rotated ellipses',
  8: 'Polygons'
}

module.exports = async function generatePrimitives (file, options = {}) {
  const { prepared: { name: preparedName, path: preparedPath } } = file

  const primitiveOptionsHash = Object.keys(options)
    .map(optionName => `${optionName}-${options[optionName]}`)
    .sort((a, b) => a.localeCompare(b))
    .join('-')

  const cacheKey = `${preparedName}-${primitiveOptionsHash}`
  const name = cacheKey
  const filename = `${cacheKey}.svg`
  const path = join(primitiveDir, filename)
  const modeTitle = modes[parseInt(options.mode)]

  const { manufacturer, brand } = await systeminformation.cpu()
  const cachePath = join(primitiveDir, `${cacheKey}.json`)
  const cpuFingerprint = `${manufacturer} ${brand}`

  let cache = {
    results: null,
    runs: {}
  }

  if (await exists(cachePath)) {
    cache = require(cachePath)
  }
  if (!(cpuFingerprint in cache.runs)) {
    cache.runs[cpuFingerprint] = []
  }

  if (cache.runs[cpuFingerprint].length < MINIMUM_RUNS) {
    try {
      // Run sqip and measure duration
      const start = new Date().getTime()
      const { final_svg: svg } = sqip({ filename: preparedPath, ...options })
      const duration = new Date().getTime() - start

      // Optimize result
      const optimizedSVG = await optimizeSVG(cacheKey, svg)

      // Set initial result data and write first svg to disk
      if (!cache.results) {
        await writeFile(path, svg)
        cache.results = { svg, optimizedSVG }
      }

      // Gather data
      const sizes = getFileSizes(svg)
      const optimizedSizes = getFileSizes(optimizedSVG)

      // Update cache with new run and save it
      const run = { duration, sizes, optimizedSizes }
      cache.runs[cpuFingerprint].push(run)
      await writeFile(cachePath, JSON.stringify(cache, null, 2))
    } catch (err) {
      throw err
    }
  }

  file.primitive = {
    ...cache.results,
    runs: cache.runs,
    name,
    path
  }
  file.primitiveOptions = {
    ...options,
    modeTitle
  }
  file.svg = cache.results.svg
}
