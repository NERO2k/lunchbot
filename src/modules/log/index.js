import chalk from 'chalk'
import fs from 'fs'
import moment from 'moment'
import os from 'os'

export default async (type, str, col = '#606060') => {
  console.log(`${chalk.bgHex('#1e86da')(' Lunchbot ') + chalk.bgHex(col)(` ${type} `)} ${str}`)

  fs.appendFile(
    `logs/lunchbot-${moment().format('YYYY-MM-DD')}.txt`,
    `${moment().format('HH:mm:ss')} [Lunchbot][${type}] ${str}` + os.EOL,
    err => {
      if (err) throw err
    }
  )
}
