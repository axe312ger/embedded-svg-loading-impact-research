const { join, parse } = require('path')

const cheerio = require('cheerio')
const eases = require('eases')
const { ensureDir, writeFile } = require('fs-extra')

const { animatedDir } = require('../config')
const getFileSizes = require('./get-file-sizes')

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

  const { name } = parse(file.primitivePath)
  const animatedPath = join(animatedDir, `${name}-animated.svg`)
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
  await writeFile(animatedPath, svg)
  file.primitive = svg
  file.primitivePath = animatedPath
  const sizes = getFileSizes(svg)
  file.primitiveSizes = sizes
}
