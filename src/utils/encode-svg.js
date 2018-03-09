const svgToMiniDataURI = require('mini-svg-data-uri')

module.exports = function encode (file) {
  const { svg } = file
  file.dataURI = svgToMiniDataURI(svg)
}
