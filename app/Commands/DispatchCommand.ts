import { Command } from "discord-akairo";
import { getMenu } from "App/Common/HelperFunctions";
import { dispatch } from "App/Common/DiscordHelpers";
import moment from "moment/";

class DispatchCommand extends Command {
  constructor() {
    super("dispatch", {
      aliases: ["dispatch"],
      ownerOnly: true,
    });
  }

  async exec(message) {
    try {
      await message.reply("Running schedule job.");
      const data = await getMenu(moment(), false, true);
      await dispatch(message.client, data, moment());
      await message.reply("Ran schedule job.");
    } catch(error) {
      console.log(error);
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

export default DispatchCommand;
