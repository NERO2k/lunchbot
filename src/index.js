import './db'

import Discord from 'discord.js'
import dotenv from 'dotenv'
import fs from 'fs'
import moment from 'moment'
import schedule from 'node-schedule'
import dispatch from './dispatch'
import commands from './commands'
import { scrape, ocr, log, embed, download, web } from './modules'

dotenv.config()

const client = new Discord.Client()

client.on('ready', () => {
  log('LOG', 'Serving bot.')
  client.user.setActivity(process.env.BOT_STATUS)
})

if (process.env.SCHEDULE_MESSAGE) {
  const time = process.env.SCHEDULE_TIME.split(':')
  const j = schedule.scheduleJob(
    { hour: time[0], minute: time[1], dayOfWeek: process.env.SCHEDULE_DAY },
    async () => {
      dispatch(client)
    }
  )
}

client.on('message', async message => {
  commands(client, message)
})

client.login(process.env.BOT_TOKEN)
web(client)
