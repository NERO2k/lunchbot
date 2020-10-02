import { Command } from "discord-akairo";
import { getMenu } from "App/Common/HelperFunctions";
import { embed } from "App/Common/DiscordHelpers";
import moment from "moment/";
import Logger from "@ioc:Adonis/Core/Logger";

class MenuCommand extends Command {
  constructor() {
    super("menu", {
      aliases: ["meny", "menu", "lunch"],
      args: [
        {
          id: "date",
          type: "string",
          default: () => moment().format("WW-YYYY"),
        },
        {
          id: "format",
          type: "string",
          default: "WW-YYYY",
        },
      ],
    });
  }

  async exec(message, args) {
    try {
      const date = moment(args.date, args.format);
      Logger.info(`User ${message.author.id} aka ${message.author.username} fetched the menu for week ${date.format("WW")}.`)

      let res;
      try {
        res = await getMenu(date, false, true);
      } catch (error) {
        await message.reply(error.message);
      }
      if (!res) return;

      const embedCode = embed(res, date);

      message.channel.send(embedCode);
    } catch(error) {
      console.log(error)
      message.channel.send({
        "embed": {
          "title": ":warning: Något gick fel.",
          "description": error.message,
          "color": 16776960
        }
      })
    }
  }
}

export default MenuCommand;
