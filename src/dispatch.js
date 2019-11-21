import { Servers, Subscriptions } from './db'
import { scrape, ocr, log, embed, download } from './modules'
import moment from 'moment'

export default async function(client) {
  const date = moment()
  try {
    const url = await scrape()
    await download(url, date)
    const data = await ocr(date)
    const channel = client.channels.get(process.env.SCHEDULE_CHANNEL)
    if (channel) embed(channel, data, date)
    Subscriptions.findAll().then(sub => {
      for (let i = 0; i < sub.length; i++) {
        let userChannel = client.users.get(sub[i].discordId)
        if (userChannel) embed(userChannel, data, date)
        log('LOG', `Sent Eatery menu to ${sub[i].discordId}`)
      }
    })
    Servers.findAll().then(sub => {
      for (let i = 0; i < sub.length; i++) {
        let channelGuild = client.channels.get(sub[i].channelId)
        if (channelGuild) embed(channelGuild, data, date)
        log('LOG', `Sent Eatery menu to ${sub[i].channelId} in ${sub[i].serverId}`)
      }
    })
  } catch (error) {
    log('ERROR', `Kunde inte hitta menyn för vecka ${moment().format('W')}`)
    log('ERROR', error)
  }
}
