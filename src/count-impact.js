const { ensureDir } = require('fs-extra')

const readInputImages = require('./utils/read-input-images')
const prepareImage = require('./utils/prepare-image')
const generatePrimitives = require('./utils/generate-primitives')
const encodeSVG = require('./utils/encode-svg')
const createGridPage = require('./utils/create-grid-page')
const {
  preparedDir,
  optimizedDir,
  animatedDir,
  primitiveDir
} = require('./config')

const primitiveCount = [8, 10, 15, 20, 25, 50, 75, 100, 200, 500, 750, 1000]

async function run () {
  await ensureDir(preparedDir)
  await ensureDir(optimizedDir)
  await ensureDir(animatedDir)
  await ensureDir(primitiveDir)
  try {
    const inputImages = await readInputImages()

    for (const count of primitiveCount) {
      const images = []

      for (const inputImage of inputImages) {
        const image = { ...inputImage }
        console.log(
          `Processing ${
            image.original.name
          } with ${count} rotated triangles (5)`
        )
        const primitiveOptions = {
          blur: count < 10 ? 12 : 0,
          mode: 5,
          numberOfPrimitives: count
        }
        await prepareImage(image)
        await generatePrimitives(image, primitiveOptions)
        image.dataURI = encodeSVG(image.primitive.optimizedSVG)
        images.push(image)
      }

      const title = `${count} rotated triangles`
      const slug = `count-impact-${count}`
      await createGridPage({ slug, title, images })
    }
  } catch (err) {
    throw err
  }
}

run()
