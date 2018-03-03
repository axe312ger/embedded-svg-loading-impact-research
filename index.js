const { ensureDir, readdirSync, writeFile, readFile } = require('fs-extra')
const { join, parse } = require('path')

const sharp = require('sharp')

const pug = require('pug')

const originalDir = join(__dirname, 'originals')
const primitiveDir = join(__dirname, 'primitives')
const preparedDir = join(__dirname, 'prepared')
// const outputDir = join(__dirname, 'output') - animated?

ensureDir(primitiveDir)
ensureDir(preparedDir)

async function createGridPage ({ slug, title, images }) {
  const dest = join(__dirname, `${slug}.html`)
  try {
    const html = pug.renderFile(join(__dirname, 'templates', 'grid.pug'), {
      pretty: true,
      title,
      images
    })
    await writeFile(dest, html)
  } catch (err) {
    throw err
  }
}

async function prepareImage (file, width = 256) {
  const { originalPath, name, ext } = file
  const filename = `${name}-${width}px`
  const preparedPath = join(preparedDir, `${filename}${ext}`)

  try {
    const inputBuffer = await readFile(originalPath)

    await sharp(inputBuffer)
      .resize(width)
      .toFile(preparedPath)
    file.preparedPath = preparedPath
    file.name = filename
  } catch (err) {
    throw err
  }
}

async function generatePrimitives (file, options = {}) {
  const sqip = require('sqip')

  const { preparedPath, name } = file
  const primitivePath = join(primitiveDir, `${name}.svg`)
  ensureDir(primitiveDir)

  try {
    const start = new Date().getTime()
    const { final_svg: svg } = sqip({ filename: preparedPath, ...options })
    const primitiveTime = new Date().getTime() - start
    await writeFile(primitivePath, svg)
    file.primitive = svg
    file.primitivePath = primitivePath
    file.primitiveTime = primitiveTime

    return svg
  } catch (err) {
    throw err
  }
}

function encode (file) {
  const svgToMiniDataURI = require('mini-svg-data-uri')
  const dataURI = svgToMiniDataURI(file.primitive)
  file.dataURI = dataURI
}

const widths = [16, 50, 100, 128, 200, 256, 400, 800, 2000]

async function run () {
  try {
    const files = readdirSync(originalDir)
      .filter(filename => filename.match(/jpe?g$/))
      .sort((a, b) => a.localeCompare(b))
      .map(filename => {
        const { base, name, ext } = parse(filename)
        const originalPath = join(originalDir, base)
        return {
          originalPath,
          base,
          name,
          ext
        }
      })
    const images = []
    for (const file of files) {
      for (const width of widths) {
        console.log(`Processing ${file.name} with ${width}px`)
        const primitiveOptions = {
          blur: 0,
          mode: 1,
          numberOfPrimitives: 100
        }
        const image = {
          ...file,
          primitiveOptions,
          width
        }
        await prepareImage(image, width)
        await generatePrimitives(image, primitiveOptions)
        encode(image)
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
