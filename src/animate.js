const eases = require('eases')
const cheerio = require('cheerio')

function animate () {
  // Animation config
  const easing = eases['sineOut']
  const totalAnimationTime = 3

  if (!easing) {
    throw new Error(
      'Easing does not exist. Check: https://www.npmjs.com/package/eases & http://easings.net/'
    )
  }

  const inputSVG = readFileSync(join(inputDir, filename))

  if (!filename.match(/svg$/)) {
    return
  }

  const $ = cheerio.load(inputSVG, { xmlMode: true })

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
}
