const readInputImages = require('./utils/read-input-images')
const prepareImage = require('./utils/prepare-image')
const generatePrimitives = require('./utils/generate-primitives')
const encodeSVG = require('./utils/encode-svg')
const createGridPage = require('./utils/create-grid-page')

const widths = [16, 50, 100, 128, 200, 256, 400, 800, 2000]

async function run () {
  try {
    const inputImages = await readInputImages()
    const images = []
    for (const inputImage of inputImages) {
      for (const width of widths) {
        const image = { ...inputImage }
        console.log(`Processing ${image.original.name} with ${width}px`)
        const primitiveOptions = {
          blur: 0,
          mode: 1,
          numberOfPrimitives: 100
        }
        await prepareImage(image, width)
        await generatePrimitives(image, primitiveOptions)
        encodeSVG(image)
        images.push(image)
      }
    }

    const title = 'Input dimension to performance inpact ratio'
    const slug = 'performance-check'
    await createGridPage({ slug, title, images })
  } catch (err) {
    throw err
  }
}

run()
