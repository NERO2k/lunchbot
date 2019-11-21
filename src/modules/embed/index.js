import Discord from 'discord.js'
import {format} from '../'

export default async (channel, data, extURL) => {
  let url = extURL || 'https://eatery.se'

  const embed = new Discord.RichEmbed()
    .setFooter(
      `Lunchbot – För att få lunchmenyn direkt i dina DM:s, skriv ${process.env.SUB_COMMAND}.`,
      'https://i.imgur.com/QCfAJ9S.png'
    )
    .setColor(0x7289da)

  if (url) embed.setURL(url)

  const res = await format(data)
  embed.setTitle(res.title)

  for (let i = 0; i < Object.keys(res.data).length; i++) {
    embed.addField(Object.keys(res.data)[i], res.data[Object.keys(res.data)[i]])
  }

  embed.addField('Extra', res.extras)
  channel.send({ embed })
}
