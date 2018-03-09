const brotliSize = require('brotli-size')
const gzipSize = require('gzip-size')

module.exports = function getFileSizes (data) {
  const original = Buffer.byteLength(data, 'utf8')
  const brotli = brotliSize.sync(data)
  const gzip = gzipSize.sync(data)
  return {
    original,
    brotli,
    gzip
  }
}
