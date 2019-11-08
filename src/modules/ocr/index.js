import tesseract from 'node-tesseract-ocr'
import fs from 'fs'
import { log } from '../'

export default async prepdate => {
  const date = prepdate.format('YYYY-WW')
  return new Promise((resolve, reject) => {
    if (!fs.existsSync('tmp/eatery-' + date + '.txt')) {
      if (fs.existsSync('tmp/eatery-' + date + '.png')) {
        const config = {
          lang: 'swe',
          oem: 1,
          psm: 3
        }

        tesseract
          .recognize('tmp/eatery-' + date + '.png', config)
          .then(text => {
            fs.writeFile('tmp/' + 'eatery-' + date + '.txt', text, function(err) {
              resolve(text)
            })
          })
          .catch(error => {
            reject(error)
          })
      } else {
        reject('Image for OCR not found.')
      }
    } else {
      fs.readFile('tmp/eatery-' + date + '.txt', 'utf8', function(err, text) {
        resolve(text)
      })
    }
  })
}
