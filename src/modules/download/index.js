import axios from 'axios'
import fs from 'fs'
import log from '../log'
import moment from 'moment'
import path from 'path'

export default async (url, date) => {
  const fpath = `tmp/eatery-${date.format('YYYY-WW')}.png`

  if (!fs.existsSync(fpath)) {
    const writer = fs.createWriteStream(fpath)

    const response = await axios({
      url,
      method: 'GET',
      responseType: 'stream'
    })

    if (response.status === 200) {
      response.data.pipe(writer)
    } else {
      reject('Failed to fetch the Eatery menu.')
    }

    return new Promise((resolve, reject) => {
      writer.on('finish', resolve)
      writer.on('error', () => {
        log('ERROR', 'Failed to write the Eatery menu.', '#ff0000')
        reject()
      })
    })
  } else {
    return new Promise((resolve, reject) => {
      resolve()
    })
  }
}
