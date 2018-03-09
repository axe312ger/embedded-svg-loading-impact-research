const { join } = require('path')
const { writeFile, ensureDir } = require('fs-extra')
const sqip = require('sqip')
const systeminformation = require('systeminformation')

const getFileSizes = require('./get-file-sizes')
const optimizeSVG = require('./optimize-svg')
const { primitiveDir } = require('../config')

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
  const name = `${cacheKey}.svg`
  const path = join(primitiveDir, name)
  const modeTitle = modes[parseInt(options.mode)]

  await ensureDir(primitiveDir)
  const { manufacturer, brand } = await systeminformation.cpu()
  const cpuFingerprint = `${manufacturer} ${brand}`
  // const cache = {
  //   [cacheKey]: {
  //     results: {},
  //     runs: {
  //       [cpuFingerprint]: [{ duration, sizes }]
  //     }
  //   }
  // }

  try {
    const start = new Date().getTime()
    const { final_svg: svg } = sqip({ filename: preparedPath, ...options })
    const duration = new Date().getTime() - start
    await writeFile(path, svg)
    const sizes = getFileSizes(svg)
    file.primitive = { svg, name, path, duration, sizes }
    file.primitiveOptions = {
      ...options,
      modeTitle
    }
    file.svg = svg
    await optimizeSVG(file)
  } catch (err) {
    throw err
  }
}
