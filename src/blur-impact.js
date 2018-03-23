const readInputImages = require('./utils/read-input-images')
const prepareImage = require('./utils/prepare-image')
const generatePrimitives = require('./utils/generate-primitives')
const encodeSVG = require('./utils/encode-svg')
const createGridPage = require('./utils/create-grid-page')

const blurs = ['svg', 'css']

async function run () {
  try {
    const inputImages = await readInputImages()
    for (const blur of blurs) {
      const images = []
      for (const inputImage of inputImages) {
        const image = { ...inputImage }
        console.log(`Processing ${image.original.name} with ${blur} blur`)
        const primitiveOptions = {
          blur: blur === 'css' ? 0 : 12,
          mode: 0,
          numberOfPrimitives: 15
        }
        await prepareImage(image, 400)
        await generatePrimitives(image, primitiveOptions)
        image.dataURI = encodeSVG(image.primitive.optimizedSVG)
        images.push(image)
      }

      const title = `Blur impact with ${blur} blur`
      const slug = `blur-impact-${blur}`
      const bodyClass = `blur-${blur}`
      await createGridPage({ slug, title, images, bodyClass })
    }
  } catch (err) {
    throw err
  }
}

run()
