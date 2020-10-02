import { Command } from "discord-akairo";
import User from "App/Models/User";
import { getMenu } from "App/Common/HelperFunctions";
import moment from "moment/";
import { embed } from "App/Common/DiscordHelpers";
import Logger from "@ioc:Adonis/Core/Logger";

class SubCommand extends Command {
  constructor() {
    super("sub", {
      aliases: ["sub"],
    });
  }

  async exec(message) {
    try {
      if (message.channel.type !== "dm") {
        const userCheck = await User.findBy('user_id', message.author.id)
        if (!userCheck) {
          await message.reply(
            "På grund av Discord API restriktioner så måste detta kommandot användas i din DM kanal med Lunchbot."
          );
          return;
        }
      }

      const user = await User.firstOrCreate(
        { user_id: message.author.id },
        {
          user_id: message.author.id,
          channel_id: message.channel.id,
          enabled: false,
        }
      );

      if (!user.enabled) {
        Logger.info(`User ${message.author.id} aka ${message.author.username} subscribed to lunch the menu.`)
        user.enabled = true;
        await user.save();
        await message.reply("Du är nu på listan :inbox_tray:");

        const menu = await getMenu(moment(), false, true);
        await message.author.send(embed(menu, moment()));
      } else {
        Logger.info(`User ${message.author.id} aka ${message.author.username} unsubscribed to the lunch menu.`)

        user.enabled = false;
        await user.save();
        await message.reply("Du har tagits bort från listan :outbox_tray:");
      }
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

export default SubCommand;
