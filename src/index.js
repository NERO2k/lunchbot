import Discord from 'discord.js'
import { Subscriptions, Servers } from './db'
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
    await download(url, date);
    const data = await ocr(date)
    const channel = client.channels.get(process.env.SCHEDULE_CHANNEL)
    if (channel) embed(channel, data, url)
      Subscriptions.findAll().then(sub => {
        for (let i = 0; i < sub.length; i++) {
          let userChannel = client.users.get(sub[i].discordId)
          if (userChannel) embed(userChannel, data, url)
            log('LOG', `Sent Eatery menu to ${sub[i].discordId}`)
        }
      })
    Servers.findAll().then(sub => {
      for (let i = 0; i < sub.length; i++) {
        let channelGuild = client.channels.get(sub[i].channelId)
        if (channelGuild) embed(channelGuild, data, url)
          log('LOG', `Sent Eatery menu to ${sub[i].channelId} in ${sub[i].serverId}`)
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
      Subscriptions.findOne({ where: { discordId: author.id } }).then(subx => {
        if (!subx) {
          Subscriptions.create({ discordId: author.id }).then(async user => {
            log('LOG', `${author.username} subscribed.`)
            message.reply('Du är nu på listan :inbox_tray:')
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
          Subscriptions.destroy({
            where: {
              discordId: author.id
            }
          }).then(() => {
            log('LOG', `${author.username} unsubscribed.`)
            message.reply('Du har tagits bort från listan :outbox_tray:')
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

  if (process.env.ALLOW_LINK_COMMANDS) {
    if (command === process.env.LINK_COMMAND) {
      if (message.guild.owner.id === author.id) //|| process.env.OWNER_ID === author.id)
      {
        Servers.findOne({ where: { serverId: message.guild.id } }).then(subx => {
          if (!subx) {
            Servers.create({ serverId: message.guild.id, channelId: message.channel.id }).then(async user => {
              log('LOG', `${author.username} added ${message.guild.name} to automatic messaging.`)
              message.reply('Kanalen är nu ansluten :bulb:')
              const date = moment()
              try {
                const url = await scrape();
                await download(url, date)
                const data = await ocr(date)
                embed(message.channel, data, url)
              } catch (error) {
                log('ERROR', error, '#ff0000')
                message.channel.send(':fork_knife_plate: Kunde inte hitta menyn för denna vecka.')
              }
            })
          } else {
            message.reply('En kanal är redan ansluten :warning:')
          }
        })
      } else {
        message.reply('Endast ägaren av servern kan använda detta kommando :no_entry_sign:')
      }
    }
    if (command === process.env.UNLINK_COMMAND) {
      if (message.guild.owner.id === author.id) //|| process.env.OWNER_ID === author.id)
      {
        Servers.destroy({
          where: {
            serverId: message.guild.id
          }
        }).then(() => {
          log('LOG', `${author.username} removed ${message.guild.name} from automatic messaging.`)
          message.reply('Den anslutna kanalen är inte längre ansluten :electric_plug:')
        })
      } else {
        message.reply('Endast ägaren av servern kan använda detta kommando :no_entry_sign:')
      }
    }
  }

  // Example help command. Embed would be nice.
  if (command === process.env.HELP_COMMAND) {
    message.channel.send(`\`\`\`
-----------------------------------------------------------------------
Du kan använda kommandot <lunch {alternativt veckonummer} för att 
skriva ut lunch menyn i chatten du skriver i.
-----------------------------------------------------------------------
Kommandot <sub prenumererar ditt konto till att ta emot lunchmenyn
direkt via dina privat meddelanden varje måndag. Du kan också
avprenumerera genom att använda samma kommado igen.
-----------------------------------------------------------------------
Som serverägare har du tillgång till kommandot <link och <unlink
dessa commandon används för att ansluta en kanal i din server till att
ta emot lunchmenyn. <unlink kan användas i alla kanaler av 
serverägaren men <link kommandot måste användas i kanalen du vill
ta emot meddelanden i.
      \`\`\``);
  }

  if (command === process.env.DISPATCH_COMMAND) {
    if (author.id === process.env.OWNER_ID) {
      runScheduleJob()
      message.reply('Ran schedule job.')
    }
  }
})

client.login(process.env.BOT_TOKEN)
