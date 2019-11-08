import dotenv from 'dotenv'
dotenv.config()

import Discord from 'discord.js'
import moment from 'moment'
import schedule from 'node-schedule'

import log from './modules/log'
import download from './modules/download'
import ocr from './modules/ocr'
import embed from './modules/embed'
import Subscription from './db'

const client = new Discord.Client()

client.on('ready', () => {
  log('LOG', 'Serving bot.')
  client.user.setActivity(process.env.BOT_STATUS)
})

async function runScheduleJob()
{
  const date = moment();
  const url = `https://i0.wp.com/eatery.se/wp-content/uploads/${date.format(
    'YYYY/MM'
  )}/kista-nod-lunch-v${date.week()}.png`
  try {
    await download(url, date)
    const data = await ocr(date)
    const channel = client.channels.get(process.env.SCHEDULE_CHANNEL)
    if (channel) embed(channel, data, url)
    Subscription.findAll().then(sub => {
      for (let i = 0; i < sub.length; i++) {
        let userChannel = client.users.get(sub[i].discordId)
        if (userChannel) embed(userChannel, data, url);
        log('LOG', "Send eatery menu to "+sub[i].discordId);
      }
    });
  } catch(error) {
    log('ERROR', 'Kunde inte hitta menyn för vecka ' + moment().week())
    log('ERROR', error);
  }
}

if (process.env.SCHEDULE_MESSAGE) {
  const time = process.env.SCHEDULE_TIME.split(':')
  var j = schedule.scheduleJob({ hour: time[0], minute: time[1], dayOfWeek: process.env.SCHEDULE_DAY }, async function() {
    runScheduleJob();
  })
}

client.on('message', async message => {
  if (message.author.bot) return
  const { content, author } = message
  const parse = content.split(' ')
  const command = parse[0]

  if (process.env.ALLOW_SUB_COMMAND) {
    if (command === process.env.SUB_COMMAND) {
      Subscription.findOne({ discordId:  author.id }).then(subx => {
        if (!subx)
        {
          Subscription.create({ discordId: author.id }).then(async function (user) {
            log('LOG', author.username+" subscribed.")
            message.reply("Du är nu på listan. :inbox_tray:")
            const date = moment();
            const url = `https://i0.wp.com/eatery.se/wp-content/uploads/${date.format(
              'YYYY/MM'
            )}/kista-nod-lunch-v${date.week()}.png`
            try {
              await download(url, date)
              const data = await ocr(date)
              embed(message.author, data, url)
            } catch (error) {
              log('ERROR', error, '#ff0000')
              message.channel.send(':fork_knife_plate: Kunde inte hitta menyn för denna vecka.')
            }
          });
        } else {
          Subscription.destroy({
            where: {
              discordId: author.id
            }
          }).then(() => {
            log('LOG', author.username+" unsubscribed.")
            message.reply("Du har bivit borttagen från listan. :outbox_tray:")
          });
        }
      });
    }
  }

  if (process.env.ALLOW_MENU_COMMAND) {
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
  }

  if (command === "<debug")
  {
    if (author.id === process.env.OWNER_ID)
    {
      runScheduleJob();
      message.reply("Ran schedule job.");
    }
  }
})

client.login(process.env.BOT_TOKEN)
