require('dotenv').config()

import '@babel/polyfill'
import Discord from 'discord.js'
import moment from 'moment'
import schedule from 'node-schedule'
import { log, download, ocr, embed } from './modules'

const client = new Discord.Client()

client.on('ready', () => {
  log('LOG', 'Serving bot.')
  client.user.setActivity(process.env.BOT_STATUS)
})

if (process.env.SCHEDULE_MESSAGE) {
  const time = process.env.SCHEDULE_TIME.split(':')
  var j = schedule.scheduleJob({ hour: time[0], minute: time[1], dayOfWeek: 1 }, async function() {
    const url = `https://i0.wp.com/eatery.se/wp-content/uploads/${moment().format(
      'YYYY/MM'
    )}/kista-nod-lunch-v${moment().week()}.png`
    try {
      await download(url, moment())
      const data = await ocr(moment())
      const channel = client.channels.get(process.env.SCHEDULE_CHANNEL)
      embed(channel, data, url)
    } catch {
      log('ERROR', 'Kunde inte hitta menyn för vecka ' + moment().week())
    }
  })
}

if (process.env.ALLOW_COMMAND) {
  client.on('message', async message => {
    if (message.author.bot) return
    const { content, author } = message
    const parse = content.split(' ')
    const command = parse[0]

    if (command === process.env.MENU_COMMAND) {
      const args = parse[1] || moment().week()
      const date = moment()
        .day(moment().format('DD'))
        .week(args)
      log('LOG', `${author.username} requested the menu from week ${date.week()}.`)
      const url = `https://i0.wp.com/eatery.se/wp-content/uploads/${date.format(
        'YYYY/MM'
      )}/kista-nod-lunch-v${date.week()}.png`
      try {
        await download(url, date)
        const data = await ocr(date)
        embed(message.channel, data, url)
      } catch (error) {
        log('ERROR', error, '#ff0000')
        message.channel.send(':fork_knife_plate: Kunde inte hitta menyn för denna vecka.')
      }
    }
  })
}

client.login(process.env.BOT_TOKEN)
