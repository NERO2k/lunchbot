import {Command} from 'discord-akairo'
import {getMenu} from "App/Common/HelperFunctions";
import {embed} from "App/Common/DiscordHelpers";
import moment from "moment/";

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

      const embedCode = embed(res, date)

      message.channel.send({ embedCode })
    }
}

export default MenuCommand

