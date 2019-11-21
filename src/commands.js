import dotenv from 'dotenv'
dotenv.config()

import dispatch from './dispatch'
import moment from 'moment'
import { Servers, Subscriptions } from './db'
import { scrape, ocr, log, embed, download } from './modules'

const commands = {}

commands[process.env.DISPATCH_COMMAND] = {
  enabled: true,
  check: (client, message, args) => {
    if (message.author.id === process.env.OWNER_ID) {
      return true
    }
  },
  action: async (client, message, args) => {
    dispatch(client)
    message.reply('Ran schedule job.')
  }
}

commands[process.env.SUB_COMMAND] = {
  enabled: process.env.ALLOW_SUB_COMMAND,
  check: () => {
    return true
  },
  action: async (client, message, args) => {
    Subscriptions.findOne({ where: { discordId: message.author.id } }).then(subx => {
      if (!subx) {
        Subscriptions.create({ discordId: message.author.id }).then(async user => {
          log('LOG', `${message.author.username} subscribed.`)
          message.reply('Du är nu på listan :inbox_tray:')
          const date = moment()
          try {
            const url = await scrape()
            await download(url, date)
            const data = await ocr(date)
            embed(message.author, data, date)
          } catch (error) {
            log('ERROR', error, '#ff0000')
            message.channel.send(':fork_knife_plate: Kunde inte hitta menyn för denna vecka.')
          }
        })
      } else {
        Subscriptions.destroy({
          where: {
            discordId: message.author.id
          }
        }).then(() => {
          log('LOG', `${message.author.username} unsubscribed.`)
          message.reply('Du har tagits bort från listan :outbox_tray:')
        })
      }
    })
  }
}

commands[process.env.MENU_COMMAND] = {
  enabled: process.env.ALLOW_MENU_COMMAND,
  check: () => {
    return true
  },
  action: async (client, message, args) => {
    const base = args[1] || moment().format('W')
    const date = moment().week(base)
    log('LOG', `${message.author.username} requested the menu from week ${date.format('W')}.`)
    try {
      const fpath = `tmp/eatery-${date.format('YYYY-WW')}.txt`
      if (!args[1]) {
        const url = await scrape()
        await download(url, date)
      }
      const data = await ocr(date)
      embed(message.channel, data, date)
    } catch (error) {
      log('ERROR', error, '#ff0000')
      message.channel.send(':fork_knife_plate: Kunde inte hitta menyn för denna vecka.')
    }
  }
}

commands[process.env.LINK_COMMAND] = {
  enabled: process.env.ALLOW_LINK_COMMANDS,
  check: (client, message, args) => {
  	if (message.guild === null) return false
    if (message.guild.owner.id === message.author.id) {
      return true
    }
  },
  error: 'Endast ägaren av servern kan använda detta kommando :no_entry_sign:',
  action: async (client, message, args) => {
    Servers.findOne({ where: { serverId: message.guild.id } }).then(subx => {
      if (!subx) {
        Servers.create({ serverId: message.guild.id, channelId: message.channel.id }).then(
          async user => {
            log(
              'LOG',
              `${message.author.username} added ${message.guild.name} to automatic messaging.`
            )
            message.reply('Kanalen är nu ansluten :bulb:')
            const date = moment()
            try {
              const url = await scrape()
              await download(url, date)
              const data = await ocr(date)
              embed(message.channel, data, date)
            } catch (error) {
              log('ERROR', error, '#ff0000')
              message.channel.send(':fork_knife_plate: Kunde inte hitta menyn för denna vecka.')
            }
          }
        )
      } else {
        message.reply('En kanal är redan ansluten :warning:')
      }
    })
  }
}

commands[process.env.UNLINK_COMMAND] = {
  enabled: process.env.ALLOW_LINK_COMMANDS,
  check: (client, message, args) => {
  	if (message.guild === null) return false
    if (message.guild.owner.id === message.author.id) {
      return true
    }
  },
  error: 'Endast ägaren av servern kan använda detta kommando :no_entry_sign:',
  action: async (client, message, args) => {
    Servers.destroy({
      where: {
        serverId: message.guild.id
      }
    }).then(() => {
      log(
        'LOG',
        `${message.author.username} removed ${message.guild.name} from automatic messaging.`
      )
      message.reply('Den anslutna kanalen är inte längre ansluten :electric_plug:')
    })
  }
}

commands[process.env.HELP_COMMAND] = {
  enabled: process.env.ALLOW_HELP_COMMAND,
  check: () => {
    return true
  },
  action: async (client, message, args) => {
    message.channel.send({
      embed: {
        title: 'Lunchbot',
        color: 7506394,
        fields: [
          {
            name: 'Lunchmenyn',
            value:
              'Du kan använda kommandot `<lunch {alternativt veckonummer}` för att skriva ut lunchmenyn i chatten du skriver i.'
          },
          {
            name: 'Prenumerera',
            value:
              'Kommandot `<sub` prenumererar ditt konto till att ta emot lunchmenyn direkt via dina direktmeddelanden varje måndag. Du kan också avprenumerera genom att använda samma kommando igen.'
          },
          {
            name: 'Länkning',
            value:
              'Som serverägare har du tillgång till kommandot `<link` och `<unlink`, dessa kommandon används för att ansluta en kanal i din server till att ta emot lunchmenyn. `<unlink` kan användas i alla kanaler men `<link` måste användas i kanalen du vill ta emot meddelanden i.'
          }
        ]
      }
    })
  }
}

export default async function(client, message) {
  if (message.author.bot) return
  const parse = message.content.split(' ')
  const command = parse[0]

  if (commands[command]) {
    if (commands[command].enabled) {
      if (commands[command].check(client, message, parse)) {
        commands[command].action(client, message, parse)
      } else {
        if (commands[command].error) {
          message.reply(commands[command].error)
        }
      }
    }
  }
}
