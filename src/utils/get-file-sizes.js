const brotliSize = require('brotli-size')
const gzipSize = require('gzip-size')
const prettysize = require('prettysize')

module.exports = function getFileSizes (data) {
  const original = Buffer.byteLength(data, 'utf8')
  const originalFormatted = prettysize(original, { places: 2 })
  const brotli = brotliSize.sync(data)
  const brotliFormatted = prettysize(brotli, { places: 2 })
  const gzip = gzipSize.sync(data)
  const gzipFormatted = prettysize(gzip, { places: 2 })
  return {
    original,
    originalFormatted,
    brotli,
    brotliFormatted,
    gzip,
    gzipFormatted
  }
}
