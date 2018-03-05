const svgToMiniDataURI = require('mini-svg-data-uri')

module.exports = function encode (file) {
  const dataURI = svgToMiniDataURI(file.optimized)
  file.dataURI = dataURI
}
