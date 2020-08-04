import Discord from 'discord.js'
import {format} from '../'
import dotenv from 'dotenv'

dotenv.config()

export default async (channel, data, date) => {
  const embed = new Discord.RichEmbed()
    .setFooter(
      `Lunchbot – För att få lunchmenyn direkt i dina DM:s, skriv ${process.env.SUB_COMMAND}.`,
      'https://i.imgur.com/QCfAJ9S.png'
    )
    .setColor(0x7289da)

  embed.setURL(`${process.env.BASE_URL}?week=${date.format("W")}&year=${date.format("YYYY")}`)

  const res = await format(data)
  embed.setTitle(res.title)

  for (let i = 0; i < Object.keys(res.data).length; i++) {
    embed.addField(Object.keys(res.data)[i], res.data[Object.keys(res.data)[i]])
  }

  channel.send({ embed })
}
