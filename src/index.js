import Discord from 'discord.js'
import Subscription from './db'
import dotenv from 'dotenv'
import download from './modules/download'
import embed from './modules/embed'
import log from './modules/log'
import moment from 'moment'
import ocr from './modules/ocr'
import scrape from './modules/scrape'
import schedule from 'node-schedule'
import fs from 'fs'

dotenv.config()

const client = new Discord.Client()

client.on('ready', () => {
  log('LOG', 'Serving bot.')
  client.user.setActivity(process.env.BOT_STATUS)
})

async function runScheduleJob() {
  const date = moment()
  try {
    const url = await scrape();
    await download(url, date)
    const data = await ocr(date)
    const channel = client.channels.get(process.env.SCHEDULE_CHANNEL)
    if (channel) embed(channel, data, url)
    Subscription.findAll().then(sub => {
      for (let i = 0; i < sub.length; i++) {
        let userChannel = client.users.get(sub[i].discordId)
        if (userChannel) embed(userChannel, data, url)
        log('LOG', `Send eatery menu to ${sub[i].discordId}`)
      }
    })
  } catch (error) {
    log('ERROR', `Kunde inte hitta menyn för vecka ${moment().week()}`)
    log('ERROR', error)
  }
}

if (process.env.SCHEDULE_MESSAGE) {
  const time = process.env.SCHEDULE_TIME.split(':')
  const j = schedule.scheduleJob(
    { hour: time[0], minute: time[1], dayOfWeek: process.env.SCHEDULE_DAY },
    async () => {
      runScheduleJob()
    }
  )
}

client.on('message', async message => {
  if (message.author.bot) return
  const { content, author } = message
  const parse = content.split(' ')
  const command = parse[0]

  if (process.env.ALLOW_SUB_COMMAND) {
    if (command === process.env.SUB_COMMAND) {
      Subscription.findOne({ where: { discordId: author.id } }).then(subx => {
        if (!subx) {
          Subscription.create({ discordId: author.id }).then(async user => {
            log('LOG', `${author.username} subscribed.`)
            message.reply('Du är nu på listan. :inbox_tray:')
            const date = moment()
            try {
              const url = await scrape();
              await download(url, date)
              const data = await ocr(date)
              embed(message.author, data, url)
            } catch (error) {
              log('ERROR', error, '#ff0000')
              message.channel.send(':fork_knife_plate: Kunde inte hitta menyn för denna vecka.')
            }
          })
        } else {
          Subscription.destroy({
            where: {
              discordId: author.id
            }
          }).then(() => {
            log('LOG', `${author.username} unsubscribed.`)
            message.reply('Du har blivit borttagen från listan. :outbox_tray:')
          })
        }
      })
    }
  }

  if (process.env.ALLOW_MENU_COMMAND) {
    if (command === process.env.MENU_COMMAND) {
      const args = parse[1] || moment().week()
      const date = moment()
        .day(moment().format('DD'))
        .week(args)
      log('LOG', `${author.username} requested the menu from week ${date.week()}.`)
      try {
        const fpath = `tmp/eatery-${date.format('YYYY-WW')}.txt`
        if (!parse[1]) {
          const url = await scrape();
          await download(url, date)
        }
        const data = await ocr(date)
        embed(message.channel, data)
      } catch (error) {
        log('ERROR', error, '#ff0000')
        message.channel.send(':fork_knife_plate: Kunde inte hitta menyn för denna vecka.')
      }
    }
  }

  if (command === '<dispatch') {
    if (author.id === process.env.OWNER_ID) {
      runScheduleJob()
      message.reply('Ran schedule job.')
    }
  }
})

client.login(process.env.BOT_TOKEN)
