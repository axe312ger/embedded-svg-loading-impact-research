const { join } = require('path')

const { readdir, readFile, writeFile } = require('fs-extra')
const pug = require('pug')

const { baseDir, templatesDir } = require('./config')
const getFileSizes = require('./utils/get-file-sizes')

async function run () {
  try {
    const allFiles = await readdir(baseDir)

    const pagenames = allFiles
      .filter(filename => filename.match(/\.html$/))

    const pages = []
    console.log({pagenames})
    for (const pagename of pagenames) {
      const content = await readFile(join(baseDir, pagename))
      const sizes = getFileSizes(content)
      const page = {
        pagename,
        sizes
      }
      pages.push(page)
    }
    const title = 'Overview'
    const html = pug.renderFile(join(templatesDir, 'overview.pug'), {
      pretty: true,
      title,
      pages
    })
    await writeFile(join(baseDir, 'index.html'), html)
    console.log('written')
  } catch (err) {
    console.error(err)
    throw err
  }
}

run()
