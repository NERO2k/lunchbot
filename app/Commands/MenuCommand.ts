import {Command} from 'discord-akairo'
import {getMenu} from "App/Common/HelperFunctions";
import moment from "moment";
import Discord from 'discord.js'
import Env from "@ioc:Adonis/Core/Env";
import {engDayCast} from "../../config/words";

class MenuCommand extends Command {
    constructor() {
        super('menu', {
            aliases: ['meny', 'menu'],
            args: [
              {
                id: 'date',
                type: 'string',
                default: () => moment().format("WW-YYYY")
              },
              {
                id: 'format',
                type: 'string',
                default: "WW-YYYY"
              }
            ]
        });
    }

    async exec(message, args) {
      const date = moment(args.date, args.format);

      let res;
      try {
        res = await getMenu(date, false)
      } catch (error) {
        message.reply(error.message)
      }
      if (!res) return;

      const embed = new Discord.MessageEmbed()
        .setFooter(
          `Lunchbot – Få lunchmenyn direkt i dina DM:s, skriv kommandot <sub.`,
          'https://i.imgur.com/QCfAJ9S.png'
        )
        .setColor(0x7289da)

      embed.setURL(`${Env.get("WEBSITE_BASE_URL")}?date=${date.format("WW-YYYY")}&format=WW-YYYY`)

      embed.setTitle("EATERY KISTA NOD — MENY VECKA "+res.listed_week)

      Object.keys(res.menu).forEach((value) => {
        const day = engDayCast[value] || value;
        embed.addField(day.charAt(0).toUpperCase()+day.slice(1), res.menu[value].join("\n"))
      });

      message.channel.send({ embed })
    }
}

export default MenuCommand

