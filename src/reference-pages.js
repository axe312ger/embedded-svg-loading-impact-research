const { ensureDir } = require('fs-extra')

const lqip = require('lqip')

const readInputImages = require('./utils/read-input-images')
const prepareImage = require('./utils/prepare-image')
const createGridPage = require('./utils/create-grid-page')

async function lqipPage (inputImages) {
  const images = []
  for (const inputImage of inputImages) {
    const image = { ...inputImage }
    await prepareImage(image)
    image.dataURI = await lqip.base64(image.prepared.path)
    images.push(image)
  }

  const title = `LQIP Reference`
  const slug = `reference-lqip`
  await createGridPage({ slug, title, images })
}

async function plainImagePage (inputImages) {
  const images = []
  for (const inputImage of inputImages) {
    const image = { ...inputImage }
    await prepareImage(image)
    images.push(image)
  }

  const title = `Plain Image Reference - no enhancement`
  const slug = `reference-plain-image`
  await createGridPage({ slug, title, images })
}

async function run () {
  try {
    const inputImages = await readInputImages()

    await lqipPage(inputImages)
    await plainImagePage(inputImages)
  } catch (err) {
    throw err
  }
}

run()
