const { join, parse } = require('path')

const cheerio = require('cheerio')
const eases = require('eases')
const { ensureDir, writeFile } = require('fs-extra')

const { animatedDir } = require('../config')
const getFileSizes = require('./get-file-sizes')
const optimizeSVG = require('./optimize-svg')

module.exports = async function animate (
  file,
  opts = {
    easing: 'sineOut',
    totalAnimationTime: 3
  }
) {
  const easing = eases[opts.easing]

  if (!easing) {
    throw new Error(
      'Easing does not exist. Check: https://www.npmjs.com/package/eases & http://easings.net/'
    )
  }

  const { primitive: { name: primitiveName } } = file

  const name = `${primitiveName}-animated.svg`
  const path = join(animatedDir, name)
  await ensureDir(animatedDir)

  const $ = cheerio.load(file.primitive, { xmlMode: true })

  const animation = `@keyframes a{
    from {opacity: 0}
    to {opacity: 1}
  }
  g > * {
    opacity: 0;
    animation: a .5s forwards;
  }`

  const nodes = $('g > *')

  nodes.map((index, element) => {
    const linear = index / nodes.length
    const eased = easing(linear)
    const animationDelay = (opts.totalAnimationTime * eased).toFixed(3)
    $(element).css('animation-delay', `${animationDelay}s`)
  })

  $('svg').prepend(`<style>${animation.replace(/\s+/g, ' ')}</style>`)
  const svg = $.html()
  await writeFile(path, svg)
  const sizes = getFileSizes(svg)
  file.animated = { svg, name, path, sizes }
  file.svg = svg
  await optimizeSVG(file)
}
