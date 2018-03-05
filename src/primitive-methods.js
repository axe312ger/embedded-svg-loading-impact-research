const readInputImages = require('./utils/read-input-images')
const prepareImage = require('./utils/prepare-image')
const generatePrimitives = require('./utils/generate-primitives')
const optimizeSVG = require('./utils/optimize-svg')
const animateSVG = require('./utils/animate-svg')
const encodeSVG = require('./utils/encode-svg')
const createGridPage = require('./utils/create-grid-page')

const modes = [
  {
    id: 0,
    name: 'Combination'
  },
  {
    id: 1,
    name: 'Triangles'
  },
  {
    id: 2,
    name: 'Rectangles'
  },
  {
    id: 3,
    name: 'Ellipses'
  },
  {
    id: 4,
    name: 'Circles'
  },
  {
    id: 5,
    name: 'Rotated rectangles'
  },
  {
    id: 6,
    name: 'Bezier curves'
  },
  {
    id: 7,
    name: 'Rotated ellipses'
  },
  {
    id: 8,
    name: 'Polygons'
  }
]
const width = 400

async function run () {
  try {
    const inputImages = await readInputImages()
    for (const mode of modes) {
      const images = []

      for (const inputImage of inputImages) {
        console.log(`Processing ${inputImage.name} with ${mode.name}`)
        const primitiveOptions = {
          blur: 0,
          mode: mode.id,
          numberOfPrimitives: 25
        }
        const image = {
          ...inputImage,
          primitiveOptions,
          width
        }
        await prepareImage(image, width)
        await generatePrimitives(image, primitiveOptions)
        await optimizeSVG(image)
        encodeSVG(image)
        images.push(image)
      }

      const title = `Primitive mode ${mode.id} (${mode.name})`
      const slug = `primitive-mode-${mode.id}-${mode.name
        .toLowerCase()
        .replace(' ', '-')}`
      await createGridPage({ slug, title, images })

      // Animated variant
      for (const image of images) {
        await animateSVG(image)
        await optimizeSVG(image)
        encodeSVG(image)
      }

      await createGridPage({
        slug: `primitive-mode-${mode.id}-${mode.name
          .toLowerCase()
          .replace(' ', '-')}-animated`,
        title: `Primitive mode ${mode.id} (${mode.name}) animated`,
        images
      })
    }
  } catch (err) {
    throw err
  }
}

run()
