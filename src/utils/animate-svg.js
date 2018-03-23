const { join } = require('path')

const cheerio = require('cheerio')
const eases = require('eases')
const { access, writeFile } = require('fs-extra')

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

  const name = `${primitiveName}-animated`
  const filename = `${name}.svg`
  const path = join(animatedDir, filename)

  const $ = cheerio.load(file.primitive.svg, { xmlMode: true })

  if (!$('g > *').length) {
    const groupNodes = $('svg > *').slice(1)
    const group = $('<g class="animated" />')
    $('svg').append(group)
    groupNodes.appendTo(group)
    console.log('fixed', $.html())
  } else {
    $('g').addClass('animated')
  }
  const nodes = $('g > *')

  const animation = `
  @keyframes fadeIn {
    from {opacity: 0}
    to {opacity: 1}
  }
  g.animated > * {
    opacity: 0;
    animation: fadeIn .5s forwards;
  }`

  nodes.map((index, element) => {
    const linear = index / nodes.length
    const eased = easing(linear)
    const animationDelay = (opts.totalAnimationTime * eased).toFixed(2)
    $(element).css('animation-delay', `${animationDelay}s`)
  })

  $('svg').prepend(`<style>${animation}</style>`)
  const svg = $.html()

  // Optimize result
  const optimizedSVG = await optimizeSVG(`${primitiveName}-animated`, svg)

  // Gather data
  const sizes = getFileSizes(svg)
  const optimizedSizes = getFileSizes(optimizedSVG)

  try {
    await access(path)
  } catch (err) {
    await writeFile(path, svg)
  }
  file.animated = { svg, optimizedSVG, name, path, sizes, optimizedSizes }
  file.svg = svg
}
