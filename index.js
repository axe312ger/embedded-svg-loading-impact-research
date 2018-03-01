const { readFileSync, writeFileSync, readdirSync } = require('fs')
const { join } = require('path')

const cheerio = require('cheerio')
const eases = require('eases')
const svgToMiniDataURI = require('mini-svg-data-uri')

// Animation config
const easing = eases['sineOut']
const totalAnimationTime = 3

if (!easing) {
  throw new Error('Easing does not exist. Check: https://www.npmjs.com/package/eases & http://easings.net/')
}

const inputDir = join(__dirname, 'input')
const outputDir = join(__dirname, 'output')

const files = readdirSync(inputDir)
  .sort((a, b) => a.localeCompare(b))

const $html = cheerio.load('<html><body></body></html>')

$html('body').append(`
<div id="grid" style="display: grid; grid-template-columns: repeat(3, 1fr);"/>
`)

files.forEach((filename) => {
  const inputSVG = readFileSync(join(inputDir, filename))

  if (!filename.match(/svg$/)) {
    return
  }

  const $ = cheerio.load(inputSVG, {xmlMode: true})

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
    const animationDelay = (totalAnimationTime * eased).toFixed(3)
    $(element).css('animation-delay', `${animationDelay}s`)
  })

  $('svg').prepend(`<style>${animation.replace(/\s+/g, ' ')}</style>`)
  const outputSVG = $.html()
  const svgEncoded = svgToMiniDataURI(outputSVG)
  const original = `./originals/${filename.replace(/-s[0-9]+\.svg/, '')}.jpg?cache=busted${Math.random()}`

  $html('#grid').append(`
<div style="position: relative; background: url(&quot;${svgEncoded}&quot;) no-repeat; background-size: contain;" ">
  <div style="padding-bottom: 50%;"/>
  <img style="position: absolute; left: 0; top: 0; bottom: 0; width: 100%; height: auto;" src="${original}" />
</div>
`)

  writeFileSync(join(outputDir, filename), outputSVG)
})

writeFileSync(join(__dirname, 'index.html'), $html.html())
