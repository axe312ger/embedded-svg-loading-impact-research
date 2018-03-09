const svgToMiniDataURI = require('mini-svg-data-uri')

module.exports = function encode (svg) {
  return svgToMiniDataURI(svg)
}
