import Discord from 'discord.js'

function isUpperCase(str) {
  return str === str.toUpperCase()
}

export default (channel, data, url) => {
  let menu = data.split('\n')
  let embedData = []
  let extras = ''
  let current = null

  const embed = new Discord.RichEmbed()
    .setURL(url)
    .setTitle(menu[2])
    .setFooter(
      `Lunchbot 1.0 | För att få lunchmenyn i dina DM:s, skriv ${process.env.SUB_COMMAND}.`,
      'https://i.imgur.com/QCfAJ9S.png'
    )
    .setColor(0x7289da)
  for (let i = 3; i < menu.length; i++) {
    if (menu[i] !== '' && menu[i] !== null) {
      let msgSplit = menu[i].split(' ')
      if (!isUpperCase(msgSplit[0])) {
        if (msgSplit.length === 1) {
          embedData[menu[i]] = ''
          current = menu[i]
          i = i + 1
        } else {
          if (msgSplit[0] !== 'Lunchen') embedData[current] = `${embedData[current] + menu[i]}\n`
        }
      } else {
        if (msgSplit[0] !== 'VÄLKOMMEN') extras = `${extras + menu[i]}\n`
      }
    }
  }

  for (let i = 0; i < Object.keys(embedData).length; i++) {
    embed.addField(Object.keys(embedData)[i], embedData[Object.keys(embedData)[i]])
  }
  embed.addField('Extra', extras)
  channel.send({ embed })
}
